import { Candle } from '@src/candle';
import { MinuteInMs, WeekInMs } from '@src/date';

export const candlesLimit = WeekInMs;
export const timeInterval = 5 * MinuteInMs;
export const name = 'uni';

export function trade(candles: Candle[]) {
  return 'buy';
}

export function squareoff(candles: Candle[]) {
  return 'sell';
}
