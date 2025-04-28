import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Get year dropdown options (like 2021, 2022, ..., 2030)
export function getYearDropdownOptions(currentYear) {
  const minYear = currentYear - 2;
  const maxYear = currentYear + 2;
  return Array(maxYear - minYear + 1)
    .fill(null)
    .map((_, i) => ({
      label: `${minYear + i}`,
      value: minYear + i,
    }));
}

// Get month dropdown options (January to December)
export function getMonthDropdownOptions() {
  return Array(12)
    .fill(null)
    .map((_, i) => ({
      value: i + 1,
      label: dayjs().month(i).format("MMMM"),
    }));
}

// Get number of days in a month
export function getNumberOfDaysInMonth(year, month) {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}

// Create the days for current month
export function createDaysForCurrentMonth(year, month) {
  return Array.from({ length: getNumberOfDaysInMonth(year, month) }, (_, index) => {
    return {
      dateString: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: true
    };
  });
}

// Create days from previous month needed to fill calendar
export function createDaysForPreviousMonth(year, month, currentMonthDays) {
  const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].dateString);
  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

  const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday;

  const previousMonthLastDay = previousMonth.daysInMonth();

  const startDay = previousMonthLastDay - visibleNumberOfDaysFromPreviousMonth + 1;

  return Array.from({ length: visibleNumberOfDaysFromPreviousMonth }, (_, index) => {
    return {
      dateString: dayjs(
        `${previousMonth.year()}-${previousMonth.month() + 1}-${startDay + index}`
      ).format("YYYY-MM-DD"),
      dayOfMonth: startDay + index,
      isCurrentMonth: false,
      isPreviousMonth: true
    };
  });
}

// Create days from next month needed to fill calendar
export function createDaysForNextMonth(year, month, currentMonthDays) {
  const lastDayOfTheMonthWeekday = getWeekday(
    `${year}-${month}-${currentMonthDays.length}`
  );
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

  const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday === 6 ? 0 : (6 - lastDayOfTheMonthWeekday);

  return Array.from({ length: visibleNumberOfDaysFromNextMonth }, (_, index) => {
    return {
      dateString: dayjs(
        `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
      ).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: false,
      isNextMonth: true
    };
  });
}

// Calculate weekday shifted so Monday=0 and Sunday=6
export function getWeekday(dateString) {
  const day = dayjs(dateString).day(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  return (day + 6) % 7; // Now Monday=0, Sunday=6
}

// Check if a day is weekend (Saturday or Sunday)
export function isWeekendDay(dateString) {
  const weekday = getWeekday(dateString);
  return weekday === 5 || weekday === 6; // Saturday or Sunday
}

// Check if the date is today
export function isToday(dateString) {
  const today = dayjs();
  const date = dayjs(dateString);
  return today.isSame(date, 'day');
}
