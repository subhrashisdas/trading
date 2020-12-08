import { getPositions, getQuantityByInstrumentId } from '@src/position';
import { ok } from 'assert';

export async function getPositionsTest() {
  const orders = await getPositions();
  ok(orders.length >= 0);
}

export async function getQuantityByInstrumentIdTest() {
  const quantity = await getQuantityByInstrumentId(3926273);
  ok(quantity === 0);
}
