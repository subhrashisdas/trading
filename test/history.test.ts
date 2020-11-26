import { convertOhlvcCandlesToTradeJson } from '@src/candle';
import { candlestick, history, getOptimizedHistory, filterCandles, invalidateCache } from '@src/history';
import { ok, deepStrictEqual } from 'assert';
import { fifteenMinuteCandles } from '@test/fixtures/candles';
import { slice } from 'lodash';

export async function candlestickTest() {
  const candlestickData = await candlestick(263433, new Date('2020-10-05').getTime(), new Date('2020-10-05').getTime());
  ok(candlestickData.length > 0);
}

export async function normalHistoryTest() {
  const candlestickData = await history(263433, new Date('2020-10-05').getTime(), new Date('2020-10-05').getTime());
  ok(candlestickData.length === 375);
}

export async function getOptimizedHistoryTest() {
  const instrumentId = 263433;
  await invalidateCache(instrumentId);
  const candlestickData = await getOptimizedHistory(
    instrumentId,
    new Date('2020-10-05').getTime(),
    new Date('2020-10-06').getTime()
  );
  ok(candlestickData.length > 0);
}

export async function filterCandlesTest() {
  const candles = convertOhlvcCandlesToTradeJson(fifteenMinuteCandles);
  const from = candles[candles.length - 3].timestamp;
  const to = candles[candles.length - 1].timestamp;
  deepStrictEqual(filterCandles(candles, from, to), slice(candles, candles.length - 3, candles.length - 1));
}
