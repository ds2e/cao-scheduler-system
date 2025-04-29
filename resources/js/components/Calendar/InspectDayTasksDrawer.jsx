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

// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect } from "react";
import { router, useForm } from "@inertiajs/react";

export default function InspectDayTasksDrawer({ isOpen, setOpen, users, tasks, currentSelectedDate }) {
    const { data, setData, post, processing, errors } = useForm({
        tasks: [],
        date: ''
    });

    useEffect(() => {
        setData('tasks', tasks.filter(task => task.time === currentSelectedDate));
        setData('date', currentSelectedDate);
        console.log(data)
    }, [currentSelectedDate, isOpen])

    function assignUserToTask(userEntry, existedTaskID, taskID) {
        console.log(existedTaskID, taskID)
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
        const newTasks = [...data.tasks, { users: [], description: '', time: date }]
        setData('tasks', newTasks)
    }

    function removeTaskFromDate(taskInd) {
        const newTasks = data.tasks.filter((_, i) => i !== taskInd);
        setData('tasks', newTasks);
    }

    function handleAssignTasksDate(data) {
        // console.log(tasks);
        // console.log(data)
        post('/dashboard/schedule');
    }

    console.log(errors)

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerContent className="bg-white">
                <DrawerHeader>
                    <DrawerTitle>Assign Task/Event</DrawerTitle>
                    <DrawerDescription>{dayjs(currentSelectedDate).format('DD.MM.YYYY')}</DrawerDescription>
                </DrawerHeader>

                <div className="w-full px-4">
                    <div className="max-h-[70dvh] overflow-y-scroll">
                        {data.tasks.map((taskEntry, taskInd) => (
                            <div key={taskInd} className="mb-8 border p-4 rounded-lg bg-gray-50">
                                <div className="mb-5">
                                    <div className="flex items-center justify-between">
                                        <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Task Carrier</h2>
                                        <svg onClick={() => removeTaskFromDate(taskInd)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="m-2 cursor-pointer fill-theme-secondary">
                                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                        </svg>
                                    </div>
                                    <div className="flex justify-start gap-2">
                                        {
                                            taskEntry.users.map((user, userInd) => {
                                                return (
                                                    <button onClick={() => unassignUserFromTask(user, taskEntry.id)} key={taskInd + userInd} className="cursor-pointer px-2 py-1 w-auto rounded-full bg-theme-secondary text-white hover:bg-theme-secondary-highlight">{user.name}</button>
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
                                                            return <DropdownMenuItem onClick={() => assignUserToTask(restUser, taskEntry.id, taskInd)} key={"rest-user" + taskInd + restUserInd}>{restUser.name}</DropdownMenuItem>
                                                        })
                                                }
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label htmlFor={`description-${taskInd}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
                        ))}
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        {Object.keys(errors).length > 0 && (
                            <div className="space-y-1 overflow-y-scroll h-10">
                                {Object.entries(errors).map(([field, message]) => (
                                    <p className="text-red-500 font-semibold" key={field}>
                                        {field}: {message}
                                    </p>
                                ))}
                                {/* {Object.entries(errors).map(([field, message]) => (
                                    Array.isArray(message)
                                        ? message.map((m, i) => <p key={`${field}-${i}`}>{field}: {m}</p>)
                                        : <p key={field}>{field}: {message}</p>
                                ))} */}
                                {/* {Object.entries(errors).reduce((grouped, [key, message]) => {
                                    const match = key.match(/^tasks\.(\d+)\.(.+)$/);
                                    if (match) {
                                        const [_, taskIndex, field] = match;
                                        grouped[taskIndex] = grouped[taskIndex] || [];
                                        grouped[taskIndex].push({ field, message });
                                    } else {
                                        // Global error or not tied to a task
                                        grouped['global'] = grouped['global'] || [];
                                        grouped['global'].push({ field: key, message });
                                    }
                                    return grouped;
                                })} */}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => addTaskToDate(currentSelectedDate)}
                            className="cursor-pointer float-right text-theme rounded-full border-theme border-2 px-4 py-2 hover:bg-gray-100"
                        >
                            Add Task
                        </button>
                    </div>

                    <DrawerFooter className="flex flex-row items-center justify-center gap-4">
                        <button type="button" onClick={() => handleAssignTasksDate(data)} className='cursor-pointer bg-theme text-white rounded-full px-4 py-2 hover:bg-theme-highlight'>
                            Submit
                        </button>
                        <DrawerClose className='cursor-pointer text-theme-secondary rounded-full border-theme-secondary border-2 px-4 py-2 hover:bg-gray-100'>
                            Cancel
                        </DrawerClose>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    )
}