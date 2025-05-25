import { Fragment, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import TaskCategoriesIcon from './TaskCategoriesIcon';

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import InspectDayTodoListDrawer from "@/components/Drawer/InspectDayTodoListDrawer";
import InspectDayTasksDrawer from "@/components/Drawer/InspectDayTasksDrawer";
import InspectDayReportRecordsDrawer from "@/components/Drawer/InspectDayReportRecordsDrawer";

const today = new Date();

// Calculate start and end of allowed range
const minDate = dayjs(today).subtract(1, 'month').startOf('month').toDate();
const maxDate = dayjs(today).add(1, 'month').endOf('month').toDate();

const timeToColIndex = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    // console.log([hour, minute])
    if (minute >= 30) {
        return hour * 2 + 1;
    }

    return hour * 2; // 30-min slots
};

export default function CalendarTimeLine({
    date = new Date(),

    requestSwitchView,
    requestPrevDay,
    requestNextDay,
    requestSelectDay,

    dayTasks,
    todos,
    dayTodoJobs,
    users,
    taskCategories,
    dayReportRecords
}) {
    const containerRef = useRef(null);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const scrollLeft = useRef(0);
    const scrollTop = useRef(0);

    const [isOpenChooseDate, setOpenChooseDate] = useState(false);
    const [isOpenDayTasksDrawer, setOpenDayTasksDrawer] = useState(false);
    const [isOpenTodoListDrawer, setOpenTodoListDrawer] = useState(false);
    const [isOpenReportRecordsDrawer, setOpenReportRecordsDrawer] = useState(false);

    useEffect(() => {
        const container = containerRef.current;

        const onMouseDown = (e) => {
            isDragging.current = true;
            startX.current = e.pageX - container.offsetLeft;
            startY.current = e.pageY - container.offsetTop;
            scrollLeft.current = container.scrollLeft;
            scrollTop.current = container.scrollTop;
        };

        const onMouseUp = () => {
            isDragging.current = false;
        };

        const onMouseLeave = () => {
            isDragging.current = false;
        };

        const onMouseMove = (e) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const y = e.pageY - container.offsetTop;
            const walkX = x - startX.current;
            const walkY = y - startY.current;
            container.scrollLeft = scrollLeft.current - walkX;
            container.scrollTop = scrollTop.current - walkY;
        };

        const updateHeight = () => {
            if (container) {
                const offsetTop = container.offsetTop;
                const availableHeight = window.innerHeight - offsetTop;
                container.style.height = `${availableHeight - 3}px`;
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mouseleave', onMouseLeave);
        container.addEventListener('mousemove', onMouseMove);

        return () => {
            container.removeEventListener('mousedown', onMouseDown);
            container.removeEventListener('mouseup', onMouseUp);
            container.removeEventListener('mouseleave', onMouseLeave);
            container.removeEventListener('mousemove', onMouseMove);

            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    // console.log(todayTasks)

    const groupedUsers = {};

    dayTasks.forEach(task => {
        task.users.forEach(user => {
            const userId = user.id;

            if (!groupedUsers[userId]) {
                // Shallow clone user data without the pivot and users list
                const { pivot, ...userData } = user;
                groupedUsers[userId] = {
                    ...userData,
                    tasks: []
                };
            }

            // Shallow clone task data without the users list
            const { users, ...taskData } = task;
            groupedUsers[userId].tasks.push(taskData);
        });
    });

    // Final array result
    const result = Object.values(groupedUsers);
    // console.log(result)

    const hourNum = 24

    const hours = Array.from({ length: hourNum }, (_, i) => String(i).padStart(2, '0') + ':00');

    function rowHeightFraction(tasks) {
        const rowNum = tasks.length;
        return `grid-rows-${rowNum}`;
    }

    function renderTaskCategoryBackground(taskEntry) {
        const itemColor = taskCategories.find(cat => cat.id === taskEntry.task_category_id)?.color
        return itemColor;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center place-content-center sticky top-16 py-2 z-10 bg-gray-800">
                <div className='w-full flex items-center justify-between px-2 sm:px-6'>
                    <div className='flex items-center justify-center gap-4'>
                        <button
                            onClick={() => requestPrevDay(date)}
                            className='cursor-pointer group'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className="fill-white group-hover:fill-theme bg-transparent group-hover:bg-white transition-all duration-300 rounded-full">
                                <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
                            </svg>
                        </button>
                        <Popover modal={true} open={isOpenChooseDate} onOpenChange={setOpenChooseDate}>
                            <PopoverTrigger asChild>
                                <button
                                    className="w-full justify-start text-center font-normal"
                                >
                                    {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                                    {date ? (
                                        <span className="text-white">{dayjs(date).format('DD/MM/YYYY')}</span>
                                    ) : (
                                        <span className="text-white">DD/MM/YYYY</span>
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <div className="sm:flex">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={requestSelectDay}
                                        initialFocus
                                        disabled={{ before: minDate, after: maxDate }}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                        <button
                            onClick={() => requestNextDay(date)}
                            className='cursor-pointer group'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className="fill-white group-hover:fill-theme bg-transparent group-hover:bg-white transition-all duration-300 rounded-full">
                                <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
                            </svg>
                        </button>
                    </div>
                    <button onClick={() => requestSwitchView()} className="cursor-pointer px-2 py-1 text-white border-[1px] border-white rounded-sm group hover:bg-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={20} height={20} className='fill-white group-hover:fill-theme transition-all duration-300'>
                            <path d="M128 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm32 97.3c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80S48 51.8 48 96c0 32.8 19.7 61 48 73.3L96 224l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0 54.7c-28.3 12.3-48 40.5-48 73.3c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3l0-54.7 256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-54.7c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 32.8 19.7 61 48 73.3l0 54.7-320 0 0-54.7zM488 96a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM320 392a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div
                ref={containerRef}
                className="w-full relative overflow-auto cursor-grab active:cursor-grabbing select-none border rounded-md mt-16"
            >
                <div className="grid grid-cols-24 min-w-[2400px] sticky top-0 z-[41]">
                    {hours.map((hour, i) => (
                        <div
                            key={i}
                            className="h-12 text-center text-xs text-gray-700 bg-gray-100 border-b border-r pt-2"
                        >
                            {hour}
                        </div>
                    ))}
                </div>

                <div className="grid">
                    <div
                        className="min-w-[2400px] h-screen col-start-1 row-start-1"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                      to right,
                      transparent,
                      transparent calc(100% / 48 - 1px),
                      #e5e7eb calc(100% / 48 - 1px),
                      #e5e7eb calc(100% / 48)
                    )`,
                            backgroundSize: '100% 100%',
                        }}
                    >

                    </div>
                    <div className={`h-fit grid grid-cols-48 ${rowHeightFraction(dayTasks)} min-w-[2400px] col-start-1 row-start-1`}>
                        {dayTasks.map((task, i) => {
                            const colStart = timeToColIndex(task.time_start) + 1;
                            const colEnd = timeToColIndex(task.time_end) + 1;
                            const row = i + 1; // grid row is 1-based

                            return (
                                <div
                                    key={task.id}
                                    style={{
                                        gridColumnStart: colStart,
                                        gridColumnEnd: colEnd,
                                        gridRowStart: row,
                                        gridRowEnd: row + 1,
                                        backgroundColor: renderTaskCategoryBackground(task)
                                    }}
                                    className={`text-white p-2 flex flex-col items-center justify-center rounded-sm`}
                                >
                                    {task.task_category_id && <div className='grid place-content-center mb-1'><TaskCategoriesIcon categoryId={task.task_category_id} /></div>}
                                    <div className='flex flex-wrap items-center justify-center gap-1'>
                                        {task.users.map(user => {
                                            return (
                                                <div key={user.id} className='rounded-sm px-2 py-1 bg-gray-100 text-center text-black text-xs'>{user.name}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="fixed flex gap-x-2 bottom-2 right-2 sm:right-4 sm:bottom-4 lg:bottom-8 lg:right-8">
                    <button type="button"
                        onClick={() => setOpenReportRecordsDrawer(true)}
                        className="cursor-pointer p-2 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={25} height={25}
                            className='fill-theme group-hover:fill-theme-secondary-highlight transition-all duration-200'
                        >
                            <path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM128 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 432c0-44.2 35.8-80 80-80l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16L96 448c-8.8 0-16-7.2-16-16z" />
                        </svg>
                    </button>
                    <button type="button"
                        onClick={() => setOpenTodoListDrawer(true)}
                        className="cursor-pointer p-2 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20}
                            className="fill-theme group-hover:fill-theme-secondary-highlight transition-all duration-200">
                            <path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                        </svg>
                    </button>
                    <button type="button"
                        onClick={() => setOpenDayTasksDrawer(true)}
                        className="cursor-pointer p-2 group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20}
                            className="fill-theme group-hover:fill-theme-secondary-highlight transition-all duration-200">
                            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                        </svg>
                    </button>
                </div>
            </div>

            <InspectDayTodoListDrawer
                isOpen={isOpenTodoListDrawer}
                setOpen={setOpenTodoListDrawer}
                todoJobs={dayTodoJobs}
                todos={todos}
                currentSelectedDate={date} />

            <InspectDayTasksDrawer
                isOpen={isOpenDayTasksDrawer}
                setOpen={setOpenDayTasksDrawer}
                users={users}
                tasks={dayTasks}
                taskCategories={taskCategories}
                currentSelectedDate={date}
            />

            <InspectDayReportRecordsDrawer
                isOpen={isOpenReportRecordsDrawer}
                setOpen={setOpenReportRecordsDrawer}
                users={users}
                reportRecords={dayReportRecords}
                currentSelectedDate={date}
            />
        </>

    );
}