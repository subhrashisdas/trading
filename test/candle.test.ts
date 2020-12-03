import { DayInMs, MinuteInMs } from '@src/date';
import { convertInterval, convertOhlvcCandlesToTradeJson, groupByCandles } from '@src/candle';
import { deepStrictEqual } from 'assert';

import {
  dailyCandles,
  fifteenMinuteCandles,
  multipleDaysCandles,
  multipleDaysCandlesGrouped,
  thirtyMinuteCandles,
} from '@test/fixtures/candles';

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

export function groupByCandlesTest() {
  deepStrictEqual(
    groupByCandles(convertOhlvcCandlesToTradeJson(multipleDaysCandles), DayInMs),
    multipleDaysCandlesGrouped.map(convertOhlvcCandlesToTradeJson)
  );
}
