import { Candle, convertInterval } from '@src/candle';
import { HourInMs, Milliseconds, MinuteInMs, inDayRange } from '@src/date';
import { Instrument, filteredInstruments } from '@src/instrument';
import { Order, priceToPlaceOrder, pushOrder } from '@src/order';
import { Position, getPositions, getQuantityByInstrumentId } from '@src/position';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';
import { option } from 'commander';

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
    const history = await getOptimizedHistory(options.from, options.to, instrument.id);
    const changedInterval = convertInterval(history, options.recurring);
    for (const candle of changedInterval) {
      const price = await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        instrument,
        price: await getQuantityByInstrumentId(currentPositions, instrument.id),
      });
      const order = priceToPlaceOrder({});
      await pushOrder(order);
      if (options.isLive) {
        await priceToPlaceOrder({});
      }
    }
  }
}

interface RunAlgoEachCandleOptions {
  candle: Candle;
  algoName: string;
  instrument: Instrument;
  price: Number;
}

export async function runAlgoEachCandle(options: RunAlgoEachCandleOptions) {
  const algo = getAlgo(options.algoName);
  const algoFrom = options.candle.timestamp - algo.timeInterval;
  const algoTo = options.candle.timestamp + MinuteInMs;
  const algoCandles = await getOptimizedHistory(algoFrom, algoTo, options.instrument.id);
  console.log(inDayRange(algo.startAt, algo.endAt, options.candle.timestamp));
  return inDayRange(algo.startAt, algo.endAt, options.candle.timestamp)
    ? options.price === 0
      ? algo.trade(algoCandles)
      : algo.squareoff(algoCandles)
    : -options.price;
}
