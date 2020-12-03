import { DayInMs, MinuteInMs } from '@src/date';
import { convertInterval, convertOhlvcCandlesToTradeJson, groupByCandles } from '@src/candle';
import { deepStrictEqual } from 'assert';

import {
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
}

export function groupByCandlesTest() {
  deepStrictEqual(
    groupByCandles(convertOhlvcCandlesToTradeJson(multipleDaysCandles), DayInMs),
    multipleDaysCandlesGrouped.map(convertOhlvcCandlesToTradeJson)
  );
}
