import { deepStrictEqual } from 'assert';
import { ceilToNearestMilliseconds } from '@src/date';

export function ceilToNearestMillisecondsTest() {
  deepStrictEqual(
    new Date(ceilToNearestMilliseconds(1605451552423, 604800000)).toISOString(),
    new Date('2020-11-16T00:00:00.0Z').toISOString()
  );
}
