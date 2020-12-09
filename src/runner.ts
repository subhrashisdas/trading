import { Candle, convertInterval } from '@src/candle';
import { Instrument, filteredInstruments } from '@src/instrument';
import { Milliseconds, MinuteInMs } from '@src/date';
import { Order } from '@src/order';
import { Position, getPositions, getQuantityByInstrumentId } from '@src/position';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';

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
  const orders: Order[] = [];
  for (const instrument of instruments) {
    const history = await getOptimizedHistory(options.from, options.to, instrument.id);
    const changedInterval = convertInterval(history, options.recurring);
    for (const candle of changedInterval) {
      const quantity = await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        instrument,
        quantity: await getQuantityByInstrumentId(currentPositions, instrument.id),
      });
      if (quantity !== 0) {
        // if live run live order
        // make position and order same
        // Push to file
      }
    }
  }
}

interface RunAlgoEachCandleOptions {
  candle: Candle;
  algoName: string;
  instrument: Instrument;
  quantity: Number;
}

export async function runAlgoEachCandle(options: RunAlgoEachCandleOptions) {
  const algo = getAlgo(options.algoName);
  const algoFrom = options.candle.timestamp - algo.timeInterval;
  const algoTo = options.candle.timestamp + MinuteInMs;
  const algoCandles = await getOptimizedHistory(algoFrom, algoTo, options.instrument.id);
  return options.quantity === 0 ? algo.trade(algoCandles) : algo.squareoff(algoCandles);
}
