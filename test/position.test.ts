import { getPositionByInstrumentId, getPositions } from '@src/position';
import { ok } from 'assert';

export async function getPositionsTest() {
  const positions = await getPositions();
  ok(positions.length >= 0);
}

export async function getPositionByInstrumentIdTest() {
  const positions = await getPositions();
  const position = await getPositionByInstrumentId(positions, 3926273);
  // ok(position);
}
