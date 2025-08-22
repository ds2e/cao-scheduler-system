import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { router } from "@inertiajs/react";

import UserInspectDayTasksDrawer from "@/components/Drawer/UserInspectDayTasksDrawer";
import UserCalendarTimeLine from "../../components/Calendar/UserCalendarTimeLine";
import UserCalendarTimeTable from "../../components/Calendar/UserCalendarTimeTable";


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

export default function UserScheduleTimeTable({ tasks, todoJobs, userID, viewYearAndMonthInterval, taskCategories }) {

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

    if (view == false) {
        return (
            <>
                <UserCalendarTimeTable
                    yearAndMonth={yearAndMonth}
                    onYearAndMonthChange={requestViewYearAndMonth}
                    requestInspectDay={handleInspectDay}
                    tasks={tasks}
                    todoJobs={todoJobs}
                    taskCategories={taskCategories}
                    requestSwitchView={requestSwitchView}
                    userID={userID}
                />
            </>

        )
    }

    return (
        <>
            <UserCalendarTimeLine
                date={date}
                requestInspectDay={handleInspectDay}
                requestTasksPrevDay={requestPrevDay}
                requestTasksNextDay={requestNextDay}
                handleDateSelect={handleDateSelect}
                requestSwitchView={requestSwitchView}
                tasks={tasks}
                todoJobs={todoJobs}
                taskCategories={taskCategories}
                userID={userID}
            />
            <UserInspectDayTasksDrawer
                isOpen={open}
                setOpen={setOpen}
                tasks={tasks}
                taskCategories={taskCategories}
                currentSelectedDate={currentSelectedDate}
                userID={userID}
            />
        </>
    )
}