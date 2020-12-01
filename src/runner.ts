import { ceilToNearestMilliseconds, DayInMs, Milliseconds } from '@src/date';
import { filteredInstruments } from '@src/instrument';
import { getOptimizedHistory } from '@src/history';
import { Candle } from './candle';

export async function runAlgo(from: Milliseconds, to: Milliseconds, algoName: string) {
  const instruments = await filteredInstruments(['2']);
  for (const instrument of instruments) {
    const candles = await getOptimizedHistory(from, to, instrument.id);
    let ordersToBePlaced: Candle[] = [];
    for (const candle of candles) {
      // TODO: get data
      // TODO: run algo
      // TODO: get input and push.
      // Repeat
      if (candle.timestamp < ceilToNearestMilliseconds(candle.timestamp, DayInMs)) {
        ordersToBePlaced = [];
      }
    }
  }
}
