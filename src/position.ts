import { Milliseconds } from './date';
import { functionCache } from '@src/fs';
import { getCredentials } from '@src/token';
import { jsonRequest } from '@src/request';

export interface Position {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  product: string;
  quantity: number;
}

export async function getPositions(): Promise<Position[]> {
  const credentials = await getCredentials();

  const { body } = await jsonRequest({
    url: 'https://kite.zerodha.com',
    path: 'oms/portfolio/positions',
    method: 'GET',
    headers: {
      authorization: credentials.authorization,
    },
  });

  return body?.data?.day as Position[];
}

export async function getQuantityByInstrumentId(instrumentId: number, cachedTill: Milliseconds): Promise<number> {
  const positions = (await functionCache(getPositions, [], cachedTill)) as Position[];
  const position = positions.find((position) => position.instrument_token === instrumentId);
  return position ? position.quantity : 0;
}
