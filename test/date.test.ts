import { HourInMs, WeekInMs, ceilToNearestMilliseconds, inDayRange, shieldTimeFromFuture } from '@src/date';
import { deepStrictEqual } from 'assert';

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

export function inDayRangeTest() {
  const from = new Date(4 * HourInMs).getTime();
  const to = new Date(10 * HourInMs).getTime();

  const previous = new Date('2020-11-10T08:59:00+0530').getTime();
  const present = new Date('2020-11-10T09:31:00+0530').getTime();
  const future = new Date('2020-11-10T03:31:00+0530').getTime();

  deepStrictEqual(inDayRange(from, to, previous), false);
  deepStrictEqual(inDayRange(from, to, present), true);
  deepStrictEqual(inDayRange(from, to, future), false);
}
