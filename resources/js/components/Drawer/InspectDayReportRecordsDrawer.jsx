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
import { formatDurationFromSecond } from "@/lib/utils.ts"
import { TimePicker } from "../Calendar/TimePicker";

export default function InspectDayReportRecordsDrawer({ isOpen, setOpen, users, reportRecords, currentSelectedDate }) {
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(null); // using extra field for form submission success because reset() in Inertia doesn't reset wasSuccessful nor isDirty
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        reportRecords: [],
        date: ''
    });

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

    function removeRecordFromUser(userEntry, record) {
        const newReportRecords = data.reportRecords.map(recordUserEntry =>
            recordUserEntry.id === userEntry.id
                ? {
                    ...recordUserEntry,
                    records: recordUserEntry.records.filter(rcrd => rcrd.id !== record.id)
                }
                : recordUserEntry
        );
        setData('reportRecords', newReportRecords);
    }

    function addRecordToUser(userEntry) {
        const newRecordEntry = {
            date: currentSelectedDate,
            notice: '',
            duration: 0,
            time_start: '00:00:00',
            time_end: '00:00:01'
        }

        const newReportRecords = data.reportRecords.map(recordUserEntry =>
            recordUserEntry.id === userEntry.id
                ? {
                    ...recordUserEntry,
                    records: [...recordUserEntry.records, newRecordEntry]
                }
                : recordUserEntry
        );

        setData('reportRecords', newReportRecords);
    }

    function addRecordOfUserToDate(user) {
        const newReportRecords = [
            ...data.reportRecords,
            {
                ...user,
                records: []
            }
        ]

        setData('reportRecords', newReportRecords);
    }

    function removeRecordOfUserFromDate(userEntry) {
        const newReportRecords = data.reportRecords.filter(recordUserEntry => recordUserEntry.id !== userEntry.id);
        setData('reportRecords', newReportRecords);
    }

    function handleAssignRecordsDate() {
        post('/dashboard/schedule/report', {
            onSuccess: () => {
                setOpen(false);
                setFormSubmitSuccess(true);
            }
        });
    }

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
                                    className="mb-4 border p-4 rounded-lg bg-gray-100"
                                >

                                    <div className="flex md:flex-row flex-col items-center justify-evenly gap-y-2">
                                        <div className="flex items-center gap-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={30} height={30}
                                                onClick={() => removeRecordOfUserFromDate(recordEntryUser)}
                                                className="fill-theme-secondary"
                                            >
                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                                            </svg>
                                            <h2>{recordEntryUser.name} <span className="text-theme-secondary font-bold">({recordEntryUser.PIN})</span></h2>
                                        </div>

                                        <div className="flex flex-col gap-y-4">
                                            {
                                                recordEntryUser.records.map((record, recordInd) => {
                                                    const startDateTime = `${record.date} ${record.time_start}`;
                                                    const endDateTime = `${record.date} ${record.time_end}`;

                                                    return (
                                                        <div key={String(recordUserInd + '-' + recordInd)} className="flex items-center justify-between flex-row gap-x-4">
                                                            <div className="flex flex-row items-center justify-center gap-x-2 px-2 rounded-full bg-theme">
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
                                                                <span className="text-white">-</span>
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
                                                            <div className="text-theme-secondary">
                                                                {/* {formatDurationFromSecond(record.duration)} */}
                                                                <TimePicker dataTime={record.duration} confirmSetDataTime={(dataDuration) => {
                                                                    // Clone the user-level reportRecords array
                                                                    const updatedReportRecords = [...data.reportRecords];

                                                                    // Clone the user's records array
                                                                    const updatedUserRecords = [...updatedReportRecords[recordUserInd].records];

                                                                    // Update the specific record
                                                                    updatedUserRecords[recordInd] = {
                                                                        ...updatedUserRecords[recordInd],
                                                                        duration: dataDuration
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
                                                                }} />
                                                            </div>
                                                            <div>
                                                                <label htmlFor={`notice-${recordUserInd}`} className="hidden mb-2 text-sm font-medium text-white dark:text-gray-900">
                                                                    Bemerkung
                                                                </label>
                                                                <input
                                                                    id={`notice-${recordUserInd}`}
                                                                    value={record.notice ?? ''}
                                                                    onChange={(e) => {
                                                                        // Clone the user-level reportRecords array
                                                                        const updatedReportRecords = [...data.reportRecords];

                                                                        // Clone the user's records array
                                                                        const updatedUserRecords = [...updatedReportRecords[recordUserInd].records];

                                                                        // Update the specific record
                                                                        updatedUserRecords[recordInd] = {
                                                                            ...updatedUserRecords[recordInd],
                                                                            notice: e.target.value,
                                                                        };

                                                                        // Apply the updated records array back to the user
                                                                        updatedReportRecords[recordUserInd] = {
                                                                            ...updatedReportRecords[recordUserInd],
                                                                            records: updatedUserRecords
                                                                        };

                                                                        setData({
                                                                            ...data,
                                                                            reportRecords: updatedReportRecords
                                                                        });
                                                                    }}
                                                                    className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                                                    placeholder="Task notice..."
                                                                />
                                                            </div>
                                                            <svg onClick={() => removeRecordFromUser(recordEntryUser, record)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="cursor-pointer fill-theme-secondary">
                                                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                                            </svg>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        {/* Add record to User */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={30} height={30}
                                            onClick={() => addRecordToUser(recordEntryUser)}
                                            className="cursor-pointer fill-theme"
                                        >
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                                        </svg>
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
                        {/* <button
                            type="button"
                            onClick={() => addRecordOfUserToDate(currentSelectedDate)}
                            className="cursor-pointer ms-auto text-theme rounded-full border-theme border-2 px-4 py-2 hover:bg-gray-100"
                        >
                            + Record
                        </button> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer flex items-center gap-x-1 bg-theme rounded-full pe-2 py-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={30} height={30} className="fill-white">
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                                </svg>
                                <span className="text-white">Record</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Available Users</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {
                                    [...users]
                                        .filter(usr => !data.reportRecords.some(recUser => recUser.id === usr.id))
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((usr, usrInd) => {
                                            return <DropdownMenuItem onClick={() => addRecordOfUserToDate(usr)} key={"rest-Todo" + usr.id}>{usr.name}</DropdownMenuItem>
                                        })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <DrawerFooter className="flex flex-row items-center justify-center gap-4">
                        <button disabled={processing} type="button" onClick={() => handleAssignRecordsDate(data)} className={`rounded-full px-4 py-2 select-none ${(processing) ? "bg-muted text-theme" : "cursor-pointer bg-theme text-white hover:bg-theme-highlight"}`}>
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