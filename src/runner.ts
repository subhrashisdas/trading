import { ceilToNearestMilliseconds, DayInMs, Milliseconds, MinuteInMs } from '@src/date';
import { filteredInstruments } from '@src/instrument';
import { getOptimizedHistory } from '@src/history';
import { Candle } from '@src/candle';
import { getAlgo } from '@src/algo';

export async function runAlgo(from: Milliseconds, to: Milliseconds, algoName: string) {
  const instruments = await filteredInstruments(['2']);
  for (const instrument of instruments) {
    const candles = await getOptimizedHistory(from, to, instrument.id);
    let ordersToBePlaced: Candle[] = [];
    for (const candle of candles) {
      const algo = getAlgo(algoName);
      const algoFrom = candle.timestamp - algo.timeInterval;
      const algoTo = candle.timestamp + MinuteInMs;
      const algoCandles = await getOptimizedHistory(algoFrom, algoTo, instrument.id);
      await algo.trade(algoCandles);

      // TODO: If ordersToBePlaced has algo candles then run
      await algo.squareoff(algoCandles);
      // TODO: push to trades
      // TODO: convert candles to trades
      // TODO: filter candles
      // TODO: based on order API place order
      if (candle.timestamp < ceilToNearestMilliseconds(candle.timestamp, DayInMs)) {
        ordersToBePlaced = [];
      }
    }
  }
}
