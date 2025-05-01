
import { router, usePage } from "@inertiajs/react";
import ScheduleTimeTable from "./ScheduleTimeTable";
import ScheduleTimeLine from "./ScheduleTimeLine";

export default function SchedulePage({ tasks, users }) {
    const { props } = usePage();
    const view = props.view;

    if (view == 'timeTable') {
        return (
            <ScheduleTimeTable tasks={tasks} users={users} />
        )
    }

    return <ScheduleTimeLine/>
}