/**
 * Returns a string of a passed number, and adds a '0' to the beginning of single-digit numbers.
 * @param {number} number - Integer to be converted into a string.
 */
const addAppropriateZero = (number) => {
  if (number < 10) {
    return `0${number}`;
  }
  return `${number}`;
};
/**
 * When passed a number depicting an amount of seconds, it generates the precise timestamp that is that many seconds into the future.
 * @param {seconds} number - Number of seconds into the future for which a timestamp should be generated.
 */
export const calculateLaterTimestamp = (seconds = 0) => {
  const currentTime = Date.now();
  return currentTime + seconds * 1000;
};
/**
 * Renders the proper timer string for the display based on whether it is desired
 * for the timer to render in terms of seconds, minutes, days or hours.
 * @param {number} number - Integer to be converted into a string.
 */
export const renderAppropriateTimerSize = ({
  specificity = 'minutes',
  seconds: passedSeconds = 0,
  minutes: passedMinutes = 0,
  hours: passedHours = 0,
  days: passedDays = 0,
  cutOffFirstZero = false,
} = {}) => {
  if (specificity === 'seconds') {
    const totalHours = passedHours + passedDays * 24;
    const totalMinutes = passedMinutes + totalHours * 60;
    const totalSeconds = passedSeconds + totalMinutes * 60;
    return `${totalSeconds}`;
  }
  if (specificity === 'days') {
    const days = cutOffFirstZero ? passedDays : addAppropriateZero(passedDays);
    return (
      `${days}` +
      ':' +
      `${addAppropriateZero(passedHours)}` +
      ':' +
      `${addAppropriateZero(passedMinutes)}` +
      ':' +
      `${addAppropriateZero(passedSeconds)}`
    );
  }
  if (specificity === 'hours') {
    const totalHours = passedHours + passedDays * 24;
    const hours = cutOffFirstZero ? totalHours : addAppropriateZero(totalHours);
    const minutes = addAppropriateZero(passedMinutes);
    const seconds = addAppropriateZero(passedSeconds);
    return `${hours}:${minutes}:${seconds}`;
  }
  if (specificity === 'minutes') {
    const totalHours = passedHours + passedDays * 24;
    const totalMinutes = passedMinutes + totalHours * 60;
    const minutes = cutOffFirstZero
      ? totalMinutes
      : addAppropriateZero(totalMinutes);
    return `${minutes}`
      .concat(':')
      .concat(`${addAppropriateZero(passedSeconds)}`);
  }
  return null;
};
