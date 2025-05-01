
import { usePage } from "@inertiajs/react";
import UserScheduleTimeLine from "./UserScheduleTimeLine";
import UserScheduleTimeTable from "./UserScheduleTimeTable";

export default function UserSchedulePage({ tasks, userID }) {
    const { props } = usePage();
    const view = props.view;

    if (view == 'timeTable') {
        return (
            <UserScheduleTimeTable tasks={tasks} userID={userID}/>
        )
    }

    return <UserScheduleTimeLine/>
}