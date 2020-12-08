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
