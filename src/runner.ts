import { Candle, convertInterval } from '@src/candle';
import { Instrument, filteredInstruments } from '@src/instrument';
import { Milliseconds, MinuteInMs, inDayRange } from '@src/date';
import { Position, getPositionByInstrument, getPositions } from '@src/position';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';
import { getOrder, placeOrder, priceToPlaceOrder, pushOrder } from '@src/order';

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
  const currentPositions: Position[] = options.isLive ? await getPositions() : [];
  for (const instrument of instruments) {
    const history = await getOptimizedHistory(instrument.instrumentToken, options.from, options.to);
    const changedInterval = convertInterval(history, options.recurring);
    const position = await getPositionByInstrument(currentPositions, instrument);
    for (const candle of changedInterval) {
      const orders = await getOrder();
      const latestOrder = orders[0];
      // simplify order
      // order -> position -> quantity
      // clean order after each execution
      const price = await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        instrument,
        price: position ? (position.quantity > 0 ? position.average_price : -position.average_price) : 0,
      });
      if (price !== 0) {
        const order = priceToPlaceOrder({ instrument, price, quantity: options.quantity });
        await pushOrder(order);
        if (options.isLive) {
          await placeOrder(order);
        }
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
