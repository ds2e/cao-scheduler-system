import { Link } from "@inertiajs/react";
import {
    daysOfWeek,
    createDaysForCurrentMonth,
    createDaysForNextMonth,
    createDaysForPreviousMonth,
    isWeekendDay,
    isToday,
    getMonthDropdownOptions,
    getYearDropdownOptions
} from "./helpers";

export default function CalendarTimeLine({
    yearAndMonth = [2021, 6],
    onYearAndMonthChange
}) {
    const [year, month] = yearAndMonth;

    let currentMonthDays = createDaysForCurrentMonth(year, month);
    let previousMonthDays = createDaysForPreviousMonth(
        year,
        month,
        currentMonthDays
    );
    let nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);
    let calendarGridDayObjects = [
        ...previousMonthDays,
        ...currentMonthDays,
        ...nextMonthDays
    ];

    const handleMonthNavBackButtonClick = () => {
        let nextYear = year;
        let nextMonth = month - 1;
        if (nextMonth === 0) {
            nextMonth = 12;
            nextYear = year - 1;
        }
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleMonthNavForwardButtonClick = () => {
        let nextYear = year;
        let nextMonth = month + 1;
        if (nextMonth === 13) {
            nextMonth = 1;
            nextYear = year + 1;
        }
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleMonthSelect = (evt) => {
        let nextYear = year;
        let nextMonth = parseInt(evt.target.value, 10);
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    const handleYearSelect = (evt) => {
        let nextMonth = month;
        let nextYear = parseInt(evt.target.value, 10);
        onYearAndMonthChange([nextYear, nextMonth]);
    };

    return (
        <div className="w-full pt-16">
            <div className="sticky top-16 py-2 z-10 bg-white">
                <div className='flex items-center justify-center place-content-center gap-4'>
                    <button onClick={handleMonthNavBackButtonClick} className='cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25}>
                            <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
                        </svg>
                    </button>
                    <select
                        className="month-select"
                        value={month}
                        onChange={handleMonthSelect}
                    >
                        {getMonthDropdownOptions().map(({ label, value }) => (
                            <option value={value} key={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleMonthNavForwardButtonClick} className='cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25}>
                            <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
                        </svg>
                    </button>
                    <select
                        className="year-select"
                        value={year}
                        onChange={handleYearSelect}
                    >
                        {getYearDropdownOptions(year).map(({ label, value }) => (
                            <option value={value} key={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <Link href="/dashboard/schedule" className="px-2 py-1 text-theme border-[1px] border-theme rounded-full">Timetable</Link>
                </div>
            </div>
        </div>
    )
}