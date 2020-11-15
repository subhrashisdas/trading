import { ceilToNearestMilliseconds, Milliseconds } from '@src/date';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type OhlvcCandle = [string, number, number, number, number, number];

export function convertInterval(candles: Candle[], interval: Milliseconds) {
  const newCandles: Candle[] = [];
  let maxTimeFrame;
  for (const candle of candles) {
    const currentProcessedCandle = newCandles.pop();
    if (maxTimeFrame && candle.timestamp > maxTimeFrame && currentProcessedCandle) {
      newCandles.push(mergeCandle(currentProcessedCandle, candle));
    } else {
      maxTimeFrame = ceilToNearestMilliseconds(candle.timestamp, interval);
      newCandles.push(candle);
    }
  }
  return newCandles;
}

export function convertOhlvcCandleToTradeJson(ohlvcCandle: OhlvcCandle) {
  return {
    timestamp: Date.parse(ohlvcCandle[0]),
    open: ohlvcCandle[1],
    high: ohlvcCandle[2],
    low: ohlvcCandle[3],
    close: ohlvcCandle[4],
    volume: ohlvcCandle[5],
  };
}

function mergeCandle(oldCandle: Candle, newCandle: Candle): Candle {
  return {
    timestamp: oldCandle.timestamp,
    open: oldCandle.open,
    high: Math.max(oldCandle.high, newCandle.high),
    low: Math.min(oldCandle.low, newCandle.low),
    close: newCandle.close,
    volume: oldCandle.volume + newCandle.volume,
  };
}
