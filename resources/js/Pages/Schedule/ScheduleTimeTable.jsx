import { useState } from "react";

import CalendarTimeTable from "@/components/Calendar/CalendarTimeTable";
import ScheduleTimeLine from "./ScheduleTimeLine"
import dayjs from "dayjs";

const today = new Date();

export default function ScheduleTimeTable({ tasks, users, todos, todoJobs, viewYearAndMonthInterval, taskCategories, reportRecords }) {

    const [view, setView] = useState(false);
    const [date, setDate] = useState(today);

    function requestSwitchViewDate(day) {
        setDate(day)
        setView((prev) => !prev);
    }

    function requestSwitchView() {
        setView((prev) => !prev);
    }

    const todoJobsWithTodo = todoJobs.map((job) => {
        const newJob = { ...job };
        newJob.todo = todos.find((todo) => todo.id == newJob.todo_id);
        return newJob;
    })

    function requestPrevDay(date) {
        const prevDate = dayjs(date).subtract(1, "day").format("YYYY-MM-DD");
        setDate(prevDate);
    }

    function requestNextDay(date) {
        const nextDate = dayjs(date).add(1, "day").format("YYYY-MM-DD");
        setDate(nextDate);
    }

    function handleDateSelect(date) {
        setDate(date)
    }

    if (view == false) {
        return (
            <>
                <CalendarTimeTable
                    yearAndMonth={viewYearAndMonthInterval}
                    tasks={tasks}
                    reportRecords={reportRecords}
                    todoJobs={todoJobsWithTodo}
                    taskCategories={taskCategories}
                    requestSwitchView={requestSwitchViewDate}
                />
            </>
        )
    }

    return (
        <>
            <ScheduleTimeLine
                date={date}

                requestSwitchView={requestSwitchView}
                requestPrevDay={requestPrevDay}
                requestNextDay={requestNextDay}
                requestSelectDay={handleDateSelect}

                users={users}

                tasks={tasks}
                taskCategories={taskCategories}

                todos={todos}
                todoJobs={todoJobs}

                reportRecords={reportRecords}               
            />
        </>
    )
}