import { memo, useState } from 'react';
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
import { TaskCategoriesColor } from '@/lib/enums'
import TaskCategoriesIcon from './TaskCategoriesIcon';

const CalendarTimeTable = memo(function CalendarComponent({
    yearAndMonth,
    onYearAndMonthChange,
    requestInspectDay,
    tasks,
    taskCategories,
    requestSwitchView,
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
            return "text-white font-semibold bg-theme-secondary rounded-sm";
        } else {
            if (day.isCurrentMonth) {
                return "text-theme";
            }
            return "text-gray-500";
        }
    }

    function renderTaskCategoryBackground(taskEntry) {
        const item = taskCategories.find(cat => cat.id === taskEntry.task_category_id)?.name
        return TaskCategoriesColor[item];
    }

    function render(day) {
        const tasksForTheDay = tasks.filter(task => task.date_start === day.dateString).sort((a, b) => a.task_category_id - b.task_category_id);

        return (
            <div className="day-grid-item-header p-1 flex flex-col items-start">
                <p className={`p-1 ${getDayClassName(day)}`}>
                    {day.dayOfMonth}
                </p>
                <div className='h-full w-full p-1'>
                    {tasksForTheDay.map(task => (
                        <div key={task.id} className={`text-xs my-1 text-white rounded-sm p-1 ${renderTaskCategoryBackground(task)}`}>
                            {task.task_category_id && <div className='grid place-content-center mb-1'><TaskCategoriesIcon categoryId={task.task_category_id} /></div>}
                            {
                                (userID && task.users.some(user => user.id === userID)) ?
                                    <div className='sm:hidden block bg-theme-secondary rounded-sm text-theme border-[1px] border-black text-center font-bold'>+{task.users.length}</div>
                                    :
                                    <div className='sm:hidden block bg-gray-100 rounded-sm text-black text-center font-semibold'>+{task.users.length}</div>
                            }
                            <div className='hidden sm:grid gap-1'>
                                {task.users.map(user => {
                                    if (!userID || user.id !== userID) {
                                        return (
                                            <div key={user.id} className='rounded-sm px-2 py-1 bg-gray-100 text-center text-black'>{user.name}</div>
                                        )
                                    }

                                    return (
                                        <div key={user.id} className='rounded-sm px-2 py-1 bg-gray-100 border-[1px] border-black shadow-sm shadow-black text-theme-secondary font-bold text-center'>You</div>
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
            <div className="flex flex-col items-center justify-center place-content-center sticky top-16 pt-2 z-10 bg-gray-800">
                <div className='w-full flex items-center justify-between px-4'>
                    <div className='flex items-center justify-center gap-4'>
                        <button onClick={handleMonthNavBackButtonClick} className='cursor-pointer group'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className='fill-white group-hover:fill-theme bg-transparent group-hover:bg-white transition-all duration-300 rounded-full'>
                                <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
                            </svg>
                        </button>
                        <select
                            className="month-select text-white"
                            value={month}
                            onChange={handleMonthSelect}
                        >
                            {getMonthDropdownOptions().map(({ label, value }) => (
                                <option value={value} key={value} className='text-black'>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleMonthNavForwardButtonClick} className='cursor-pointer group'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className='fill-white group-hover:fill-theme bg-transparent group-hover:bg-white transition-all duration-300 rounded-full'>
                                <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
                            </svg>
                        </button>
                        <select
                            className="year-select text-white"
                            value={year}
                            onChange={handleYearSelect}
                        >
                            {getYearDropdownOptions(year).map(({ label, value }) => (
                                <option value={value} key={value} className='text-black'>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => requestSwitchView()} className="cursor-pointer px-2 py-1 text-white border-[1px] border-white rounded-sm group hover:bg-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={20} height={20} className='fill-white group-hover:fill-theme transition-all duration-300'>
                            <path d="M128 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm32 97.3c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80S48 51.8 48 96c0 32.8 19.7 61 48 73.3L96 224l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0 54.7c-28.3 12.3-48 40.5-48 73.3c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3l0-54.7 256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-54.7c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 32.8 19.7 61 48 73.3l0 54.7-320 0 0-54.7zM488 96a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM320 392a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                        </svg>
                    </button>
                </div>
                <div className="days-of-week grid grid-cols-7 w-full border-y-[1px] border-white py-2 mt-2">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={day}
                            className={`day-grid-item-container border-x border-white text-center ${[5, 6].includes(index) ? "text-theme-secondary-highlight" : "text-white"}`}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="days-grid grid grid-cols-7 min-h-screen w-full">
                {calendarGridDayObjects.map((day) => {
                    const hasTask = tasks.some(task => task.date_start === day.dateString);

                    return (
                        <div
                            key={day.dateString}
                            className={`day-grid-item-container border-[1px] border-theme bg-gray-50`}
                        >
                            <div
                                onClick={hasTask || !userID ? () => requestInspectDay(day.dateString) : undefined}
                                className={`h-full overflow-clip ${hasTask || !userID ? 'hover:bg-gray-200 cursor-pointer' : ''}`}
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
