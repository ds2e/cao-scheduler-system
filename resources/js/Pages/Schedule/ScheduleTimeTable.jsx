import { useCallback, useEffect, useState } from "react";

import InspectDayTasksDrawer from "@/components/Calendar/InspectDayTasksDrawer";
import CalendarTimeTable from "@/components/Calendar/CalendarTimeTable";

export default function ScheduleTimeTable({ tasks, users }) {

    const today = new Date()
    const [yearAndMonth, setYearAndMonth] = useState([today.getFullYear(), today.getMonth() + 1]);

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
                onYearAndMonthChange={setYearAndMonth}
                requestInspectDay={handleInspectDay}
                tasks={tasks}
            />
            <InspectDayTasksDrawer
                isOpen={open}
                setOpen={setOpen}
                users={users}
                tasks={tasks}
                currentSelectedDate={currentSelectedDate}
            />
        </>

    )
}