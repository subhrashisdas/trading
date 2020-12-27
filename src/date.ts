export type EpochTime = number;
export type Milliseconds = number;

export const SecondInMs = 1000;
export const MinuteInMs = 60 * SecondInMs;
export const HourInMs = 60 * MinuteInMs;
export const DayInMs = 24 * HourInMs;
export const WeekInMs = 7 * DayInMs;

export function ceilToNearestMilliseconds(date: EpochTime, milliseconds: Milliseconds) {
  const dateWithOffset = date + 4 * DayInMs;
  const remainder = dateWithOffset % milliseconds;
  return dateWithOffset - remainder + milliseconds - 4 * DayInMs;
}

export function shieldTimeFromFuture(dateTime: Milliseconds) {
  const currentTime = new Date().getTime();
  return dateTime > currentTime ? currentTime : dateTime;
}

export function inDayRange(fromRemainder: Milliseconds, toRemainder: Milliseconds, currentTime: Milliseconds) {
  const remainder = currentTime % DayInMs;
  return fromRemainder <= remainder && remainder < toRemainder;
}
