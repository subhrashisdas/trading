import { Instrument } from '@src/instrument';
import { TransactionOptions, getPositionByInstrument, getPositions, placeOrder } from '@src/position';
import { ok } from 'assert';

export async function getPositionsTest() {
  const positions = await getPositions();
  ok(positions.length >= 0);
}

export async function getPositionByInstrumentTest() {
  const positions = await getPositions();
  const instrument: Instrument = {
    tradingSymbol: 'RAIN',
    instrumentToken: 3926273,
    segment: 'NSE',
  };
  const position = await getPositionByInstrument(positions, instrument);
  ok(position);
}

export async function placeOrderTest() {
  const instrument: Instrument = {
    tradingSymbol: 'RAIN',
    instrumentToken: 3926273,
    segment: 'NSE',
  };
  const transactionOptions: TransactionOptions = {
    instrument,
    price: 100,
    quantity: 1,
  };
  await placeOrder(transactionOptions);
  const positions = await getPositions();
  const position = await getPositionByInstrument(positions, instrument);
  ok(position);
}
