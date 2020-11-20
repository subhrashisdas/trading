import { candlestick, history } from '@src/history';
import { ok } from 'assert';

export async function candlestickTest() {
  const candlestickData = await candlestick(263433, new Date('2020-10-05').getTime(), new Date('2020-10-05').getTime());
  ok(candlestickData.length > 0);
}

export async function historyTest() {
  const candlestickData = await history(263433, new Date('2020-10-05').getTime(), new Date('2020-10-05').getTime());
  ok(candlestickData.length > 0);
}
