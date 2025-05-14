import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

import InspectDayTasksDrawer from "@/components/Drawer/InspectDayTasksDrawer";
import CalendarTimeTable from "@/components/Calendar/CalendarTimeTable";
import CalendarTimeLine from "@/components/Calendar/CalendarTimeLine";
import { router } from "@inertiajs/react";

const today = new Date()
const defaultViewInterval = [today.getFullYear(), today.getMonth() + 1];

function parseYearMonth(viewStr) {
    if (!viewStr) return defaultViewInterval;

    const [yearStr, monthStr] = viewStr.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (!year || !month || month < 1 || month > 12) {
        // fallback to current month if invalid
        return defaultViewInterval;
    }

    return [year, month];
}

export default function ScheduleTimeTable({ tasks, users, todos, todoJobs, viewYearAndMonthInterval, taskCategories }) {

    const yearAndMonth = parseYearMonth(viewYearAndMonthInterval);

    function requestViewYearAndMonth(interval) {
        const formattedView = `${interval[0]}-${String(interval[1]).padStart(2, '0')}`;
        router.get(('/dashboard/schedule'), { view: formattedView });
    }

    const [open, setOpen] = useState(false);
    const [currentSelectedDate, setCurrentSelectedDate] = useState("");

    const [view, setView] = useState(false);

    function requestSwitchView(day) {
        setDate(day)
        setView((prev) => !prev);
    }

    const handleInspectDay = useCallback((dateString) => {
        setOpen(true);
        setCurrentSelectedDate(dateString);
    }, [])

    const [date, setDate] = useState(today);

    function requestPrevDay(date) {
        const prev = dayjs(date).subtract(1, "day").toDate();
        setDate(prev);
    }

    function requestNextDay(date) {
        const next = dayjs(date).add(1, "day").toDate();
        setDate(next);
    }

    function handleDateSelect(date) {
        setDate(date)
    }

    // console.log(todos)

    if (view == false) {
        return (
            <>
                <CalendarTimeTable
                    yearAndMonth={yearAndMonth}
                    onYearAndMonthChange={requestViewYearAndMonth}
                    tasks={tasks}
                    todoJobs={todoJobs}
                    taskCategories={taskCategories}
                    requestSwitchView={requestSwitchView}
                />
            </>
        )
    }

    return (
        <>
            <CalendarTimeLine
                date={date}
                requestInspectDay={handleInspectDay}
                requestTasksPrevDay={requestPrevDay}
                requestTasksNextDay={requestNextDay}
                handleDateSelect={handleDateSelect}
                requestSwitchView={requestSwitchView}
                users={users}
                tasks={tasks}
                todos={todos}
                todoJobs={todoJobs}
                taskCategories={taskCategories}
            />
            <InspectDayTasksDrawer
                isOpen={open}
                setOpen={setOpen}
                users={users}
                tasks={tasks}
                taskCategories={taskCategories}
                currentSelectedDate={currentSelectedDate}
            />
        </>
    )
}