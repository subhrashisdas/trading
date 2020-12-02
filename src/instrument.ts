import { getCredentials } from '@src/token';
import fetch from 'node-fetch';

export interface MarketWatches {
  id: number;
  name: string;
  items: Instrument[];
}

export interface Instrument {
  id: number;
  weight: number;
  tradingsymbol: string;
  instrument_token: number;
  last_price: number;
  segment: Segment;
  expiry: string;
  strike: number;
  lot_size: number;
}

export enum Segment {
  Indices = 'INDICES',
  Nse = 'NSE',
}

export async function instruments(): Promise<MarketWatches[]> {
  const credentials = await getCredentials();

  const response = await fetch(`https://kite.zerodha.com/api/marketwatch`, {
    method: 'GET',
    headers: {
      authorization: credentials.authorization,
    },
  });

  const body = await response.json();
  return body?.data as MarketWatches[];
}

export async function filteredInstruments(name: string[]): Promise<Instrument[]> {
  const instrumentsData = await instruments();
  return instrumentsData
    .filter((item: MarketWatches) => name.includes(item.name))
    .reduce<Instrument[]>((acc, item) => {
      acc.push(...item.items);
      return acc;
    }, []);
}
