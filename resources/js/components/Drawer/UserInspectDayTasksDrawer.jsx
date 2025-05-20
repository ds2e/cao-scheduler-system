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

import { TaskCategoriesColor } from '@/lib/enums'

export default function InspectDayTasksDrawer({ isOpen, setOpen, tasks, userID, currentSelectedDate, taskCategories }) {

    const currentDayTasks = [...tasks].filter(task => task.date_start === currentSelectedDate);

    function renderTaskCategoryBackground(taskIndex) {
        const item = taskCategories.find(cat => cat.id === currentDayTasks[taskIndex].task_category_id)?.name
        return `bg-${TaskCategoriesColor[item]}`;
    }

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
                            <div key={taskInd} className={`mb-8 border p-4 rounded-lg ${renderTaskCategoryBackground(taskInd)}`}>
                                <div className="mb-5">
                                    <div className="flex items-center justify-between mb-2">
                                        {taskCategories.find(cat => cat.id === taskEntry.task_category_id) &&
                                            <h6 className="font-bold text-white text-xl">{taskCategories.find(cat => cat.id === taskEntry.task_category_id).name}</h6>
                                        }
                                    </div>
                                    <div className="flex w-fit items-center justify-between mb-4 text-white gap-2">
                                        <div>
                                            {dayjs(taskEntry.date_start).format('YYYY-MM-DD') === currentSelectedDate
                                                ? `${dayjs(taskEntry.date_start + " " + taskEntry.time_start).format("HH:mm")}`
                                                : `${dayjs(taskEntry.date_start + " " + taskEntry.time_start).format("DD/MM/YYYY HH:mm")}`}
                                        </div>
                                        <span>-</span>
                                        <div>
                                            {dayjs(taskEntry.date_end).format('YYYY-MM-DD') === currentSelectedDate
                                                ? `${dayjs(taskEntry.date_end + " " + taskEntry.time_end).format("HH:mm")}`
                                                : `${dayjs(taskEntry.date_end + " " + taskEntry.time_end).format("DD/MM/YYYY HH:mm")}`}
                                        </div>
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        {
                                            taskEntry.users.map((user, userInd) => {

                                                return (user.id !== userID) ?
                                                    (
                                                        <div key={taskInd + userInd} className="px-2 py-1 w-auto rounded-sm md:rounded-full bg-gray-100 text-black">{user.name}</div>
                                                    )
                                                    :
                                                    (
                                                        <div key={taskInd + userInd} className="px-2 py-1 w-auto rounded-sm md:rounded-full bg-theme-secondary border-[1px] border-green-500 text-white">{user.name}</div>
                                                    )
                                            })
                                        }
                                    </div>
                                </div>

                                {(taskEntry.description) ?
                                    <div className="mb-5">
                                        <h6 className="block mb-2 text-sm font-medium text-white dark:text-gray-900">
                                            Bemerkung
                                        </h6>
                                        <p className="block w-full p-2.5 text-sm text-white rounded-sm border border-gray-300">
                                            {taskEntry.description}
                                        </p>
                                    </div>
                                    :
                                    <></>
                                }

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