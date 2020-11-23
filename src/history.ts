import fetch from 'node-fetch';
import querystring from 'querystring';
import { getCredentials } from '@src/token';
import { format } from 'date-fns';
import { Milliseconds, WeekInMs } from '@src/date';
import { Candle } from '@src/candle';

export async function history(instrumentId: number, from: Milliseconds, to: Milliseconds) {
  const candles: Candle[] = [];
  for (let newFrom = from; newFrom <= to; newFrom += 8 * WeekInMs) {
    const newTo = newFrom + 8 * WeekInMs;
    candles.push(await candlestick(instrumentId, newFrom, newTo));
  }
  return candles;
}

export async function candlestick(instrumentId: number, from: Milliseconds, to: Milliseconds) {
  const credentials = await getCredentials();
  const params = querystring.stringify({
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
    oi: 0,
  });

  const response = await fetch(`https://kite.zerodha.com/oms/instruments/historical/${instrumentId}/minute?${params}`, {
    method: 'GET',
    headers: {
      authorization: credentials.authorization,
    },
  });

  const body = await response.json();
  return body?.data?.candles;
}
