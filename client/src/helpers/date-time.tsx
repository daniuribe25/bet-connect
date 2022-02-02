/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  format,
  isDate,
  isPast,
  isToday,
  isTomorrow,
  isThisWeek,
  isYesterday,
  differenceInMilliseconds,
  isFuture,
} from 'date-fns';

const MILLISECONDS_IN_SECOND = 1000;
const MILLISECONDS_IN_MINUTE = MILLISECONDS_IN_SECOND * 60;
const MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * 60;

export const withinHour = (timestamp: any): boolean => {
  const dateTime = Date.now();
  if (
    !isPast(timestamp) &&
    differenceInMilliseconds(timestamp, dateTime) < MILLISECONDS_IN_HOUR
  ) {
    return true;
  }

  return false;
};

/*
 * getExactTimeDifference
 * Takes two timestamps and returns the time difference within 2 significant units
 * E.G. 20s, 1m 20s, 1h 20m, 1d 20h
 */
export const getExactTimeDifference = (
  firstTime: Date | number,
  secondTime: Date | number,
): string => {
  if (!(firstTime || secondTime)) return '';
  const diff = Math.abs(differenceInMilliseconds(firstTime, secondTime));
  const secondDiff = Math.floor(diff / MILLISECONDS_IN_SECOND) % 60;
  const minuteDiff = Math.floor(diff / MILLISECONDS_IN_MINUTE) % 60;
  const hourDiff = Math.floor(diff / MILLISECONDS_IN_HOUR) % 24;
  const dayDiff = Math.floor(diff / (MILLISECONDS_IN_HOUR * 24));

  const formatNumberValue = (numToPad: number, postfix: string): string =>
    numToPad > 0 ? ` ${numToPad.toString().padStart(2, '0')}${postfix}` : '';

  if (dayDiff > 0) return `${dayDiff}d${formatNumberValue(hourDiff, 'h')}`;
  if (hourDiff > 0) return `${hourDiff}h${formatNumberValue(minuteDiff, 'm')}`;
  if (minuteDiff > 0) return `${minuteDiff}m${formatNumberValue(secondDiff, 's')}`;
  return `${secondDiff}s`;
};

/*
 * FormatDateTimeString
 * Takes a epoch timestamp and returns the following formats
 * Time formatting should be based upon a 12 hour clock (meridiem)
 * if timestamp > 1 hour from now but same day: "Today at ${time}${meridiem}"
 * if timestamp > 1 day < 2 days: "Tomorrow at ${time}${meridiem}"
 * if timestamp > 2 days < 1 week: "${day}" at ${time}${meridiem}"
 * if timestamp > 1 week: "${date}" at ${time}${meridiem}"
 */

const formatDateTimeFuture = (timestamp: any): string => {
  const dateTime = Date.now();
  if (withinHour(timestamp)) {
    const minutes =
      differenceInMilliseconds(timestamp, dateTime) / MILLISECONDS_IN_MINUTE;
    return `${minutes.toFixed()} minutes`;
  }
  if (isToday(timestamp)) {
    return `Today at ${format(timestamp, 'h:mmaaa').toLowerCase()}`;
  }
  if (isTomorrow(timestamp)) {
    return `Tomorrow at ${format(timestamp, 'h:mmaaa').toLowerCase()}`;
  }

  if (isThisWeek(timestamp, { weekStartsOn: 1 })) {
    const startDate = format(timestamp, 'ccc');
    const startTime = format(timestamp, 'h:mmaaa').toLowerCase();

    return `${startDate} at ${startTime}`;
  }

  const startDate = format(timestamp, 'ccc MM/dd');
  const startTime = format(timestamp, 'h:mmaaa').toLowerCase();

  return `${startDate} at ${startTime}`;
};

/*
 * Format a number of milliseconds
 * Returns number of hours in seconds provided
 * With half hour intervals.
 */
const HourAndHalfTimeFormatting = (time: any): string => {
  const countHalfHours = time / (MILLISECONDS_IN_HOUR / 2);
  const hours = Math.floor(countHalfHours / 2);
  const halfPast = countHalfHours % 2;
  return `${hours}h${halfPast && '30m'}`;
};

/*
 *
 * If notification was within the last hour: X minutes ago
 * If notification was within the last 3 hours: XhYm ago;
 * with half hour resolution, i.e. "About 1h ago", "About 1h30m ago",
 * "About 2h ago", "About 2h30m ago"
 * 3+ hours ago, but today: "Today at hh:mm am/pm"
 * Yesterday: "Yesterday at hh:mm am/pm"
 * Anything else: absolute timestamp; e.g. "Dec 7 at hh:mm am/pm"
 */
export const formatDateTimePast = (timestamp: any): string => {
  const dateTime = Date.now();
  const secondsSinceTime = differenceInMilliseconds(dateTime, timestamp);

  if (secondsSinceTime < MILLISECONDS_IN_HOUR) {
    const time = Math.floor(secondsSinceTime / MILLISECONDS_IN_MINUTE);
    return `${time} minutes ago`;
  }
  if (secondsSinceTime < MILLISECONDS_IN_HOUR * 3) {
    const time = HourAndHalfTimeFormatting(secondsSinceTime);
    return `About ${time} ago`;
  }
  if (isYesterday(timestamp)) {
    const time = format(timestamp, 'h:mmaaa').toLowerCase();
    return `Yesterday at ${time}`;
  }
  if (isToday(timestamp)) {
    const time = format(timestamp, 'h:mmaaa').toLowerCase();
    return `Today at ${time}`;
  }

  const startDate = format(timestamp, 'LLL d');
  const startTime = format(timestamp, 'h:mmaaa').toLowerCase();
  return `${startDate} at ${startTime}`;
};

export const formatDateTimeStringRelativeToNow = (timestamp: any): string => {
  if (!timestamp) throw Error('Please supply a timestamp');
  if (!isDate(new Date(timestamp)))
    throw Error('Please supply valid timestamp');

  if (isFuture(timestamp)) {
    return formatDateTimeFuture(timestamp);
  }
  if (isPast(timestamp)) {
    return formatDateTimePast(timestamp);
  }

  return 'Now';
};

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${format(startDate, 'h:mmaaa')} – ${format(endDate, 'h:mmaaa')}`;
};

export const isInFuture = (timestamp: Date): boolean => {
  return isFuture(timestamp);
};

export const getTimeUntil = (timestamp: Date): string => {
  const now = new Date();
  const timeRemaining = timestamp.getTime() - now.getTime();
  const minutes = timeRemaining / 1000 / 60;
  const remainingHours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);

  return `${
    remainingHours > 0 ? `${remainingHours}h ` : ''
  }${remainingMinutes}m`;
};
