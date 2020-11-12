import { differenceInMinutes, startOfMonth, addMonths, parseISO } from 'date-fns';

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
