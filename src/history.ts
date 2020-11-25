import fetch from 'node-fetch';
import querystring from 'querystring';
import { writeFile, readFile } from 'fs/promises';
import { exists } from '@src/fs';
import path from 'path';
import { getCredentials } from '@src/token';
import { format } from 'date-fns';
import { Milliseconds, WeekInMs } from '@src/date';
import { Candle, convertOhlvcCandlesToTradeJson } from '@src/candle';

export async function history(instrumentId: number, from: Milliseconds, to: Milliseconds) {
  const candles = [];
  for (let newFrom = from; newFrom <= to; newFrom += 8 * WeekInMs) {
    const possibleNewTo = newFrom + 8 * WeekInMs;
    const newTo = possibleNewTo > to ? to : possibleNewTo;
    candles.push(...(await candlestick(instrumentId, newFrom, newTo)));
  }
  return convertOhlvcCandlesToTradeJson(candles);
}

const folderLocation = path.join(__filename, '../../.cache/');

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

function fileName(instrumentId: number) {
  return `historical-${instrumentId}.json`;
}

function filePath(instrumentId: number) {
  return path.join(folderLocation, fileName(instrumentId));
}

export async function getOptimizedHistory(
  instrumentId: number,
  from: Milliseconds,
  to: Milliseconds
): Promise<Candle[]> {
  const instrumentIdFilePath = filePath(instrumentId);
  const candles: Candle[] = [];
  if (await exists(instrumentIdFilePath)) {
    const data = await (await readFile(instrumentIdFilePath)).toJSON;
    candles.push(...((data as unknown) as Candle[]));
  }

  const firstCandle = candles[0];
  const lastCandle = candles[candles.length - 1];

  if (firstCandle) {
    candles.push(...[]);
  }

  if (lastCandle) {
    candles.push(...[]);
  }

  if (firstCandle || lastCandle) {
    await writeFile(instrumentIdFilePath, JSON.stringify(candles), {flag: 'wx'});
  }

  return candles;
}
