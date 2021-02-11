import { Candle, candleChange, convertInterval, roundOffFilterCandles, trendCandles } from "@src/candle";
import { DayInMs, HourInMs, MinuteInMs, WeekInMs } from "@src/date";
import { calculatePivot } from "@src/pivot";
import { inRange } from "lodash";

export const candlesLimit = WeekInMs;
export const timeInterval = 6 * 4 * WeekInMs;
export const name = "udts";
export const startAt = new Date(5 * HourInMs).getTime();
export const endAt = new Date(10 * HourInMs).getTime();

export function trade(candles: Candle[]): number {
  const latestCandle = candles[candles.length - 1];
  const fifteenMinutesTrend = candleChange(
    trendCandles(convertInterval(roundOffFilterCandles(candles, 15 * MinuteInMs, 3), 15 * MinuteInMs))
  );
  const dailyTrend = candleChange(trendCandles(convertInterval(roundOffFilterCandles(candles, DayInMs, 3), DayInMs)));
  const weeklyTrend = candleChange(
    trendCandles(convertInterval(roundOffFilterCandles(candles, WeekInMs, 3), WeekInMs))
  );
  const monthlyTrend = candleChange(
    trendCandles(convertInterval(roundOffFilterCandles(candles, WeekInMs, 12), 4 * WeekInMs))
  );
  if (fifteenMinutesTrend > 0 && dailyTrend > 0 && weeklyTrend > 0 && monthlyTrend > 0) {
    return latestCandle.close;
    // } else if (fifteenMinutesTrend < 0 && dailyTrend < 0 && weeklyTrend < 0 && monthlyTrend < 0) {
    //   return -latestCandle.close;
  } else {
    return 0;
  }
}

// Validation current price can't be lower that other price
export function squareoff(price: number, candles: Candle[]): number {
  const currentCandle = candles[candles.length - 1];
  const trendCandle = trendCandles(
    convertInterval(roundOffFilterCandles(candles, 15 * MinuteInMs, 0), 15 * MinuteInMs)
  );
  const pivotData = calculatePivot(trendCandle);
  const boughtPrice = price;
  const currentPrice = currentCandle.close;

  // If Buy
  if (price > 0) {
    if (inRange(pivotData.pivotPoint, boughtPrice, currentPrice)) {
      return 0;
    }
    if (inRange(pivotData.resistance1, boughtPrice, currentPrice)) {
      return 0;
    }
    if (inRange(pivotData.resistance2, boughtPrice, currentPrice)) {
      return 0;
    }
    if (inRange(pivotData.resistance3, boughtPrice, currentPrice)) {
      return 0;
    }
    if (inRange(pivotData.resistance4, boughtPrice, currentPrice)) {
      return 0;
    }

    return -currentPrice;
  } // If Sell
  else if (price < 0) {
    return currentPrice;
  } else {
    return 0;
  }
}
