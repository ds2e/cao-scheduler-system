
import { usePage } from "@inertiajs/react";
import UserScheduleTimeTable from "./UserScheduleTimeTable";

export default function UserSchedulePage({ tasks, todoJobs, userID, taskCategories }) {
    const { props } = usePage();
    const view = props.view;

    return (
        <UserScheduleTimeTable tasks={tasks} todoJobs={todoJobs} userID={userID} viewYearAndMonthInterval={view} taskCategories={taskCategories} />
    )
}