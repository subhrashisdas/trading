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

  const fifteenMinutesTrendCandle = trendCandles(convertInterval(roundOffFilterCandles(candles, 15 * MinuteInMs, 3), 15 * MinuteInMs));
  const fifteenMinutesTrend = candleChange(fifteenMinutesTrendCandle);

  const dailyTrendCandle = trendCandles(convertInterval(roundOffFilterCandles(candles, DayInMs, 3), DayInMs));
  const dailyTrend = candleChange(dailyTrendCandle);

  const weeklyTrendCandle = trendCandles(convertInterval(roundOffFilterCandles(candles, WeekInMs, 3), WeekInMs));
  const weeklyTrend = candleChange(weeklyTrendCandle);

  const monthlyTrendCandle = trendCandles(convertInterval(roundOffFilterCandles(candles, WeekInMs, 12), 4 * WeekInMs));
  const monthlyTrend = candleChange(monthlyTrendCandle);

  if (fifteenMinutesTrend > 0 && dailyTrend > 0 && weeklyTrend > 0 && monthlyTrend > 0 && latestCandle.close > dailyTrendCandle.open) {
    return latestCandle.close;
  } else if (fifteenMinutesTrend < 0 && dailyTrend < 0 && weeklyTrend < 0 && monthlyTrend < 0 && latestCandle.close < dailyTrendCandle.open) {
    return -latestCandle.close;
  } else {
    return 0;
  }
}

// Validation current price can't be lower that other price
export function squareoff(boughtPrice: number, candles: Candle[]): number {
  const currentCandle = candles[candles.length - 1];

  const dailyTrendCandle = trendCandles(convertInterval(roundOffFilterCandles(candles, DayInMs, 3), DayInMs));
  const pivotData = calculatePivot(dailyTrendCandle);
  const currentPrice = currentCandle.close;

  if (inRange(pivotData.pivotPoint, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  if (inRange(pivotData.resistance1, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  if (inRange(pivotData.resistance2, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  if (inRange(pivotData.resistance3, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  if (inRange(pivotData.resistance4, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }

  if (inRange(pivotData.support1, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  if (inRange(pivotData.support2, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  if (inRange(pivotData.support3, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  if (inRange(pivotData.support4, Math.abs(boughtPrice), currentPrice)) {
    return boughtPrice > 0 ? -currentPrice : currentPrice;
  }
  return 0;
}
