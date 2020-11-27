import { convertOhlvcCandlesToTradeJson } from '@src/candle';
import { candlestick, history, getOptimizedHistory, filterCandles, invalidateCache } from '@src/history';
import { ok, deepStrictEqual } from 'assert';
import { fifteenMinuteCandles } from '@test/fixtures/candles';
import { slice } from 'lodash';
import { DayInMs } from '@src/date';

export async function candlestickTest() {
  const candlestickData = await candlestick(263433, new Date('2020-10-05').getTime(), new Date('2020-10-06').getTime());
  ok(candlestickData.length === 375);
}

export async function normalHistoryTest() {
  const from = new Date('2020-10-05').getTime();
  const to = new Date('2020-10-09').getTime();
  deepStrictEqual(await candlestick(263433, from, to), await history(263433, from, to, DayInMs));
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
  const getNewCandleData = await getOptimizedHistory(
    instrumentId,
    new Date('2020-10-03').getTime(),
    new Date('2020-10-08').getTime()
  );
  ok(getNewCandleData.length > 0);
}

export async function filterCandlesTest() {
  const candles = convertOhlvcCandlesToTradeJson(fifteenMinuteCandles);
  const from = candles[candles.length - 3].timestamp;
  const to = candles[candles.length - 1].timestamp;
  deepStrictEqual(filterCandles(candles, from, to), slice(candles, candles.length - 3, candles.length - 1));
}
