import dayjs from "dayjs";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

export default function UserInspectDayTodoListDrawer({ isOpen, setOpen, todoJobs, currentSelectedDate }) {

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerContent className="bg-white">
                <DrawerHeader>
                    <DrawerTitle>Todo List</DrawerTitle>
                    <DrawerDescription>{dayjs(currentSelectedDate).format('DD.MM.YYYY')}</DrawerDescription>
                </DrawerHeader>

                <div className="w-full px-4 grid gap-y-2 place-content-center">
                    <div className="max-h-[70dvh] max-w-3xl overflow-y-auto">
                        <ul className="list-disc ps-8">
                            {todoJobs.map((job, jobInd) => {
                                return (
                                    <li key={job.id + jobInd}>
                                        {job.todo.name}
                                        <span className="text-theme-secondary ms-1">({job.notice})</span>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <DrawerFooter className="w-full flex flex-row items-center justify-center gap-4">
                    <DrawerClose className='cursor-pointer text-theme-secondary rounded-full border-theme-secondary border-2 px-4 py-2 hover:bg-gray-100'>
                        Close
                    </DrawerClose>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    )
}