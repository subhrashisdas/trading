import { Instrument, Segment } from "@src/instrument";
import { getCredentials } from "@src/token";
import { jsonRequest } from "@src/request";

interface Position {
  tradingsymbol: string;
  exchange: Segment;
  instrument_token: number;
  average_price: number;
  quantity: number;
}

enum OrderTransactionType {
  BUY = "BUY",
  SELL = "SELL"
}

export interface TransactionOptions {
  instrument: Instrument;
  price: number;
  quantity: number;
}

export async function placeOrder(options: TransactionOptions) {
  const credentials = await getCredentials();
  const variety = "regular";

  await jsonRequest({
    url: "https://kite.zerodha.com",
    path: `/oms/orders/${variety}`,
    method: "POST",
    headers: {
      authorization: credentials.authorization
    },
    form: {
      variety: variety,
      exchange: options.instrument.segment,
      tradingsymbol: options.instrument.tradingSymbol,
      transaction_type: options.quantity > 0 ? OrderTransactionType.BUY : OrderTransactionType.SELL,
      order_type: "LIMIT",
      quantity: options.quantity,
      price: Math.abs(options.price),
      product: "MIS",
      validity: "DAY",
      disclosed_quantity: 0,
      trigger_price: 0,
      squareoff: 0.05,
      stoploss: 0.05,
      trailing_stoploss: 0,
      user_id: credentials.userId
    }
  });
}

export async function getPositions(): Promise<TransactionOptions[]> {
  const credentials = await getCredentials();

  const { body } = await jsonRequest({
    url: "https://kite.zerodha.com",
    path: "oms/portfolio/positions",
    method: "GET",
    headers: {
      authorization: credentials.authorization
    }
  });

  return (body?.data?.day as Position[]).map(item => ({
    instrument: ({
      tradingsymbol: item.tradingsymbol,
      instrument_token: item.instrument_token,
      segment: item.exchange
    } as unknown) as Instrument,
    price: item.quantity > 0 ? item.average_price : -item.average_price,
    quantity: Math.abs(item.quantity)
  }));
}

export function getPositionByInstrument(
  positions: TransactionOptions[],
  instrument: Instrument
): TransactionOptions | undefined {
  return positions.find(position => position.instrument.instrumentToken === instrument.instrumentToken);
}
