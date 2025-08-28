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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { DateTimePicker } from "@/components/Calendar/DateTimePicker";

export default function InspectDayTasksDrawer({ isOpen, setOpen, users, tasks, currentSelectedDate, taskCategories }) {
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(null); // using extra field for form submission success because reset() in Inertia doesn't reset wasSuccessful nor isDirty
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        tasks: [],
        date: ''
    });

    useEffect(() => {
        setData({
            tasks: tasks,
            date: currentSelectedDate
        });

        return () => {
            clearErrors();
            setFormSubmitSuccess(null);
        }
    }, [currentSelectedDate, isOpen])

    function assignUserToTask(userEntry, existedTaskID, taskID) {
        if (!existedTaskID) {
            const newDayTasks = data.tasks.map((task, ind) =>
                ind === taskID
                    ? { ...task, users: [...task.users, userEntry] }
                    : task
            )
            setData('tasks', newDayTasks);
        }
        else {
            const newDayTasks = data.tasks.map(task =>
                task.id === existedTaskID
                    ? { ...task, users: [...task.users, userEntry] }
                    : task
            )
            setData('tasks', newDayTasks);
        }
    }

    function unassignUserFromTask(userEntry, taskID) {
        const newDayTasks = data.tasks.map(task =>
            task.id === taskID
                ? {
                    ...task,
                    users: task.users.filter(user => user.id !== userEntry.id)
                }
                : task
        );
        setData('tasks', newDayTasks);
    }

    function addTaskToDate(date) {
        console.log(date)
        const newTasks = [
            {
                users: [],
                description: '',
                date_start: date,
                date_end: date,
                time_start: '00:00:00',
                time_end: '00:00:00',
                task_category_id: taskCategories.length
            },
            ...data.tasks
        ]

        setData('tasks', newTasks)
    }

    function removeTaskFromDate(taskInd) {
        const newTasks = data.tasks.filter((_, i) => i !== taskInd);
        setData('tasks', newTasks);
    }

    function handleAssignTasksDate(data) {
        post('/dashboard/schedule', {
            onSuccess: () => {
                setOpen(false);
                setFormSubmitSuccess(true);
            }
        });
    }

    function renderTaskCategoryBackground(taskIndex) {
        const itemColor = taskCategories.find(cat => cat.id === data.tasks[taskIndex].task_category_id)?.color
        return itemColor;
    }

    // console.log(tasks)

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerContent className="bg-white">
                <DrawerHeader>
                    <DrawerTitle>Assign Task/Event</DrawerTitle>
                    <DrawerDescription>{dayjs(currentSelectedDate).format('DD.MM.YYYY')}</DrawerDescription>
                </DrawerHeader>

                <div className="w-full px-4">
                    <div className="max-h-[70dvh] overflow-y-auto">
                        {data.tasks.map((taskEntry, taskInd) => {
                            // console.log(taskEntry)
                            // Get today’s date in YYYY-MM-DD format
                            const today = dayjs().format("YYYY-MM-DD");

                            // Fallbacks for date_start and date_end
                            const dateStart = taskEntry.date_start || today;
                            const dateEnd = taskEntry.date_end || today;

                            // Build full datetime strings
                            const startDateTime = `${dateStart} ${taskEntry.time_start || "00:00:00"}`;
                            const endDateTime = `${dateEnd} ${taskEntry.time_end || "23:59:59"}`;

                            return (
                                <div
                                    key={taskInd}
                                    className={`mb-8 border p-4 rounded-lg`}
                                    style={{
                                        backgroundColor: renderTaskCategoryBackground(taskInd)
                                    }}
                                >
                                    <div className="mb-5">
                                        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                                            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                                                <div className="flex items-center justify-center gap-x-2">
                                                    <span className="text-white font-bold">Start</span>
                                                    <DateTimePicker
                                                        dataTime={startDateTime}
                                                        confirmSetDataTime={(dataStartTime) => {
                                                            const dateReformatted = dayjs(dataStartTime).format('YYYY-MM-DD');
                                                            const timeReformatted = dayjs(dataStartTime).format('HH:mm:ss');

                                                            const updatedTasks = [...data.tasks];
                                                            updatedTasks[taskInd] = {
                                                                ...updatedTasks[taskInd],
                                                                date_start: dateReformatted,
                                                                time_start: timeReformatted
                                                            };

                                                            console.log(updatedTasks[taskInd])
                                                            setData({
                                                                ...data,
                                                                tasks: updatedTasks,
                                                            });
                                                        }}
                                                    />
                                                    <span className="text-white font-bold">End</span>
                                                    <DateTimePicker
                                                        dataTime={endDateTime}
                                                        confirmSetDataTime={(dataStartTime) => {
                                                            const dateReformatted = dayjs(dataStartTime).format('YYYY-MM-DD');
                                                            const timeReformatted = dayjs(dataStartTime).format('HH:mm:ss');

                                                            const updatedTasks = [...data.tasks];
                                                            updatedTasks[taskInd] = {
                                                                ...updatedTasks[taskInd],
                                                                date_end: dateReformatted,
                                                                time_end: timeReformatted
                                                            };

                                                            console.log(updatedTasks[taskInd])
                                                            setData({
                                                                ...data,
                                                                tasks: updatedTasks,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center gap-x-2">
                                                <Select
                                                    defaultValue={String(taskCategories[taskCategories.length - 1].id)}
                                                    value={String(taskEntry.task_category_id)}
                                                    onValueChange={(e) => {
                                                        const updatedTasks = [...data.tasks];
                                                        updatedTasks[taskInd] = {
                                                            ...updatedTasks[taskInd],
                                                            task_category_id: Number(e),
                                                        };
                                                        setData({
                                                            ...data,
                                                            tasks: updatedTasks,
                                                        });
                                                    }}
                                                >
                                                    <SelectTrigger className="text-white">
                                                        <SelectValue placeholder="Task Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Categories</SelectLabel>
                                                            {taskCategories.map((cat, cat_ind) => (
                                                                <SelectItem key={taskInd + cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {
                                                    taskEntry.id ?
                                                        <></>
                                                        :
                                                        <h2 className="text-lg font-medium text-theme-secondary dark:text-gray-900 text-shadow-black text-shadow-lg">(New)</h2>
                                                }
                                                <svg onClick={() => removeTaskFromDate(taskInd)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="cursor-pointer fill-theme-secondary">
                                                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex justify-start gap-2">
                                            {
                                                taskEntry.users.map((user, userInd) => {
                                                    return (
                                                        <button onClick={() => unassignUserFromTask(user, taskEntry.id)} key={taskInd + userInd} className="cursor-pointer px-2 py-1 w-auto rounded-sm md:rounded-full bg-theme-secondary text-white hover:bg-theme-secondary-highlight">{user.name}</button>
                                                    )
                                                })
                                            }
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={30} height={30} className="fill-theme">
                                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                                                    </svg>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Available Users</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {
                                                        users
                                                            .filter(user => !taskEntry.users.some(taskUser => taskUser.id === user.id))
                                                            .map((restUser, restUserInd) => {
                                                                return <DropdownMenuItem onClick={() => assignUserToTask(restUser, taskEntry.id, taskInd)} key={"rest-user" + taskInd + restUser.id}>{restUser.name}</DropdownMenuItem>
                                                            })
                                                    }
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor={`description-${taskInd}`} className="block mb-2 text-sm font-medium text-white dark:text-gray-900">
                                            Description
                                        </label>
                                        <textarea
                                            id={`description-${taskInd}`}
                                            value={taskEntry.description}
                                            onChange={(e) => {
                                                const updatedTasks = [...data.tasks];
                                                updatedTasks[taskInd].description = e.target.value;
                                                setData('tasks', updatedTasks);
                                            }}
                                            rows="4"
                                            className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                            placeholder="Task description..."
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        {formSubmitSuccess == null ?
                            (
                                <div className="space-y-1 overflow-y-auto h-10">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <p className="text-red-500 font-semibold" key={field}>
                                            {field}: {message}
                                        </p>
                                    ))}
                                </div>
                            )
                            :
                            (
                                <p className="text-green-500 font-semibold">
                                    Assign Day Tasks successfully!
                                </p>
                            )

                        }
                        <button
                            type="button"
                            onClick={() => addTaskToDate(currentSelectedDate)}
                            className="cursor-pointer ms-auto text-theme rounded-full border-theme border-2 px-4 py-2 hover:bg-gray-100"
                        >
                            + Task
                        </button>
                    </div>

                    <DrawerFooter className="flex flex-row items-center justify-center gap-4">
                        <button disabled={processing} type="button" onClick={() => handleAssignTasksDate(data)} className={`rounded-full px-4 py-2 select-none ${(processing) ? "bg-muted text-theme" : "cursor-pointer bg-theme text-white hover:bg-theme-highlight"}`}>
                            {processing ? 'Submitting...' : 'Submit'}
                        </button>
                        <DrawerClose className='cursor-pointer text-theme-secondary rounded-full border-theme-secondary border-2 px-4 py-2 hover:bg-gray-100'>
                            Close
                        </DrawerClose>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    )
}