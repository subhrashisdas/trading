import { getPositions, getQuantityByInstrumentId } from '@src/position';
import { ok } from 'assert';

export async function getPositionsTest() {
  const positions = await getPositions();
  ok(positions.length >= 0);
}

export async function getQuantityByInstrumentIdTest() {
  const positions = await getPositions();
  const quantity = await getQuantityByInstrumentId(positions, 3926273);
  ok(quantity === 0);
}
