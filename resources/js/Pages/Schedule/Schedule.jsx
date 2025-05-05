
import { router, usePage } from "@inertiajs/react";
import ScheduleTimeTable from "./ScheduleTimeTable";

export default function SchedulePage({ tasks, users, taskCategories }) {
    const { props } = usePage();
    const view = props.view;

    console.log(tasks);

    return (
        <ScheduleTimeTable tasks={tasks} users={users} viewYearAndMonthInterval={view} taskCategories={taskCategories}/>
    )
}