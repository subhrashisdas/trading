import { deepStrictEqual } from 'assert';
import { ceilToNearestMilliseconds, WeekInMs } from '@src/date';

export function ceilToNearestMillisecondsTest() {
  deepStrictEqual(
    new Date(ceilToNearestMilliseconds(1605451552423, WeekInMs)).toISOString(),
    new Date('2020-11-22T00:00:00.0Z').toISOString()
  );
}
