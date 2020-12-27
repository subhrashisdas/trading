import { Candle } from '@src/candle';
import { MinuteInMs, WeekInMs } from '@src/date';

export const candlesLimit = WeekInMs;
export const timeInterval = 5 * MinuteInMs;
export const name = 'uni';
export const startAt = '';
export const endAt = '';

export function trade(candles: Candle[]): number {
  return -0;
}

export function squareoff(candles: Candle[]): number {
  return +0;
}
