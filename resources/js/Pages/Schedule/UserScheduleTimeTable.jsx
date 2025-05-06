import { useCallback, useState } from "react";

import UserInspectDayTasksDrawer from "@/components/Drawer/UserInspectDayTasksDrawer";
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

export default function UserScheduleTimeTable({ tasks, userID, viewYearAndMonthInterval, taskCategories }) {

    const yearAndMonth = parseYearMonth(viewYearAndMonthInterval);

    function requestViewYearAndMonth(interval) {
        const formattedView = `${interval[0]}-${String(interval[1]).padStart(2, '0')}`;
        console.log(formattedView)
        router.get(('/dashboard/schedule'), { view: formattedView });
    }

    const [open, setOpen] = useState(false);
    const [currentSelectedDate, setCurrentSelectedDate] = useState("");

    const [view, setView] = useState(false);

    function requestSwitchView() {
        setView((prev) => !prev);
    }

    const handleInspectDay = useCallback((dateString) => {
        setOpen(true);
        setCurrentSelectedDate(dateString);
    }, [])

    if (view == false) {
        return (
            <>
                <CalendarTimeTable
                    yearAndMonth={yearAndMonth}
                    onYearAndMonthChange={requestViewYearAndMonth}
                    requestInspectDay={handleInspectDay}
                    tasks={tasks}
                    taskCategories={taskCategories}
                    requestSwitchView={requestSwitchView}
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

    return (
        <>
            <CalendarTimeLine 
              date={new Date()}
              renderCellContent={(row, col) => {
                if (row === 8 && col === 10) return "Meeting";
                return null;
              }}
              requestSwitchView={requestSwitchView}
            />
            {/* <CalendarTimeTable
                yearAndMonth={yearAndMonth}
                onYearAndMonthChange={requestViewYearAndMonth}
                requestInspectDay={handleInspectDay}
                tasks={tasks}
                taskCategories={taskCategories}
                requestSwitchView={requestSwitchView}
                userID={userID}
            />
            <UserInspectDayTasksDrawer
                isOpen={open}
                setOpen={setOpen}
                tasks={tasks}
                taskCategories={taskCategories}
                currentSelectedDate={currentSelectedDate}
                userID={userID}
            /> */}
        </>
    )
}