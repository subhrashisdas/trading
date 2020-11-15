import { convertInterval, convertOhlvcCandlesToTradeJson } from '@src/candle';
import { HourInMs } from '@src/date';
import { deepStrictEqual } from 'assert';

import { fifteenMinuteCandles, hourCandles } from '@test/fixtures/candles';

export function convertIntervalTest() {
  deepStrictEqual(convertInterval(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles), HourInMs), hourCandles);
}
