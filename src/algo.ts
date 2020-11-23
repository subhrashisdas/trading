import { Candle } from '@src/candle';
import { WeekInMs } from './date';

export const candlesLimit = WeekInMs;

export function trade(candles: Candle[]) {
  return 'buy';
}

export function squareoff(candles: Candle[]) {
  return 'sell';
}
