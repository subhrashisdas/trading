import fetch from 'node-fetch';
import { getCredentials } from '@src/token';

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

  const response = await fetch('https://kite.zerodha.com/oms/orders', {
    headers: {
      authorization: credentials.authorization,
    },
  });

  const body = await response.json();
  return body?.data as Order[];
}
