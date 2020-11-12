import {
  differenceInMinutes,
  startOfMonth,
  startOfMinute,
  startOfHour,
  addMonths,
  startOfWeek,
  parseISO,
  startOfDay,
  startOfYear,
} from 'date-fns';

export interface Candle {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum Interval {
  'minute' = 'minute',
  '3minute' = '3minute',
  '5minute' = '5minute',
  '10minute' = '10minute',
  '15minute' = '15minute',
  '30minute' = '30minute',
  'hour' = 'hour',
  'day' = 'day',
  'week' = 'week',
  'month' = 'month',
  'year' = 'year',
}

export function convertInterval(candles: Candle[], interval: Interval) {
  const newCandles = [];
  let maxTimeFrame;
  for (const candle of candles) {
    const currentProcessedCandle = newCandles.pop();
    if (maxTimeFrame && differenceInMinutes(maxTimeFrame, candle.timestamp) > 0 && currentProcessedCandle) {
      const newProcessedCandle: Candle = {
        ...currentProcessedCandle,
        high: Math.max(currentProcessedCandle.high, candle.high),
        low: Math.min(currentProcessedCandle.low, candle.low),
        open: currentProcessedCandle.open,
        volume: currentProcessedCandle.volume + candle.volume,
      };
      newCandles.push(newProcessedCandle);
    } else {
      maxTimeFrame = startOfMonth(addMonths(candle.timestamp, 1));
      newCandles.push(candle);
    }
  }
  return newCandles;
}

export function startOfInterval(timestamp: Date, interval: Interval) {
  switch (interval) {
    case Interval.minute:
      return startOfMinute(timestamp);
    case Interval['3minute']:
      return startOfMinute(timestamp);
    case Interval['5minute']:
      return startOfMinute(timestamp);
    case Interval['10minute']:
      return startOfMinute(timestamp);
    case Interval['15minute']:
      return startOfMinute(timestamp);
    case Interval['30minute']:
      return startOfMinute(timestamp);
    case Interval.hour:
      return startOfHour(timestamp);
    case Interval.day:
      return startOfDay(timestamp);
    case Interval.week:
      return startOfWeek(timestamp);
    case Interval.month:
      return startOfMonth(timestamp);
    case Interval.year:
      return startOfYear(timestamp);
  }
}

export function addInterval(timestamp: Date, interval: Interval, amount: number) {
  switch (interval) {
    case Interval.minute:
      return startOfMinute(timestamp);
    case Interval['3minute']:
      return startOfMinute(timestamp);
    case Interval['5minute']:
      return startOfMinute(timestamp);
    case Interval['10minute']:
      return startOfMinute(timestamp);
    case Interval['15minute']:
      return startOfMinute(timestamp);
    case Interval['30minute']:
      return startOfMinute(timestamp);
    case Interval.hour:
      return startOfMinute(timestamp);
    case Interval.day:
      return startOfMinute(timestamp);
    case Interval.week:
      return startOfMinute(timestamp);
    case Interval.month:
      return startOfMinute(timestamp);
    case Interval.year:
      return startOfMinute(timestamp);
  }
}
