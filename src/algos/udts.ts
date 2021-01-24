import { Candle, convertInterval, trendCandles } from '@src/candle';
import { DayInMs, HourInMs, MinuteInMs, WeekInMs } from '@src/date';

export const candlesLimit = WeekInMs;
export const timeInterval = 5 * MinuteInMs;
export const name = 'udts';
export const startAt = new Date(5 * HourInMs).getTime();
export const endAt = new Date(10 * HourInMs).getTime();

export function trade(candles: Candle[]): number {
  // if daily, weekly and monthly trend is up-trend then it will go up
  const dailyTrend = trendCandles(convertInterval(candles, DayInMs));
  const weeklyTrend = trendCandles(convertInterval(candles, WeekInMs));
  const monthlyTrend = trendCandles(convertInterval(candles, WeekInMs));
  return -100;
}

export function squareoff(price: number, candles: Candle[]): number {
  // if daily trend will go down after that
  const dailyTrend = trendCandles(convertInterval(candles, DayInMs));
  return +100;
}
