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

export default function InspectDayTasksDrawer({ isOpen, setOpen, tasks, userID, currentSelectedDate }) {

    const currentDayTasks = [...tasks].filter(task => task.time === currentSelectedDate);

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerContent className="bg-white">
                <DrawerHeader>
                    <DrawerTitle>Task/Event</DrawerTitle>
                    <DrawerDescription>{dayjs(currentSelectedDate).format('DD.MM.YYYY')}</DrawerDescription>
                </DrawerHeader>

                <div className="w-full px-4">
                    <div className="max-h-[70dvh] overflow-y-scroll">
                        {currentDayTasks.map((taskEntry, taskInd) => (
                            <div key={taskInd} className="mb-8 border p-4 rounded-lg bg-gray-50">
                                <div className="mb-5">
                                    <div className="flex items-center justify-between">
                                        <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Task Carrier</h2>
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        {
                                            taskEntry.users.map((user, userInd) => {
                                                
                                                return (user.id !== userID) ?
                                                (
                                                    <div key={taskInd + userInd} className="px-2 py-1 w-auto rounded-full bg-theme-secondary text-white">{user.name}</div>
                                                )
                                                :
                                                (
                                                    <div key={taskInd + userInd} className="px-2 py-1 w-auto rounded-full bg-green-900 border-[1px] border-green-500 text-white">{user.name}</div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label htmlFor={`description-${taskInd}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Description
                                    </label>
                                    <textarea
                                        id={`description-${taskInd}`}
                                        defaultValue={taskEntry.description}
                                        readOnly
                                        rows="4"
                                        className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                        placeholder="Task description..."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <DrawerFooter className="flex flex-row items-center justify-center gap-4">
                        <DrawerClose className='cursor-pointer text-theme-secondary rounded-full border-theme-secondary border-2 px-4 py-2 hover:bg-gray-100'>
                            Close
                        </DrawerClose>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    )
}