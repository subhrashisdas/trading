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

export function ceilToNearestYears(date: Date, years: number) {
  const clonedDate = new Date(date);
  const year = clonedDate.getFullYear();
  const remainder = year % years;
  clonedDate.setFullYear(year - remainder + years, 0, 0);
  clonedDate.setHours(0, 0, 0, 0);
  return clonedDate;
}

export function ceilToNearestMonths(date: Date, months: number) {
  const clonedDate = new Date(date);
  const month = date.getMonth();
  const remainder = month % months;
  clonedDate.setFullYear(date.getFullYear(), month - remainder + months, 0);
  clonedDate.setHours(0, 0, 0, 0);
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

export function ceilOfInterval(date: Date, interval: number, timeUnit: TimeUnit): Date {
  switch (timeUnit) {
    case TimeUnit.minute:
      return ceilToNearestMinutes(date, interval);
    case TimeUnit.hour:
      return ceilToNearestMinutes(date, interval * 60);
    case TimeUnit.day:
      return ceilToNearestMinutes(date, interval * 60 * 24);
    case TimeUnit.week:
      return ceilToNearestMinutes(date, interval * 60 * 24 * 7);
    case TimeUnit.month:
      return ceilToNearestMonths(date, interval);
    case TimeUnit.year:
      return ceilToNearestYears(date, interval);
  }
}
