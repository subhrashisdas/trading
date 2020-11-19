import fetch from 'node-fetch';
import querystring from 'querystring';
import { getCredentials } from '@src/token';
import { format } from 'date-fns';

export async function history(instrumentId: number, limit: number, offset: number) {}

export async function candlestick(instrumentId: number, from: number, to: number) {
  const credentials = await getCredentials();
  const params = querystring.stringify({
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
    oi: 0,
  });

  console.log(credentials.authorization);

  const response = await fetch(`https://kite.zerodha.com/oms/instruments/historical/${instrumentId}/minute?${params}`, {
    method: 'GET',
    headers: {
      authorization: credentials.authorization,
    },
  });

  const body = await response.json();
  return body?.data?.candles;
}
