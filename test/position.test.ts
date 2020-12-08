import { getPositions } from '@src/position';
import { ok } from 'assert';

export async function getPositionsTest() {
  const orders = await getPositions();
  ok(orders.length >= 0);
}
