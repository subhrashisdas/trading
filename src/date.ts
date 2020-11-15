export type EpochTime = number;
export type Milliseconds = number;

export const SecondInMs = 1000;
export const MinuteInMs = 60 * SecondInMs;
export const HourInMs = 60 * MinuteInMs;
export const DayInMs = 24 * HourInMs;
export const WeekInMs = 7 * DayInMs;

export function ceilToNearestMilliseconds(date: EpochTime, milliseconds: Milliseconds) {
  return date - (date % milliseconds) + milliseconds - 3 * DayInMs;
}
