import Calendar from "@/components/Calendar/Calendar";
import { useCallback, useEffect, useState } from "react";

import { router } from "@inertiajs/react";
import InspectDayTasksDrawer from "@/components/Calendar/InspectDayTasksDrawer";

export default function SchedulePage({ tasks, users }) {
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
            <div className="">
                <Calendar
                    yearAndMonth={yearAndMonth}
                    onYearAndMonthChange={setYearAndMonth}
                    requestInspectDay={handleInspectDay}
                    tasks={tasks}
                />
            </div>
            <InspectDayTasksDrawer isOpen={open} setOpen={setOpen} users={users} tasks={tasks} currentSelectedDate={currentSelectedDate} />
        </>

    )
}