import { sum } from '@src/index';
import { strictEqual } from 'assert';

export function sumTest() {
  strictEqual(sum(1, 2), 3);
}
