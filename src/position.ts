import { Instrument } from './instrument';
import { getCredentials } from '@src/token';
import { jsonRequest } from '@src/request';

export interface Position {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  product: string;
  average_price: number;
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

export async function getPositionByInstrument(
  positions: Position[],
  instrument: Instrument
): Promise<Position | undefined> {
  return positions.find((position) => position.instrument_token === instrument.instrumentToken);
}
