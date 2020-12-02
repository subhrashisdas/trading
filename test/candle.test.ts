import { DayInMs, MinuteInMs } from '@src/date';
import { convertInterval, convertOhlvcCandlesToTradeJson } from '@src/candle';
import { deepStrictEqual } from 'assert';

import { dailyCandles, fifteenMinuteCandles, thirtyMinuteCandles } from '@test/fixtures/candles';

export function convertIntervalTest() {
  deepStrictEqual(
    convertInterval(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles), 30 * MinuteInMs),
    convertOhlvcCandlesToTradeJson(thirtyMinuteCandles)
  );

  deepStrictEqual(
    convertInterval(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles), DayInMs),
    convertOhlvcCandlesToTradeJson(dailyCandles)
  );
}
