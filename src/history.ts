import { Candle, convertOhlvcCandlesToTradeJson } from '@src/candle';
import { DayInMs, Milliseconds, WeekInMs, shieldTimeFromFuture } from '@src/date';
import { deleteFile, exists } from '@src/fs';
import { format } from 'date-fns';
import { getCredentials } from '@src/token';
import { inRange } from 'lodash';
import { jsonRequest } from '@src/request';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export async function history(instrumentId: number, from: Milliseconds, to: Milliseconds, timePeriod = 8 * WeekInMs) {
  const candles = [];
  for (let newFrom = from; newFrom <= to; newFrom += timePeriod) {
    const possibleNewTo = newFrom + timePeriod;
    const newTo = possibleNewTo > to ? to : possibleNewTo;
    // Be careful it is multiple
    if (newFrom !== newTo) {
      candles.push(...(await candlestick(instrumentId, newFrom, newTo)));
    }
  }
  return candles;
}

const folderLocation = path.join(__filename, '../../.cache/');

export async function candlestick(instrumentId: number, from: Milliseconds, to: Milliseconds) {
  const credentials = await getCredentials();

  // If 'from' and 'to' are in future both 'from' and 'to' defaults to current date
  // Kite 'from' timestamp is start of the day and 'to' timestamp is end of the day
  const { body } = await jsonRequest({
    method: 'GET',
    url: 'https://kite.zerodha.com',
    path: `oms/instruments/historical/${instrumentId}/minute`,
    headers: {
      authorization: credentials.authorization,
    },
    params: {
      from: format(shieldTimeFromFuture(from), 'yyyy-MM-dd'),
      to: format(shieldTimeFromFuture(to), 'yyyy-MM-dd'),
      oi: 0,
    },
  });
  return filterCandles(convertOhlvcCandlesToTradeJson(body?.data?.candles), from, to);
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
    const data: any = JSON.parse(await (await readFile(instrumentIdFilePath)).toString());
    const candles: Candle[] = data.candles;
    const previousCandlesLength = candles.length;

    if (from < data.from) {
      const leftCandles = await history(instrumentId, from, data.from);
      candles.unshift(...leftCandles);
    }

    if (to > data.to) {
      const rightCandles = await history(instrumentId, data.to, to);
      candles.push(...rightCandles);
    }

    const currentCandlesLength = candles.length;
    if (previousCandlesLength !== currentCandlesLength) {
      await writeFile(
        instrumentIdFilePath,
        JSON.stringify({ from: Math.min(from, data.from), to: Math.max(to, data.to), candles: candles, instrumentId }),
        { flag: 'w' }
      );
    }

    return filterCandles(candles, from, to);
  } else {
    const candles: Candle[] = await history(instrumentId, from, to);
    await writeFile(instrumentIdFilePath, JSON.stringify({ from, to, candles, instrumentId }), { flag: 'w' });
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
