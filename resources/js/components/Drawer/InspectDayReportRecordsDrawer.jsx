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

import { useEffect, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { DateTimePicker } from "@/components/Calendar/DateTimePicker";

export default function InspectDayReportRecordsDrawer({ isOpen, setOpen, users, reportRecords, currentSelectedDate }) {
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(null); // using extra field for form submission success because reset() in Inertia doesn't reset wasSuccessful nor isDirty
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        reportRecords: [],
        date: ''
    });

    // console.log(reportRecords)

    useEffect(() => {
        const records = reportRecords;

        const groupedUsers = {};

        records.forEach(record => {
            const userId = record.user.id;

            if (!groupedUsers[userId]) {
                // Initialize user entry (excluding nested 'user' in records)
                const { user } = record;
                groupedUsers[userId] = {
                    ...user,
                    records: []
                };
            }

            // Push record with renamed id -> record_id and remove the nested 'user'
            const { user, user_id, ...recordData } = record;
            groupedUsers[userId].records.push({
                ...recordData
            });
        });

        const result = Object.values(groupedUsers);

        console.log(result)

        setData({
            reportRecords: result,
            date: currentSelectedDate
        });

        return () => {
            clearErrors();
            setFormSubmitSuccess(null);
        }
    }, [currentSelectedDate, isOpen])

    function assignUserToTask(userEntry, existedTaskID, taskID) {
        if (!existedTaskID) {
            const newDayTasks = data.reportRecords.map((task, ind) =>
                ind === taskID
                    ? { ...task, users: [...task.users, userEntry] }
                    : task
            )
            setData('tasks', newDayTasks);
        }
        else {
            const newDayTasks = data.reportRecords.map(task =>
                task.id === existedTaskID
                    ? { ...task, users: [...task.users, userEntry] }
                    : task
            )
            setData('tasks', newDayTasks);
        }
    }

    function unassignUserFromTask(userEntry, taskID) {
        const newDayTasks = data.reportRecords.map(task =>
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
        const newTasks = [
            {
                users: [],
                description: '',
                date: date,
                time_start: '00:00:00',
                time_end: '00:00:00',
            },
            ...data.reportRecords
        ]

        setData('tasks', newTasks)
    }

    function removeTaskFromDate(taskInd) {
        const newTasks = data.reportRecords.filter((_, i) => i !== taskInd);
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

    // console.log(tasks)

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerContent className="bg-white">
                <DrawerHeader>
                    <DrawerTitle>Tages Bericht</DrawerTitle>
                    <DrawerDescription>{dayjs(currentSelectedDate).format('DD.MM.YYYY')}</DrawerDescription>
                </DrawerHeader>

                <div className="w-full px-4">
                    <div className="max-h-[70dvh] overflow-y-auto">
                        {data.reportRecords.map((recordEntryUser, recordUserInd) => {
                            return (
                                <div
                                    key={recordUserInd}
                                    className="mb-4 border p-4 rounded-lg bg-gray-500"
                                >

                                    <div className="flex md:flex-row flex-col items-center justify-evenly">
                                        <h2 className="text-white">{recordEntryUser.name} ({recordEntryUser.PIN})</h2>
                                        <div className="flex flex-col gap-y-4">
                                            {
                                                recordEntryUser.records.map((record, recordInd) => {
                                                    const startDateTime = `${record.date} ${record.time_start}`;
                                                    const endDateTime = `${record.date} ${record.time_end}`;

                                                    return (
                                                        <div className="flex flex-row gap-x-4">
                                                            <div key={recordUserInd + recordInd} className="flex flex-row items-center justify-center gap-x-2">
                                                                <span className="text-white font-bold">Start</span>
                                                                <DateTimePicker
                                                                    dataTime={startDateTime}
                                                                    confirmSetDataTime={(dataStartTime) => {
                                                                        const dateReformatted = dayjs(dataStartTime).format('YYYY-MM-DD');
                                                                        const timeReformatted = dayjs(dataStartTime).format('HH:mm:ss');

                                                                        // Clone the user-level reportRecords array
                                                                        const updatedReportRecords = [...data.reportRecords];

                                                                        // Clone the user's records array
                                                                        const updatedUserRecords = [...updatedReportRecords[recordUserInd].records];

                                                                        // Update the specific record
                                                                        updatedUserRecords[recordInd] = {
                                                                            ...updatedUserRecords[recordInd],
                                                                            date: dateReformatted,
                                                                            time_start: timeReformatted
                                                                        };

                                                                        // Apply the updated records array back to the user
                                                                        updatedReportRecords[recordUserInd] = {
                                                                            ...updatedReportRecords[recordUserInd],
                                                                            records: updatedUserRecords
                                                                        };

                                                                        // Set the full updated data
                                                                        setData({
                                                                            ...data,
                                                                            reportRecords: updatedReportRecords
                                                                        });
                                                                    }}
                                                                />
                                                                <span className="text-white font-bold">End</span>
                                                                <DateTimePicker
                                                                    dataTime={endDateTime}
                                                                    confirmSetDataTime={(dataStartTime) => {
                                                                        const dateReformatted = dayjs(dataStartTime).format('YYYY-MM-DD');
                                                                        const timeReformatted = dayjs(dataStartTime).format('HH:mm:ss');

                                                                        // Clone the user-level reportRecords array
                                                                        const updatedReportRecords = [...data.reportRecords];

                                                                        // Clone the user's records array
                                                                        const updatedUserRecords = [...updatedReportRecords[recordUserInd].records];

                                                                        // Update the specific record
                                                                        updatedUserRecords[recordInd] = {
                                                                            ...updatedUserRecords[recordInd],
                                                                            date: dateReformatted,
                                                                            time_end: timeReformatted
                                                                        };

                                                                        // Apply the updated records array back to the user
                                                                        updatedReportRecords[recordUserInd] = {
                                                                            ...updatedReportRecords[recordUserInd],
                                                                            records: updatedUserRecords
                                                                        };

                                                                        // Set the full updated data
                                                                        setData({
                                                                            ...data,
                                                                            reportRecords: updatedReportRecords
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`notice-${recordUserInd}`} className="hidden mb-2 text-sm font-medium text-white dark:text-gray-900">
                                                                    Bemerkung
                                                                </label>
                                                                <input
                                                                    id={`notice-${recordUserInd}`}
                                                                    value={record.notice}
                                                                    onChange={(e) => {
                                                                        const updatedTasks = [...data.reportRecords];
                                                                        updatedTasks[recordUserInd].notice = e.target.value;
                                                                        setData('tasks', updatedTasks);
                                                                    }}
                                                                    className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                                    placeholder="Task notice..."
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        {/* <div className="flex items-center justify-center gap-x-2">
                                                {
                                                    recordEntryAfterUser.id ?
                                                        <></>
                                                        :
                                                        <h2 className="text-lg font-medium text-theme-secondary dark:text-gray-900 text-shadow-black text-shadow-lg">(New)</h2>
                                                }
                                                <svg onClick={() => removeTaskFromDate(recordInd)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="cursor-pointer fill-theme-secondary">
                                                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                                </svg>
                                            </div> */}
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