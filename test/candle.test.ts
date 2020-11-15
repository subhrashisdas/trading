import { Candle, convertInterval } from '@src/candle';
import { MinuteInMs } from '@src/date';
import { deepStrictEqual } from 'assert';

export function convertIntervalTest() {
  const oneMinuteCandles: Candle[] = [];
  const fiveMinuteCandles: Candle[] = [];
  convertInterval(oneMinuteCandles, MinuteInMs);
  deepStrictEqual(oneMinuteCandles, fiveMinuteCandles);
}
