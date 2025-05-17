import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import { TaskCategoriesColor } from '@/lib/enums'
import TaskCategoriesIcon from './TaskCategoriesIcon';

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import UserInspectDayTodoListDrawer from "../Drawer/UserInspectDayTodoListDrawer";

const today = new Date();

// Calculate start and end of allowed range
const minDate = dayjs(today).subtract(1, 'month').startOf('month').toDate();
const maxDate = dayjs(today).add(1, 'month').endOf('month').toDate();

const timeToColIndex = (timeStr) => {
    const [hour, minute] = timeStr.split(":").map(Number);
    if (minute >= 30) {
        return hour * 2 + 1;
    }

    return hour * 2; // 30-min slots
};

export default function UserCalendarTimeLine({
    date = new Date(),

    requestTasksPrevDay,
    requestTasksNextDay,
    handleDateSelect,

    requestInspectDay,
    requestSwitchView,
    tasks,
    todoJobs,
    taskCategories,
    userID
}) {
    const containerRef = useRef(null);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const scrollLeft = useRef(0);
    const scrollTop = useRef(0);

    const [isOpenChooseDate, setOpenChooseDate] = useState(false);
    const [isOpenTodoListDrawer, setOpenTodoListDrawer] = useState(false);

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

    const [filter, setFilter] = useState(false);

    let todayTasks;
    if (!filter) {
        todayTasks = tasks
            .filter(task => task.date_start === dayjs(date).format('YYYY-MM-DD'))
            .sort((a, b) => {
                const [aHour, aMin] = a.time_start.split(':').map(Number);
                const [bHour, bMin] = b.time_start.split(':').map(Number);
                return aHour !== bHour ? aHour - bHour : aMin - bMin;
            });
    }
    else {
        todayTasks = tasks
            .filter(task => task.users.some((user) => user.id === userID) && task.date_start === dayjs(date).format('YYYY-MM-DD'))
            .sort((a, b) => {
                const [aHour, aMin] = a.time_start.split(':').map(Number);
                const [bHour, bMin] = b.time_start.split(':').map(Number);
                return aHour !== bHour ? aHour - bHour : aMin - bMin;
            });
    }

    const todayTodoJobs = todoJobs.filter(todo => todo.date === dayjs(date).format('YYYY-MM-DD'));

    // console.log(todayTasks)

    const hourNum = 24

    const hours = Array.from({ length: hourNum }, (_, i) => String(i).padStart(2, '0') + ':00');

    function rowHeightFraction(tasks) {
        const rowNum = tasks.length;
        return `grid-rows-${rowNum}`;
    }

    function renderTaskCategoryBackground(taskEntry) {
        const item = taskCategories.find(cat => cat.id === taskEntry.task_category_id)?.name
        return TaskCategoriesColor[item];
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center place-content-center sticky top-16 py-2 z-10 bg-gray-800">
                <div className='w-full flex items-center justify-between px-2 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-center gap-4'>
                        <button
                            onClick={() => requestTasksPrevDay(date)}
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
                                        onSelect={handleDateSelect}
                                        initialFocus
                                        disabled={{ before: minDate, after: maxDate }}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                        <button
                            onClick={() => requestTasksNextDay(date)}
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
                <div className="grid grid-cols-24 min-w-[1200px] sticky top-0">
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
                        className="min-w-[1200px] h-screen col-start-1 row-start-1"
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
                    <div className={`h-fit grid grid-cols-48 ${rowHeightFraction(todayTasks)} min-w-[1200px] col-start-1 row-start-1`}>
                        {todayTasks.map((task, i) => {
                            const colStart = timeToColIndex(task.time_start) + 1;
                            const colEnd = timeToColIndex(task.time_end) + 1;
                            // const colSpan = Math.max(colEnd - colStart, 1);
                            const row = i + 1; // grid row is 1-based

                            return (
                                <div
                                    key={task.id}
                                    style={{
                                        gridColumnStart: colStart,
                                        gridColumnEnd: colEnd,
                                        gridRowStart: row,
                                        gridRowEnd: row + 1,
                                    }}
                                    className={`${renderTaskCategoryBackground(task)} text-white p-2 flex flex-col items-center justify-center rounded-sm`}
                                >
                                    {task.task_category_id && <div className='grid place-content-center mb-1'><TaskCategoriesIcon categoryId={task.task_category_id} /></div>}
                                    <div className='flex flex-wrap items-center justify-center gap-1'>
                                        {task.users.map(user => {
                                            if (!userID || user.id !== userID) {
                                                return (
                                                    <div key={user.id} className='rounded-sm px-2 py-1 bg-gray-100 text-center text-black text-xs'>{user.name}</div>
                                                )
                                            }

                                            return (
                                                <div key={user.id} className='rounded-sm px-2 py-1 bg-gray-100 border-[1px] border-black shadow-sm shadow-black text-theme-secondary font-bold text-center text-sm'>Du</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="fixed flex gap-x-2 bottom-2 right-2 sm:right-4 sm:bottom-4 lg:bottom-8 lg:right-8 bg-white rounded-full shadow-sm shadow-black">
                    <button type="button"
                        onClick={() => setFilter((prev) => !prev)}
                        className="cursor-pointer p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className={`${!filter ? "fill-theme": "fill-theme-secondary"}`}>
                            <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
                        </svg>
                    </button>
                    <button type="button"
                        onClick={() => setOpenTodoListDrawer(true)}
                        className="cursor-pointer p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className="fill-theme">
                            <path d="M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                        </svg>
                    </button>
                    <button type="button"
                        onClick={() => requestInspectDay(dayjs(date).format('YYYY-MM-DD'))}
                        className="cursor-pointer p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className="fill-theme">
                            <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                        </svg>
                    </button>
                </div>
            </div>

            <UserInspectDayTodoListDrawer isOpen={isOpenTodoListDrawer} setOpen={setOpenTodoListDrawer} todoJobs={todayTodoJobs} currentSelectedDate={date} />
        </>

    );
}