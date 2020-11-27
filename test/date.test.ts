import { deepStrictEqual } from 'assert';
import { ceilToNearestMilliseconds, HourInMs, shieldTimeFromFuture, WeekInMs } from '@src/date';

export function ceilToNearestMillisecondsTest() {
  deepStrictEqual(
    new Date(ceilToNearestMilliseconds(1605451552423, WeekInMs)).toISOString(),
    new Date('2020-11-22T00:00:00.0Z').toISOString()
  );

  deepStrictEqual(
    new Date(ceilToNearestMilliseconds(1604979900000, HourInMs)).toISOString(),
    new Date('2020-11-10T04:00:00.000Z').toISOString()
  );
}

export function shieldTimeFromFutureTest() {
  const pastTime = new Date('2010-11-10T04:00:00.000Z').getTime();
  const currentTime = new Date().getTime();
  const futureTime = new Date('2050-11-10T04:00:00.000Z').getTime();

  deepStrictEqual(shieldTimeFromFuture(pastTime), pastTime);
  deepStrictEqual(shieldTimeFromFuture(currentTime), currentTime);
  deepStrictEqual(shieldTimeFromFuture(futureTime), currentTime);
}
