import { getCredentials } from '@src/token';
import { jsonRequest } from '@src/request';

export interface Order {
  placed_by: string;
  order_id: string;
  exchange_order_id: null;
  parent_order_id: null;
  status: string;
  status_message: string;
  status_message_raw: string;
  order_timestamp: Date;
  exchange_update_timestamp: null;
  exchange_timestamp: null;
  variety: string;
  exchange: string;
  tradingsymbol: string;
  instrument_token: number;
  order_type: string;
  transaction_type: string;
  validity: string;
  product: string;
  quantity: number;
  disclosed_quantity: number;
  price: number;
  trigger_price: number;
  average_price: number;
  filled_quantity: number;
  pending_quantity: number;
  cancelled_quantity: number;
  market_protection: number;
  meta: object;
  tag: null;
  guid: string;
}

export async function getOrders(): Promise<Order[]> {
  const credentials = await getCredentials();

  const { body } = await jsonRequest({
    url: 'https://kite.zerodha.com',
    path: '/oms/orders',
    method: 'GET',
    headers: {
      authorization: credentials.authorization,
    },
  });

  return body?.data as Order[];
}

export interface PlaceOrderOptions {
  exchange: string;
  tradingSymbol: string;
  transactionType: string;
  quantity: string;
  price: string;
  triggerPrice: string;
}

export async function placeOrder(options: PlaceOrderOptions) {
  const credentials = await getCredentials();
  const variety = 'co';

  await jsonRequest({
    url: 'https://kite.zerodha.com',
    path: `/oms/orders/${variety}`,
    method: 'POST',
    form: {
      variety: variety,
      exchange: options.exchange,
      tradingsymbol: options.tradingSymbol,
      transaction_type: options.transactionType,
      order_type: 'LIMIT',
      quantity: options.quantity,
      price: options.price,
      product: 'MIS',
      validity: 'DAY',
      disclosed_quantity: 0,
      trigger_price: options.triggerPrice,
      squareoff: 0,
      stoploss: 0,
      trailing_stoploss: 0,
      user_id: credentials.userId,
    },
  });
}
