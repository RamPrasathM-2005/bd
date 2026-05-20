export const BIRTHDAY_MONTH_INDEX = 7; // May. JavaScript months are zero-based: January is 0, May is 4.
export const BIRTHDAY_DAY = 10;

// For testing only:
// Set this to a date string like '2026-05-20T00:01:00' to force the Celebration state.
// Keep it as null for the real live date.
export const TEST_CURRENT_DATE = null;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function getCurrentDate() {
  const queryDate = new URLSearchParams(window.location.search).get('date');

  if (queryDate === 'birthday') {
    return new Date(new Date().getFullYear(), BIRTHDAY_MONTH_INDEX, BIRTHDAY_DAY, 0, 1, 0, 0);
  }

  if (queryDate) {
    return new Date(queryDate);
  }

  return TEST_CURRENT_DATE ? new Date(TEST_CURRENT_DATE) : new Date();
}

export function getBirthdayState(now = new Date()) {
  const currentYearBirthday = new Date(
    now.getFullYear(),
    BIRTHDAY_MONTH_INDEX,
    BIRTHDAY_DAY,
    0,
    0,
    0,
    0
  );

  const isUnlocked = now >= currentYearBirthday;
  const targetDate = isUnlocked
    ? currentYearBirthday
    : new Date(now.getFullYear(), BIRTHDAY_MONTH_INDEX, BIRTHDAY_DAY, 0, 0, 0, 0);

  return { isUnlocked, targetDate };
}

export function formatTimeUntil(targetDate, now = new Date()) {
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { days, hours, minutes, seconds };
}
