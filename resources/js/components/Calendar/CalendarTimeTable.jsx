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
import TaskCategoriesIcon from './TaskCategoriesIcon';
import dayjs from 'dayjs';
import UserTodoJobsSummaryDialog from '@/components/Dialog/UserTodoJobsSummaryDialog';
import { router } from "@inertiajs/react";
import ReportRecordsSummaryDialog from '@/components/Dialog/ReportRecordsSummaryDialog';
import AdminScheduleSummaryDialog from '../Dialog/AdminScheduleSummaryDialog';

function parseYearMonth(viewStr) {
    if (!viewStr) return [new Date().getFullYear(), new Date().getMonth() + 1];

    const [yearStr, monthStr] = viewStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (!year || !month || month < 1 || month > 12) {
        // fallback to current month if invalid
        return defaultViewInterval;
    }

    return [year, month];
}

const CalendarTimeTable = memo(function CalendarComponent({
    yearAndMonth,
    reportRecords,
    tasks,
    todoJobs,
    taskCategories,
    requestSwitchView
}) {
    const [year, month] = parseYearMonth(yearAndMonth);
    const [isOpenUserTodoJobsSummary, setOpenUserTodoJobsSummary] = useState(false);
    const [isOpenReportRecordsSummary, setOpenReportRecordsSummary] = useState(false);
    const [currentSelectedDate, setCurrentSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [isOpenAdminScheduleSummary, setOpenAdminScheduleSummary] = useState(false);

    function onYearAndMonthChange(interval) {
        const formattedView = `${interval[0]}-${String(interval[1]).padStart(2, '0')}`;
        router.get(('/dashboard/schedule'), { view: formattedView });
    }

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
            return "text-gray-400";
        }
    }

    function inspectDayTodoJobs(date) {
        setCurrentSelectedDate(date);
        setOpenUserTodoJobsSummary(true);
    }

    function inspectDayReportRecords(date) {
        setCurrentSelectedDate(date);
        setOpenReportRecordsSummary(true);
    }

    function renderTaskCategoryBackground(taskEntry) {
        const itemColor = taskCategories.find(cat => cat.id === taskEntry.task_category_id)?.color
        return itemColor;
    }

    function render(day) {
        const tasksForTheDay = tasks.filter(task => task.date_start === day.dateString).sort((a, b) => a.task_category_id - b.task_category_id);
        const tasksForTheDayGroupedByCategory = Object.values(
            tasksForTheDay.reduce((acc, task) => {
                const categoryId = task.task_category_id;
                if (!acc[categoryId]) {
                    acc[categoryId] = {
                        task_category_id: categoryId,
                        users: [],
                        time_start: task.time_start,
                        time_end: task.time_end
                    };
                }

                // Avoid duplicate users (by id)
                const existingUserIds = new Set(acc[categoryId].users.map(u => u.id));
                task.users.forEach(user => {
                    if (!existingUserIds.has(user.id)) {
                        acc[categoryId].users.push(user);
                        existingUserIds.add(user.id);
                    }
                });

                return acc;
            }, {})
        );

        const tasksForTheDayGroupedByCategorySortAfterTime = tasksForTheDayGroupedByCategory.sort((a, b) => a.time_start.localeCompare(b.time_start));

        return (
            <div className="day-grid-item-header h-full p-1 flex flex-col items-start min-h-34">
                <div className='w-full px-1 flex flex-col sm:flex-row items-center justify-between gap-y-1'>
                    <p className={`p-1 ${getDayClassName(day)}`}>
                        {day.dayOfMonth}
                    </p>
                    {
                        todoJobs.find((job) => job.date === day.dateString) ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20}
                                onClick={() => inspectDayTodoJobs(day.dateString)}
                                className="fill-theme-secondary animate-pulse me-0 sm:me-1 cursor-pointer">
                                <path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                            </svg>
                            :
                            <></>
                    }
                </div>
                <div
                    onClick={() => requestSwitchView(day.dateString)}
                    className='h-full w-full p-1 hover:bg-gray-200 cursor-pointer'
                >
                    {tasksForTheDayGroupedByCategorySortAfterTime.map((task, taskInd) => {
                        return (
                            <div
                                key={String(task.task_category_id) + String(taskInd)}
                                className={`text-xs my-1 text-white rounded-sm p-1`}
                                style={{
                                    backgroundColor: renderTaskCategoryBackground(task)
                                }}
                            >
                                {
                                    task.task_category_id &&
                                    <div className='flex flex-col md:flex-row items-center justify-center mb-1 md:gap-x-1'>
                                        <TaskCategoriesIcon categoryId={task.task_category_id} />
                                        <span className='text-center sm:text-start'>
                                            {task.time_start.slice(0, 5)} </span>
                                        <span className='text-center sm:text-start'>
                                            -
                                        </span>
                                        <span className='text-center sm:text-start'>
                                            {task.time_end.slice(0, 5)}
                                        </span>
                                    </div>
                                }
                                <div className='sm:hidden block bg-gray-100 rounded-sm text-black text-center font-semibold'>+{task.users.length}</div>
                                <div className='hidden sm:grid gap-1'>
                                    {task.users.map(user => {
                                        return (
                                            <div key={user.id + taskInd} className='rounded-sm px-2 py-1 bg-gray-100 text-center text-black'>{user.name}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='w-full px-1 flex items-center justify-center'>
                    {
                        reportRecords.find((record) => record.date_start === day.dateString) ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={25} height={25}
                                onClick={() => inspectDayReportRecords(day.dateString)}
                                className='cursor-pointer fill-theme hover:fill-theme-secondary-highlight transition-all duration-200'
                            >
                                <path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM128 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 432c0-44.2 35.8-80 80-80l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16L96 448c-8.8 0-16-7.2-16-16z" />
                            </svg>
                            :
                            null
                    }
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full pt-16">
                <div className="flex flex-col items-center justify-center place-content-center sticky top-16 pt-2 z-10 bg-gray-800">
                    <div className='w-full flex items-center justify-center sm:justify-start px-2 sm:px-6'>
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
                                    <option value={value} key={String(label + value)} className='text-black'>
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
                                    <option value={value} key={String(label + value)} className='text-black'>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="days-of-week grid grid-cols-7 w-full border-y-[1px] border-white py-2 mt-2">
                        {daysOfWeek.map((day, index) => (
                            <div
                                key={day + index}
                                className={`day-grid-item-container border-x border-white text-center ${[5, 6].includes(index) ? "text-theme-secondary-highlight" : "text-white"}`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="days-grid grid grid-cols-7 min-h-screen w-full">
                    {calendarGridDayObjects.map((day, ind) => {
                        return (
                            <div
                                key={day.dateString + String(ind) + day.dayOfMonth}
                                className={`day-grid-item-container border-[1px] border-theme bg-gray-50`}
                            >
                                <div
                                    className={`h-full overflow-clip`}
                                >
                                    {render(day)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='fixed flex gap-x-2 bottom-2 right-2 sm:right-4 sm:bottom-4 lg:bottom-8 lg:right-8 bg-white rounded-full shadow-sm shadow-black'>
                <button type="button"
                    onClick={() => setOpenAdminScheduleSummary(true)}
                    className="cursor-pointer p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={20} height={20} className='fill-theme'>
                        <path d="M512 80c8.8 0 16 7.2 16 16l0 320c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16L48 96c0-8.8 7.2-16 16-16l448 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM208 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80l-64 0zM376 144c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0z" />
                    </svg>
                </button>
            </div>

            <AdminScheduleSummaryDialog
                month={month}
                year={year}
                currentSelectedDate={currentSelectedDate}
                isOpen={isOpenAdminScheduleSummary}
                setOpen={setOpenAdminScheduleSummary}
                tasks={tasks}
            />

            <UserTodoJobsSummaryDialog
                isOpen={isOpenUserTodoJobsSummary}
                setOpen={setOpenUserTodoJobsSummary}
                todoJobs={todoJobs}
                currentSelectedDate={currentSelectedDate}
            />
            <ReportRecordsSummaryDialog
                isOpen={isOpenReportRecordsSummary}
                setOpen={setOpenReportRecordsSummary}
                records={reportRecords}
                currentSelectedDate={currentSelectedDate} />
        </>

    );
})

export default CalendarTimeTable;
