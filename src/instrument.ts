import { getCredentials } from '@src/token';
import fetch from 'node-fetch';

interface MarketWatches {
  id: number;
  name: string;
  items: MarketWatchInstrument[];
}

interface MarketWatchInstrument {
  // id: number;
  // weight: number;
  tradingsymbol: string;
  instrument_token: number;
  // last_price: number;
  segment: string | Segment;
  // expiry: string;
  // strike: number;
  // lot_size: number;
}

export interface Instrument {
  tradingSymbol: string;
  instrumentToken: number;
  segment: string | Segment;
}

export enum Segment {
  Indices = 'INDICES',
  Nse = 'NSE',
  Bse = 'BSE',
}

async function instruments(): Promise<MarketWatches[]> {
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
    .reduce<MarketWatchInstrument[]>((acc, item) => {
      acc.push(...item.items);
      return acc;
    }, [])
    .map((item) => ({
      tradingSymbol: item.tradingsymbol,
      instrumentToken: item.instrument_token,
      segment: item.segment,
    }));
}
