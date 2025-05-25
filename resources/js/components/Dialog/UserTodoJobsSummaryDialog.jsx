import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import dayjs from "dayjs";

export default function UserTodoJobsSummaryDialog({ isOpen, setOpen, todoJobs, currentSelectedDate }) {
    const dayTodoJobs = todoJobs.filter((todo) => todo.date == currentSelectedDate);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Todo List</DialogTitle>
                    <DialogDescription>
                        {dayjs(currentSelectedDate).format('DD/MM/YYYY')}
                    </DialogDescription>
                </DialogHeader>
                {
                    dayTodoJobs.map((job, jobInd) => {
                        return (
                            <div key={job.id + jobInd}>
                                {job.todo.name}
                                {job.notice && <>: <span className="text-theme-secondary ms-1">{job.notice}</span></>}
                            </div>
                        )
                    })
                }
            </DialogContent>
        </Dialog>
    )
}