
import { router, usePage } from "@inertiajs/react";
import ScheduleTimeTable from "./ScheduleTimeTable";

export default function SchedulePage({ tasks, users, todos, todoJobs, taskCategories }) {
    const { props } = usePage();
    const view = props.view;

    return (
        <ScheduleTimeTable tasks={tasks} todos={todos} todoJobs={todoJobs} users={users} viewYearAndMonthInterval={view} taskCategories={taskCategories}/>
    )
}