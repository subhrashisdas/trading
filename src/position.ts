import { Instrument } from '@src/instrument';
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

export interface TransactionOptions {
  instrument: Instrument;
  price: number;
  quantity: number;
}

enum OrderTransactionType {
  buy = 'buy',
  sell = 'sell',
}

export async function placeOrder(options: TransactionOptions) {
  const credentials = await getCredentials();
  const variety = 'co';

  await jsonRequest({
    url: 'https://kite.zerodha.com',
    path: `/oms/orders/${variety}`,
    method: 'POST',
    form: {
      variety: variety,
      exchange: options.instrument.segment,
      tradingsymbol: options.instrument.tradingSymbol,
      transaction_type: options.quantity > 0 ? OrderTransactionType.buy : OrderTransactionType.sell,
      order_type: 'LIMIT',
      quantity: options.quantity,
      price: Math.abs(options.price),
      product: 'MIS',
      validity: 'DAY',
      disclosed_quantity: 0,
      trigger_price: 0,
      squareoff: 0,
      stoploss: 0,
      trailing_stoploss: 0,
      user_id: credentials.userId,
    },
  });
}
