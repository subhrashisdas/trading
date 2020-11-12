export function floatToNearestMinutes(date: Date, minutes: number) {
  const clonedDate = new Date(date);
  clonedDate.setSeconds(0);
  clonedDate.setMilliseconds(0);
  const clonedDateMinutes = clonedDate.getMinutes();
  const remainder = clonedDateMinutes % minutes;
  clonedDate.setMinutes(clonedDateMinutes - remainder);
  return clonedDate;
}
