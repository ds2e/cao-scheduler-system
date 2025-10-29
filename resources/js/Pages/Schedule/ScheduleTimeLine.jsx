import CalendarTimeLine from "@/components/Calendar/CalendarTimeLine";
import dayjs from "dayjs";
import { useState } from "react";

export default function ScheduleTimeLine({
    date,

    requestSwitchView,
    requestPrevDay,
    requestNextDay,
    requestSelectDay,

    users,
    tasks,
    todos,
    todoJobs,
    taskCategories,
    reportRecords
}) {

    const dayTasks = tasks
        .filter(task => task.date_start === dayjs(date).format('YYYY-MM-DD'))
        .sort((a, b) => {
            const [aHour, aMin] = a.time_start.split(':').map(Number);
            const [bHour, bMin] = b.time_start.split(':').map(Number);
            return aHour !== bHour ? aHour - bHour : aMin - bMin;
        });

    const dayTodoJobs = todoJobs.filter(todo => todo.date === dayjs(date).format('YYYY-MM-DD'));

    const dayReportRecords = reportRecords
        .filter(record => record.date_start === dayjs(date).format('YYYY-MM-DD'))
        .sort((a, b) => {
            const [aHour, aMin] = a.time_start.split(':').map(Number);
            const [bHour, bMin] = b.time_start.split(':').map(Number);
            return aHour !== bHour ? aHour - bHour : aMin - bMin;
        });

    return (
        <CalendarTimeLine
            date={date}

            requestSwitchView={requestSwitchView}
            requestPrevDay={requestPrevDay}
            requestNextDay={requestNextDay}
            requestSelectDay={requestSelectDay}

            users={users}
            dayTasks={dayTasks}
            todos={todos}
            dayTodoJobs={dayTodoJobs}
            taskCategories={taskCategories}
            dayReportRecords={dayReportRecords}
        />
    )
}