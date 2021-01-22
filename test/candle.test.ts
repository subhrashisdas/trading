import { MinuteInMs } from '@src/date';
import {
  convertInterval,
  convertOhlvcCandleToTradeJson,
  convertOhlvcCandlesToTradeJson,
  trendCandle,
} from '@src/candle';
import { deepStrictEqual } from 'assert';

import { fifteenMinuteCandles, thirtyMinuteCandles, trendCandleFixturesAndResults } from '@test/fixtures/candles';

export function convertIntervalTest() {
  deepStrictEqual(
    convertInterval(convertOhlvcCandlesToTradeJson(fifteenMinuteCandles), 30 * MinuteInMs),
    convertOhlvcCandlesToTradeJson(thirtyMinuteCandles)
  );
}

export function trendCandleTest() {
  for (const trendCandleFixturesAndResult of trendCandleFixturesAndResults) {
    const [dominatingCandle, currentCandle, index] = trendCandleFixturesAndResult;
    const trendCandleKnownAnswer =
      index === 0 ? convertOhlvcCandleToTradeJson(dominatingCandle) : convertOhlvcCandleToTradeJson(currentCandle);
    const dominatingCandleTradeJson = convertOhlvcCandleToTradeJson(dominatingCandle);
    const currentCandleTradeJson = convertOhlvcCandleToTradeJson(currentCandle);
    deepStrictEqual(trendCandle(dominatingCandleTradeJson, currentCandleTradeJson), trendCandleKnownAnswer);
  }
}
