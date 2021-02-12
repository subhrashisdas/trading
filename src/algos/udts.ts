import { Candle, candleChange, convertInterval, roundOffFilterCandles, trendCandles } from "@src/candle";
import { DayInMs, HourInMs, MinuteInMs, WeekInMs } from "@src/date";
import { calculatePivot } from "@src/pivot";
import { inRange } from "lodash";

export const candlesLimit = WeekInMs;
export const timeInterval = 6 * 4 * WeekInMs;
export const name = "udts";
export const startAt = new Date(5 * HourInMs).getTime();
export const endAt = new Date(9.5 * HourInMs).getTime();

export function trade(candles: Candle[]): number {
  const latestCandle = candles[candles.length - 1];

  const fifteenMinutesCandles = convertInterval(roundOffFilterCandles(candles, 15 * MinuteInMs, 3), 15 * MinuteInMs);
  const fifteenMinutesTrendCandle = trendCandles(fifteenMinutesCandles);
  const fifteenMinutesTrend = candleChange(fifteenMinutesTrendCandle);

  const dailyCandles = convertInterval(roundOffFilterCandles(candles, DayInMs, 3), DayInMs);
  const dailyTrendCandle = trendCandles(dailyCandles);
  const dailyTrend = candleChange(dailyTrendCandle);

  const weeklyCandles = convertInterval(roundOffFilterCandles(candles, WeekInMs, 3), WeekInMs);
  const weeklyTrendCandle = trendCandles(weeklyCandles);
  const weeklyTrend = candleChange(weeklyTrendCandle);

  const monthlyCandles = convertInterval(roundOffFilterCandles(candles, WeekInMs, 12), 4 * WeekInMs);
  const monthlyTrendCandle = trendCandles(monthlyCandles);
  const monthlyTrend = candleChange(monthlyTrendCandle);

  // console.log(
  //   JSON.stringify({
  //     fifteenMinutesCandles,
  //     dailyCandles,
  //     weeklyCandles,
  //     monthlyCandles,
  //     fifteenMinutesTrendCandle,
  //     dailyTrendCandle,
  //     weeklyTrendCandle,
  //     monthlyTrendCandle
  //   })
  // );

  if (fifteenMinutesTrend > 0 && dailyTrend > 0 && weeklyTrend > 0 && monthlyTrend > 0 && latestCandle.close > dailyTrendCandle.open) {
    return latestCandle.close;
  } else if (
    fifteenMinutesTrend < 0 &&
    dailyTrend < 0 &&
    weeklyTrend < 0 &&
    monthlyTrend < 0 &&
    latestCandle.close < dailyTrendCandle.open
  ) {
    return -latestCandle.close;
  } else {
    return 0;
  }
}

// Validation current price can't be lower that other price
export function squareoff(boughtPrice: number, candles: Candle[]): number {
  const currentCandle = candles[candles.length - 1];
  const currentPrice = currentCandle.close;

  const dailyTrendCandle = trendCandles(convertInterval(roundOffFilterCandles(candles, DayInMs, 3), DayInMs));
  const stopLossPrice = dailyTrendCandle.open;

  if (boughtPrice < 0 && -boughtPrice > stopLossPrice) {
    return currentPrice;
  }

  if (boughtPrice > 0 && boughtPrice < stopLossPrice) {
    return -currentPrice;
  }

  const pivotData = calculatePivot(dailyTrendCandle);

  if (boughtPrice > 0 && currentPrice > boughtPrice) {
    if (boughtPrice < pivotData.resistance1 && currentPrice >= pivotData.resistance1) {
      return -currentPrice;
    }
    if (boughtPrice < pivotData.resistance2 && currentPrice >= pivotData.resistance2) {
      return -currentPrice;
    }
    if (boughtPrice < pivotData.resistance3 && currentPrice >= pivotData.resistance3) {
      return -currentPrice;
    }
    if (boughtPrice < pivotData.resistance4 && currentPrice >= pivotData.resistance4) {
      return -currentPrice;
    }
    return 0;
  }

  if (boughtPrice < 0 && currentPrice > boughtPrice) {
    if (-boughtPrice > pivotData.support1 && currentPrice <= pivotData.support1) {
      return currentPrice;
    }
    if (-boughtPrice > pivotData.support2 && currentPrice <= pivotData.support2) {
      return currentPrice;
    }
    if (-boughtPrice > pivotData.support3 && currentPrice <= pivotData.support3) {
      return currentPrice;
    }
    if (-boughtPrice > pivotData.support4 && currentPrice <= pivotData.support4) {
      return currentPrice;
    }
    return 0;
  }

  return 0;
}
