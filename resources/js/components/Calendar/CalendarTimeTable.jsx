import { memo, useState } from 'react';
import './Calendar.css'
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
import { Link } from '@inertiajs/react';

const CalendarTimeTable = memo(function CalendarComponent({
    yearAndMonth = [2021, 6],
    onYearAndMonthChange,
    requestInspectDay,
    tasks,
    userID = undefined
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

    function getDayClassName(day) {
        if (isToday(day.dateString)) {
            return "text-white font-semibold bg-theme-secondary rounded-full";
        } else {
            if (day.isCurrentMonth) {
                return "text-white";
            }
            return "text-gray-500";
        }
    }

    function render(day) {
        const tasksForTheDay = tasks.filter(task => task.time === day.dateString);

        return (
            <div className="day-grid-item-header p-1 flex flex-col items-start">
                <p className={`p-1 ${getDayClassName(day)}`}>
                    {day.dayOfMonth}
                </p>
                <div className='h-full p-1'>
                    {tasksForTheDay.map(task => (
                        <div key={task.id} className="text-xs my-1 text-white">
                            {task.description && <h6 className='mb-1'>{task.description.substring(0, 20)}</h6>}
                            <div className='flex flex-wrap gap-1 justify-start'>
                                {task.users.map(user => {
                                    if (!userID || user.id !== userID) {
                                        return (
                                            <div key={user.id} className='rounded-full px-2 py-1 bg-theme-secondary-highlight'>{user.name}</div>
                                        )
                                    }

                                    return (
                                        <div key={user.id} className='rounded-full px-2 py-1 bg-green-900 border-[1px] border-green-500'>You</div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full pt-16">
            <div className="flex flex-col items-center justify-center place-content-center sticky top-16 py-2 z-10 bg-white">
                <div className='flex items-center justify-center gap-4'>
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
                    <Link href="/dashboard/schedule?view=timeLine" className="px-2 py-1 text-theme border-[1px] border-theme rounded-full">Timeline</Link>
                </div>
                <div className="days-of-week border-t-[1px] border-theme pt-2 mt-2">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={day}
                            className={`day-grid-item-container border-x border-theme text-center ${[5, 6].includes(index) ? "text-theme-secondary-highlight" : ""}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="days-grid min-h-screen">
                {calendarGridDayObjects.map((day) => {
                    const hasTask = tasks.some(task => task.time === day.dateString);

                    return (
                        <div
                            key={day.dateString}
                            className={`day-grid-item-container border-[1px] border-white bg-theme`}
                        >
                            <div
                                onClick={hasTask || !userID ? () => requestInspectDay(day.dateString) : undefined}
                                className={`h-full overflow-clip ${hasTask || !userID ? 'hover:bg-theme-highlight cursor-pointer' : ''}`}
                            >
                                {render(day)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
})

export default CalendarTimeTable;
