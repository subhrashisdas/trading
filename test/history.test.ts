import { DayInMs } from '@src/date';
import { candlestick, filterCandles, getOptimizedHistory, history, invalidateCache } from '@src/history';
import { convertOhlvcCandlesToTradeJson } from '@src/candle';
import { deepStrictEqual, ok } from 'assert';
import { fifteenMinuteCandles } from '@test/fixtures/candles';
import { slice } from 'lodash';

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
  const id = 263433;
  const time1 = new Date('2020-06-18').getTime(); // Sat, Sun in between
  const time2 = new Date('2020-06-22').getTime();
  const time3 = new Date('2020-06-24').getTime();
  const time4 = new Date('2020-06-26').getTime(); // No included this data

  await invalidateCache(id);
  deepStrictEqual(await getOptimizedHistory(id, time2, time3), await history(id, time2, time3, DayInMs));
  deepStrictEqual(await getOptimizedHistory(id, time1, time4), await history(id, time1, time4, DayInMs));
}

export async function filterCandlesTest() {
  const candles = convertOhlvcCandlesToTradeJson(fifteenMinuteCandles);
  const from = candles[candles.length - 3].timestamp;
  const to = candles[candles.length - 1].timestamp;
  deepStrictEqual(filterCandles(candles, from, to), slice(candles, candles.length - 3, candles.length - 1));
}
