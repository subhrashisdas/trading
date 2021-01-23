import { MinuteInMs } from '@src/date';
import {
  OhlvcCandle,
  convertInterval,
  convertOhlvcCandleToTradeJson,
  convertOhlvcCandlesToTradeJson,
  trendCandle,
  trendCandles,
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

export function trendCandlesTest() {
  const trendCandlesFixturesAndResults: OhlvcCandle[] = [
    ['2020-11-10T09:15:00+0530', 10, 95, 5, 30, 0, 0],
    ['2020-11-10T09:45:00+0530', 50, 95, 5, 70, 0, 0],
    ['2020-11-10T09:15:00+0530', 25, 95, 5, 5, 0, 0],
  ];
  const candles = convertOhlvcCandlesToTradeJson(trendCandlesFixturesAndResults);
  deepStrictEqual(trendCandles(candles), candles[2]);
}
