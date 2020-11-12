import { differenceInMinutes } from 'date-fns';
import { ceilOfInterval, TimeUnit } from '@src/date';

export interface Candle {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function convertInterval(candles: Candle[], interval: number, timeUnit: TimeUnit) {
  const newCandles: Candle[] = [];
  let maxTimeFrame;
  for (const candle of candles) {
    const currentProcessedCandle = newCandles.pop();
    if (maxTimeFrame && differenceInMinutes(maxTimeFrame, candle.timestamp) > 0 && currentProcessedCandle) {
      newCandles.push(mergeCandle(currentProcessedCandle, candle));
    } else {
      maxTimeFrame = ceilOfInterval(candle.timestamp, interval, timeUnit);
      newCandles.push(candle);
    }
  }
  return newCandles;
}

function mergeCandle(oldCandle: Candle, newCandle: Candle): Candle {
  return {
    ...oldCandle,
    high: Math.max(oldCandle.high, newCandle.high),
    low: Math.min(oldCandle.low, newCandle.low),
    open: oldCandle.open,
    volume: oldCandle.volume + newCandle.volume,
  };
}
