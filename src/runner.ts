import { Candle } from '@src/candle';
import { Instrument, filteredInstruments } from '@src/instrument';
import { Milliseconds, MinuteInMs } from '@src/date';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';

export async function runAlgo(
  from: Milliseconds,
  to: Milliseconds,
  algoName: string,
  quantity: number,
  isLive: Boolean
) {
  const instruments = await filteredInstruments(['2']);
  for (const instrument of instruments) {
    const history = await getOptimizedHistory(from, to, instrument.id);
    for (const candle of history) {
      await runAlgoEachCandle({
        candle,
        algoName,
        instrument,
      });
    }
  }
}

interface RunAlgoEachCandleOptions {
  candle: Candle;
  algoName: string;
  instrument: Instrument;
}

export async function runAlgoEachCandle(options: RunAlgoEachCandleOptions) {
  const type = 'trade';
  const algo = getAlgo(options.algoName);
  const algoFrom = options.candle.timestamp - algo.timeInterval;
  const algoTo = options.candle.timestamp + MinuteInMs;
  const algoCandles = await getOptimizedHistory(algoFrom, algoTo, options.instrument.id);
  return type === 'trade' ? algo.trade(algoCandles) : algo.squareoff(algoCandles);
}
