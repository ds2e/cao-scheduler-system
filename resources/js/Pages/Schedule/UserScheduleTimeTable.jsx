import { useCallback, useState } from "react";

import UserInspectDayTasksDrawer from "@/components/Calendar/UserInspectDayTasksDrawer";
import CalendarTimeTable from "@/components/Calendar/CalendarTimeTable";

export default function UserScheduleTimeTable({ tasks, userID }) {

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
                userID={userID}
            />
            <UserInspectDayTasksDrawer
                isOpen={open}
                setOpen={setOpen}
                tasks={tasks}
                currentSelectedDate={currentSelectedDate}
                userID={userID}
            />
        </>

    )
}