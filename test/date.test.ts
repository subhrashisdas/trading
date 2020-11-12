import { floatToNearestMinutes } from '@src/date';
import { isEqual } from 'date-fns';
import { ok } from 'assert';

export function floatToNearestMinutesTest() {
  ok(isEqual(floatToNearestMinutes(new Date('2020-11-12T14:11:47.822Z'), 15), new Date('2020-11-12T14:00:00.0Z')));
  ok(isEqual(floatToNearestMinutes(new Date('2020-11-12T14:11:47.822Z'), 10), new Date('2020-11-12T14:10:00.0Z')));
  ok(isEqual(floatToNearestMinutes(new Date('2020-11-12T14:11:47.822Z'), 3), new Date('2020-11-12T14:09:00.0Z')));
  ok(isEqual(floatToNearestMinutes(new Date('2020-11-12T14:27:23+05:15'), 15), new Date('2020-11-12T14:15:00+05:15')));
}
