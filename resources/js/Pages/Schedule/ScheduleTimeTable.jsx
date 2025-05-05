import { useCallback, useEffect, useState } from "react";

import InspectDayTasksDrawer from "@/components/Drawer/InspectDayTasksDrawer";
import CalendarTimeTable from "@/components/Calendar/CalendarTimeTable";
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

export default function ScheduleTimeTable({ tasks, users, viewYearAndMonthInterval, taskCategories }) {

    const yearAndMonth = parseYearMonth(viewYearAndMonthInterval);

    function requestViewYearAndMonth(interval){
        const formattedView = `${interval[0]}-${String(interval[1]).padStart(2, '0')}`;
        console.log(formattedView)
        router.get(('/dashboard/schedule'), { view: formattedView });
    }

    const [open, setOpen] = useState(false);
    const [currentSelectedDate, setCurrentSelectedDate] = useState("");

    const handleInspectDay = useCallback((dateString) => {
        setOpen(true);
        setCurrentSelectedDate(dateString);
    }, [])

    return (
        <>
            <CalendarTimeTable
                yearAndMonth={yearAndMonth}
                onYearAndMonthChange={requestViewYearAndMonth}
                requestInspectDay={handleInspectDay}
                tasks={tasks}
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