import { convertInterval, convertOhlvcCandlesToTradeJson } from '@src/candle';
import { MinuteInMs } from '@src/date';
import { deepStrictEqual } from 'assert';

import { fifteenMinuteCandles, thirtyMinuteCandles } from '@test/fixtures/candles';

export function convertIntervalTest() {
  deepStrictEqual(
    convertInterval(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles), 30 * MinuteInMs),
    convertOhlvcCandlesToTradeJson(thirtyMinuteCandles)
  );
}
