import { Candle } from '@src/candle';
import { HourInMs, MinuteInMs, WeekInMs } from '@src/date';

export const candlesLimit = WeekInMs;
export const timeInterval = 5 * MinuteInMs;
export const name = 'uni';
export const startAt = new Date(5 * HourInMs).getTime();
export const endAt = new Date(10 * HourInMs).getTime();

export function trade(candles: Candle[]): number {
  return -100;
}

export function squareoff(price: Number, candles: Candle[]): number {
  return +100;
}
