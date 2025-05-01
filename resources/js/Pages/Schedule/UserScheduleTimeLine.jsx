import CalendarTimeLine from "@/components/Calendar/CalendarTimeLine";
import { useState } from "react";

export default function UserScheduleTimeLine() {
    const today = new Date()
    const [yearAndMonth, setYearAndMonth] = useState([today.getFullYear(), today.getMonth() + 1]);

    return (
        <CalendarTimeLine
            yearAndMonth={yearAndMonth}
            onYearAndMonthChange={setYearAndMonth}
        />
    )
}