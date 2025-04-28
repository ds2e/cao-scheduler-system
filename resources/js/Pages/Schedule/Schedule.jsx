import Calendar from "@/components/Calendar/Calendar";
import { useCallback, useState } from "react";

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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import dayjs from "dayjs";
import { useForm } from "@inertiajs/react";

export default function SchedulePage({ tasks, users }) {
    console.log(tasks);
    const today = new Date()
    const [yearAndMonth, setYearAndMonth] = useState([today.getFullYear(), today.getMonth() + 1]);

    const [open, setOpen] = useState(false);
    const [currentSelectedDate, setCurrentSelectedDate] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        user: '',
        taskDate: '',
        description: ''
    })

    function requestAssignTask(e) {
        e.preventDefault();
        // post('/login');
        console.log(data);
    }

    const handleInspectDay = useCallback((dateString) => {
        setOpen(true);
        setCurrentSelectedDate(dateString);
        setData('taskDate', dayjs(dateString).format('YYYY-MM-DD'));
    }, [])

    return (
        <>
            <div className="">
                <Calendar
                    yearAndMonth={yearAndMonth}
                    onYearAndMonthChange={setYearAndMonth}
                    requestInspectDay={handleInspectDay}
                    tasks={tasks}
                />
            </div>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="bg-white">
                    <DrawerHeader>
                        <DrawerTitle>Assign Task/Event</DrawerTitle>
                        <DrawerDescription>{dayjs(currentSelectedDate).format('DD.MM.YYYY')}</DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={requestAssignTask} className="w-3xl mx-auto">
                        <div className="mb-5">
                            <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Carrier</label>
                            <Select name="user" id="user" value={data.user} onValueChange={(e) => setData('user', e)} required>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select a User to assign" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectGroup>
                                        {
                                            users.map((user, ind) => {
                                                return (
                                                    <SelectItem className="text-theme-secondary" key={user.id + ind + currentSelectedDate} value={user.email}>{user.name}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} id="description" rows="4" name="description" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Task description..."></textarea>
                        </div>
                        <DrawerFooter className="flex flex-row items-center justify-center gap-4">
                            <button type="submit" className='cursor-pointer bg-theme text-white rounded-full px-4 py-2 hover:bg-theme-highlight'>Submit</button>
                            <DrawerClose className='cursor-pointer text-theme rounded-full border-theme border-2 px-4 py-2 hover:bg-gray-100'>
                                Cancel
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </DrawerContent>
            </Drawer>
        </>

    )
}