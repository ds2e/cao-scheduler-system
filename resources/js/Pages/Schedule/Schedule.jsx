import Calendar from "@/components/Calendar/Calendar";
import { useEffect, useState } from "react";

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
    // console.log(tasks);
    const today = new Date()
    const [yearAndMonth, setYearAndMonth] = useState([today.getFullYear(), today.getMonth() + 1]);

    const [open, setOpen] = useState(false);
    const [currentSelectedDate, setCurrentSelectedDate] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        user: '',
        taskDate: '',
    })

    // useEffect(() => {
    //     setData('taskDate', currentSelectedDate);
    // }, [currentSelectedDate]);

    function requestAssignTask(e) {
        e.preventDefault();
        // post('/login');
        console.log(data);
    }

    function handleAssignTaskOnDate(dateString) {
        setOpen(true);
        setCurrentSelectedDate(dateString);
        setData('taskDate', dateString);
        // console.log(dateString)
    }

    console.log(users);

    return (
        <>
            <div className="">
                <Calendar
                    yearAndMonth={yearAndMonth}
                    onYearAndMonthChange={setYearAndMonth}
                    requestAssignTaskOnDate={handleAssignTaskOnDate}
                />
            </div>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="bg-white">
                    <DrawerHeader>
                        <DrawerTitle>Assign Task/Event</DrawerTitle>
                        <DrawerDescription>{dayjs(currentSelectedDate).date()}.{dayjs(currentSelectedDate).month()+1}.{dayjs(currentSelectedDate).year()}</DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={requestAssignTask} className="w-3xl mx-auto">
                        <div className="mb-5">
                            <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Carrier</label>
                            <Select name="user" id="user" onValueChange={(e) => setData('user', e)} required>
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
                            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                            <textarea id="description" rows="4" name="description" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Task description..."></textarea>
                        </div>
                        {/* <div className="mb-5">
                            <input hidden readOnly value={data.taskDate} />
                        </div> */}
                        <div className="flex items-start mb-5">
                            <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                            </div>
                            <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
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