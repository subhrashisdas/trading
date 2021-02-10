import { Candle, candleChange, convertInterval, trendCandles } from "@src/candle";
import { DayInMs, HourInMs, MinuteInMs, WeekInMs } from "@src/date";
import lodash from "lodash";

export const candlesLimit = WeekInMs;
export const timeInterval = 6 * 4 * WeekInMs;
export const name = "udts";
export const startAt = new Date(5 * HourInMs).getTime();
export const endAt = new Date(10 * HourInMs).getTime();

// TODO: I am missing 15 minutes chart
export function trade(candles: Candle[]): number {
  const latestCandle = candles[candles.length - 1];
  const dailyTrend = candleChange(trendCandles(lodash.takeRight(convertInterval(candles, DayInMs), 4)));
  const weeklyTrend = candleChange(trendCandles(lodash.takeRight(convertInterval(candles, WeekInMs), 4)));
  const monthlyTrend = candleChange(trendCandles(lodash.takeRight(convertInterval(candles, 4 * WeekInMs), 6)));
  if (dailyTrend > 0 && weeklyTrend > 0 && monthlyTrend > 0) {
    return latestCandle.close;
  } else if (dailyTrend < 0 && weeklyTrend < 0 && monthlyTrend < 0) {
    return -latestCandle.close;
  } else {
    return 0;
  }
}

// export function squareoff(price: number, candles: Candle[]): number {
//   const latestCandle = candles[candles.length - 1];
//   const dailyTrend = candleChange(trendCandles(convertInterval(candles, DayInMs)));
//   if (dailyTrend < 0 && price > 0) {
//     return -latestCandle.close;
//   } else if (dailyTrend > 0 && price < 0) {
//     return latestCandle.close;
//   } else {
//     return 0;
//   }
// }

export function squareoff(price: number, candles: Candle[]): number {
  const latestCandle = candles[candles.length - 1];
  if (price > 0) {
    const percentUp = ((latestCandle.close - price) / price) * 100;
    if (percentUp > 3 || percentUp < -1) {
      return -latestCandle.close;
    }
    return 0;
  } else if (price < 0) {
    const percentUp = ((latestCandle.close - Math.abs(price)) / Math.abs(price)) * 100;
    if (percentUp > 3 || percentUp < -1) {
      return latestCandle.close;
    }
    return 0;
  } else {
    return 0;
  }
}
