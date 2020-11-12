export function floatToNearestMinutes(date: Date, minutes: number) {
  const clonedDate = new Date(date);
  clonedDate.setSeconds(0);
  clonedDate.setMilliseconds(0);
  const clonedDateMinutes = clonedDate.getMinutes();
  const remainder = clonedDateMinutes % minutes;
  clonedDate.setMinutes(clonedDateMinutes - remainder);
  return clonedDate;
}

export function ceilToNearestMinutes(date: Date, minutes: number) {
  const clonedDate = new Date(date);
  clonedDate.setSeconds(0);
  clonedDate.setMilliseconds(0);
  const clonedDateMinutes = clonedDate.getMinutes();
  const remainder = clonedDateMinutes % minutes;
  clonedDate.setMinutes(clonedDateMinutes - remainder + minutes);
  return clonedDate;
}

export enum TimeUnit {
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

export function ceilOfInterval(date: Date, interval: number, timeUnit: TimeUnit) {
  switch (timeUnit) {
    case TimeUnit.minute:
      return ceilToNearestMinutes(date, interval);
    case TimeUnit.hour:
      return ceilToNearestMinutes(date, interval * 60);
    case TimeUnit.day:
      return ceilToNearestMinutes(date, interval * 60 * 24);
    case TimeUnit.week:
      return ceilToNearestMinutes(date, interval * 60 * 24 * 7);
  }
}
