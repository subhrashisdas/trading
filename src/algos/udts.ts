import { Candle, candleChange, convertInterval, trendCandles } from '@src/candle';
import { DayInMs, HourInMs, MinuteInMs, WeekInMs } from '@src/date';

export const candlesLimit = WeekInMs;
export const timeInterval = 5 * MinuteInMs;
export const name = 'udts';
export const startAt = new Date(5 * HourInMs).getTime();
export const endAt = new Date(10 * HourInMs).getTime();

export function trade(candles: Candle[]): number {
  const latestCandle = candles[candles.length - 1];
  const dailyTrend = candleChange(trendCandles(convertInterval(candles, DayInMs)));
  const weeklyTrend = candleChange(trendCandles(convertInterval(candles, WeekInMs)));
  const monthlyTrend = candleChange(trendCandles(convertInterval(candles, WeekInMs)));
  if (dailyTrend > 0 && weeklyTrend > 0 && monthlyTrend > 0) {
    return latestCandle.open;
  } else if (dailyTrend < 0 && weeklyTrend < 0 && monthlyTrend < 0) {
    return -latestCandle.close;
  } else {
    return 0;
  }
}

export function squareoff(price: number, candles: Candle[]): number {
  const latestCandle = candles[candles.length - 1];
  const dailyTrend = candleChange(trendCandles(convertInterval(candles, DayInMs)));
  if (dailyTrend > 0) {
    return latestCandle.open;
  } else if (dailyTrend < 0) {
    return -latestCandle.close;
  } else {
    return 0;
  }
}
