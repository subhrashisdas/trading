import { Candle, convertInterval } from '@src/candle';
import { Instrument, filteredInstruments } from '@src/instrument';
import { Milliseconds, MinuteInMs, inDayRange } from '@src/date';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';
import { getPositionByInstrument, getPositions, placeOrder } from '@src/position';

export interface RunAlgoOptions {
  from: Milliseconds;
  to: Milliseconds;
  algoName: string;
  quantity: number;
  isLive: Boolean;
  recurring: Milliseconds;
  instrumentNames: string[];
}

export async function runAlgo(options: RunAlgoOptions) {
  const instruments = await filteredInstruments(options.instrumentNames);
  const currentPositions = options.isLive ? await getPositions() : [];
  for (const instrument of instruments) {
    const history = await getOptimizedHistory(instrument.instrumentToken, options.from, options.to);
    const changedInterval = convertInterval(history, options.recurring);
    const position = await getPositionByInstrument(currentPositions, instrument);
    let price = position?.price || 0;
    for (const candle of changedInterval) {
      const newPrice = await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        instrument,
        price,
      });
      price = newPrice === 0 ? price : newPrice;
      console.log(newPrice);
      if (newPrice !== 0 && options.isLive) {
        await placeOrder({
          instrument: instrument,
          quantity: options.quantity,
          price,
        });
      }
    }
  }
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
