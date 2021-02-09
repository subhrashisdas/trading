import { Candle, convertInterval } from "@src/candle";
import { Instrument, filteredInstruments } from "@src/instrument";
import { Milliseconds, MinuteInMs, inDayRange } from "@src/date";
import { getAlgo } from "@src/algo";
import { getOptimizedHistory } from "@src/history";
import { getPositionByInstrument, getPositions, placeOrder } from "@src/position";

export interface RunAlgoOptions {
  from: Milliseconds;
  to: Milliseconds;
  algoName: string;
  quantity: number;
  isLive: Boolean;
  recurring: Milliseconds;
  instrumentNames: string[];
}

function logEvents(
  time: number,
  price: number,
  profit: number,
  totalProfitCount: number,
  totalLossCount: number,
  profitByLossCountRatio: number,
  profitByLossValueRatio: number
) {
  const localDateTime = new Date(time).toLocaleString();
  console.log(
    [
      localDateTime,
      "₹" + price,
      "P = ₹" + profit,
      "P = " + totalProfitCount,
      "L = " + totalLossCount,
      "P/L = " + profitByLossCountRatio.toFixed(2),
      "P/L = ₹" + profitByLossValueRatio.toFixed(2)
    ].join("\t\t")
  );
}

export async function runAlgo(options: RunAlgoOptions) {
  const instruments = await filteredInstruments(options.instrumentNames);
  const currentPositions = options.isLive ? await getPositions() : [];
  const newTransactions = [];
  for (const instrument of instruments) {
    const history = await getOptimizedHistory(instrument.instrumentToken, options.from, options.to);
    const changedInterval = convertInterval(history, options.recurring);
    const position = getPositionByInstrument(currentPositions, instrument);
    let oldPrice = position?.price || 0;
    let profit = 0;

    let totalProfitValue = 0;
    let totalLossValue = 0;

    let totalProfitCount = 0;
    let totalLossCount = 0;

    let profitByLossCountRatio = 0;
    let profitByLossValueRatio = 0;

    for (const candle of changedInterval) {
      const newPrice = await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        instrument,
        price: oldPrice
      });

      if ((oldPrice > 0 && newPrice < 0) || (oldPrice < 0 && newPrice > 0)) {
        // Analytics
        profit = newPrice + oldPrice;
        totalProfitValue = profit > 0 ? totalProfitValue + profit : totalProfitValue;
        totalLossValue = profit < 0 ? totalLossValue + profit : totalLossValue;
        totalProfitCount = profit > 0 ? ++totalProfitCount : totalProfitCount;
        totalLossCount = profit < 0 ? ++totalLossCount : totalLossCount;
        profitByLossCountRatio = totalProfitCount / (totalLossCount + 1);
        profitByLossValueRatio = totalProfitValue / (totalLossValue + 1);

        oldPrice = 0;
      } else if (newPrice !== 0) {
        profit = 0;
        oldPrice = newPrice;
      }

      if (newPrice !== 0) {
        logEvents(
          candle.timestamp,
          newPrice,
          profit,
          totalProfitCount,
          totalLossCount,
          profitByLossCountRatio,
          profitByLossValueRatio
        );
        if (options.isLive) {
          await placeOrder({
            instrument: instrument,
            quantity: options.quantity,
            price: newPrice
          });

          newTransactions.push({
            instrument,
            timestamp: candle.timestamp,
            price: newPrice
          });
        }
      }
    }
  }
  return newTransactions;
}

interface RunAlgoEachCandleOptions {
  candle: Candle;
  algoName: string;
  instrument: Instrument;
  price: number;
}

export async function runAlgoEachCandle(options: RunAlgoEachCandleOptions) {
  const algo = getAlgo(options.algoName);
  const algoFrom = options.candle.timestamp - algo.timeInterval;
  const algoTo = options.candle.timestamp + MinuteInMs;
  const algoCandles = await getOptimizedHistory(options.instrument.instrumentToken, algoFrom, algoTo);
  return inDayRange(algo.startAt, algo.endAt, options.candle.timestamp)
    ? options.price === 0
      ? algo.trade(algoCandles)
      : algo.squareoff(options.price, algoCandles)
    : -options.price;
}
