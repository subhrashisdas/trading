import { DayInMs, HourInMs, MinuteInMs } from '@src/date';
import { convertInterval, convertOhlvcCandlesToTradeJson, groupByCandles, keepOneCandleInRange } from '@src/candle';
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

export function keepOneCandleInRangeTest() {
  console.log(
    JSON.stringify(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles).filter((_, index) => index % 4 === 0))
  );
  console.log(JSON.stringify(keepOneCandleInRange(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles), HourInMs)));
  deepStrictEqual(
    keepOneCandleInRange(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles), HourInMs),
    convertOhlvcCandlesToTradeJson(fifteenMinuteCandles).filter((_, index) => index % 4 === 0)
  );
}
