import { MinuteInMs } from "@src/date";
import {
  OhlvcCandle,
  candleChange,
  convertInterval,
  convertOhlvcCandleToTradeJson,
  convertOhlvcCandlesToTradeJson,
  roundOffFilterCandles,
  trendCandle,
  trendCandles
} from "@src/candle";
import { deepStrictEqual } from "assert";

import { fifteenMinuteCandles, thirtyMinuteCandles, trendCandleFixturesAndResults } from "@test/fixtures/candles";

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
    ["2020-11-10T09:15:00+0530", 10, 95, 5, 30, 0, 0],
    ["2020-11-10T09:45:00+0530", 50, 95, 5, 70, 0, 0],
    ["2020-11-10T09:15:00+0530", 25, 95, 5, 5, 0, 0]
  ];
  const candles = convertOhlvcCandlesToTradeJson(trendCandlesFixturesAndResults);
  deepStrictEqual(trendCandles(candles), candles[2]);
}

export function candleChangeTest() {
  const trendCandlesFixturesAndResults: OhlvcCandle = ["2020-11-10T09:15:00+0530", 10, 95, 5, 30, 0, 0];
  const candle = convertOhlvcCandleToTradeJson(trendCandlesFixturesAndResults);
  deepStrictEqual(candleChange(candle), 20);
}

export function roundOffFilterCandlesTest() {
  const candles = convertOhlvcCandlesToTradeJson(fifteenMinuteCandles);
  console.log(candles.slice(candles.length - 10, candles.length).length);
  deepStrictEqual(
    candles.slice(candles.length - 10, candles.length),
    roundOffFilterCandles(candles, 45 * MinuteInMs, 3)
  );
}
