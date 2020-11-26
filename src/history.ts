import fetch from 'node-fetch';
import querystring from 'querystring';
import { writeFile, readFile } from 'fs/promises';
import { deleteFile, exists } from '@src/fs';
import path from 'path';
import { getCredentials } from '@src/token';
import { format } from 'date-fns';
import { DayInMs, Milliseconds, WeekInMs } from '@src/date';
import { Candle, convertOhlvcCandlesToTradeJson } from '@src/candle';
import { inRange } from 'lodash';

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

  if (await exists(instrumentIdFilePath)) {
    const data: any = await (await readFile(instrumentIdFilePath)).toJSON;
    const candles: Candle[] = data.candle;

    if (from < data.from) {
      const leftCandles = await history(instrumentId, from, data.from - DayInMs);
      candles.unshift(...leftCandles);
    }

    if (to > data.to) {
      const rightCandles = await history(instrumentId, data.to, to);
      candles.push(...rightCandles);
    }

    return filterCandles(candles, from, to);
  } else {
    const candles: Candle[] = await history(instrumentId, from, to);
    await writeFile(instrumentIdFilePath, JSON.stringify({ from, to, candles, instrumentId }), { flag: 'wx' });
    return filterCandles(candles, from, to);
  }
}

export function filterCandles(candles: Candle[], from: Milliseconds, to: Milliseconds) {
  return candles.filter((candle) => inRange(candle.timestamp, from, to));
}

export async function invalidateCache(instrumentId: number) {
  await deleteFile(filePath(instrumentId));
  return true;
}
