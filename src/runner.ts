import { Candle, convertInterval } from '@src/candle';
import { Instrument, filteredInstruments } from '@src/instrument';
import { Milliseconds, MinuteInMs, ceilToNearestMilliseconds } from '@src/date';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';
import { getQuantityByInstrumentId } from '@src/position';

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
  for (const instrument of instruments) {
    const history = await getOptimizedHistory(options.from, options.to, instrument.id);
    const changedInterval = convertInterval(history, options.recurring);
    for (const candle of changedInterval) {
      await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        instrument,
        cacheTill: ceilToNearestMilliseconds(candle.timestamp, options.recurring),
      });
    }
  }
}

interface RunAlgoEachCandleOptions {
  candle: Candle;
  algoName: string;
  instrument: Instrument;
  cacheTill: Milliseconds;
}

export async function runAlgoEachCandle(options: RunAlgoEachCandleOptions) {
  const quantity = await getQuantityByInstrumentId(options.instrument.instrument_token, options.cacheTill);
  const algo = getAlgo(options.algoName);
  const algoFrom = options.candle.timestamp - algo.timeInterval;
  const algoTo = options.candle.timestamp + MinuteInMs;
  const algoCandles = await getOptimizedHistory(algoFrom, algoTo, options.instrument.id);
  return quantity === 0 ? algo.trade(algoCandles) : algo.squareoff(algoCandles);
}
