import { Milliseconds, ceilToNearestMilliseconds } from '@src/date';
import { inRange } from 'lodash';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type OhlvcCandle = [string, number, number, number, number, number, number];

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

export function convertInterval(candles: Candle[], interval: Milliseconds) {
  const newCandles: Candle[] = [];
  let maxTimeFrame;
  for (const candle of candles) {
    if (maxTimeFrame && candle.timestamp < maxTimeFrame) {
      const currentProcessedCandle = newCandles.pop();
      if (currentProcessedCandle) {
        newCandles.push(mergeCandle(currentProcessedCandle, candle));
      }
    } else {
      maxTimeFrame = candle.timestamp + interval;
      newCandles.push(candle);
    }
  }
  return newCandles;
}

function convertOhlvcCandleToTradeJson(ohlvcCandle: OhlvcCandle) {
  return {
    timestamp: Date.parse(ohlvcCandle[0]),
    open: ohlvcCandle[1],
    high: ohlvcCandle[2],
    low: ohlvcCandle[3],
    close: ohlvcCandle[4],
    volume: ohlvcCandle[5],
  };
}

export function convertOhlvcCandlesToTradeJson(ohlvcCandles: OhlvcCandle[]) {
  return ohlvcCandles.map(convertOhlvcCandleToTradeJson);
}

export function trendCandles(candles: Candle[]) {
  let dominatingCandle = candles.shift();
  if (!dominatingCandle) {
    return;
  }
  for (const currentCandle of candles) {
    dominatingCandle = trendCandle(dominatingCandle, currentCandle);
  }
  return dominatingCandle;
}

export function trendCandle(dominatingCandle: Candle, currentCandle: Candle) {
  return inRange(currentCandle.close, dominatingCandle.open, dominatingCandle.close) ||
    inRange(currentCandle.close, dominatingCandle.close, currentCandle.open)
    ? dominatingCandle
    : currentCandle;
}

export function groupByCandles(candles: Candle[], roundingNumber: Milliseconds): Candle[][] {
  const groupedCandles: Candle[][] = [];
  for (let index = 0; index < candles.length; index++) {
    const candle = candles[index];
    const previousCandle = candles[index - 1];
    if (!previousCandle) {
      groupedCandles.push([candle]);
    } else if (candle.timestamp > ceilToNearestMilliseconds(previousCandle.timestamp, roundingNumber)) {
      groupedCandles.push([candle]);
    } else {
      groupedCandles[groupedCandles.length - 1].push(candle);
    }
  }
  return groupedCandles;
}

export function keepOneCandleInRange(candles: Candle[], gap: Milliseconds) {
  const ret: Candle[] = [];
  for (const currentCandle of candles) {
    const previousPushedCandle = ret[ret.length - 1];
    if (!previousPushedCandle) {
      ret.push(currentCandle);
    } else if (
      ceilToNearestMilliseconds(previousPushedCandle.timestamp, gap) <
      ceilToNearestMilliseconds(currentCandle.timestamp, gap)
    ) {
      ret.push(currentCandle);
    }
  }
  return ret;
}
