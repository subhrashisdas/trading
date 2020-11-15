export type EpochTime = number;
export type Milliseconds = number;

export const MinuteInMs = 60 * 1000;
export const DayInMs = 24 * 60 * MinuteInMs;
export const WeekInMs = DayInMs * 7;

export function ceilToNearestMilliseconds(date: EpochTime, milliseconds: Milliseconds) {
  return date - (date % milliseconds) + milliseconds - 3 * DayInMs;
}
