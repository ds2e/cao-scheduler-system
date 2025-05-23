import { Fragment, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import InspectDayTodoListDrawer from "@/components/Drawer/InspectDayTodoListDrawer";

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

function getTaskDuration(task) {
    return timeToColIndex(task.time_end) - timeToColIndex(task.time_start);
}

export default function ReservationPage({ reservations }) {
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

    const [date, setDate] = useState(new Date());

    const todayReservations = reservations
        .filter(task => task.date === dayjs(date).format('YYYY-MM-DD'))
        .sort((a, b) => {
            const [aHour, aMin] = a.time_start.split(':').map(Number);
            const [bHour, bMin] = b.time_start.split(':').map(Number);
            return aHour !== bHour ? aHour - bHour : aMin - bMin;
        });

    const minDate = dayjs().subtract(2, 'day').toDate();
    const maxDate = dayjs().add(3, 'day').toDate();

    console.log(todayReservations)

    // const groupedUsers = {};

    // todayReservations.forEach(task => {
    //     task.users.forEach(user => {
    //         const userId = user.id;

    //         if (!groupedUsers[userId]) {
    //             // Shallow clone user data without the pivot and users list
    //             const { pivot, ...userData } = user;
    //             groupedUsers[userId] = {
    //                 ...userData,
    //                 tasks: []
    //             };
    //         }

    //         // Shallow clone task data without the users list
    //         const { users, ...taskData } = task;
    //         groupedUsers[userId].tasks.push(taskData);
    //     });
    // });

    // // Final array result
    // const result = Object.values(groupedUsers);
    // console.log(result)

    const hourNum = 24

    const hours = Array.from({ length: hourNum }, (_, i) => String(i).padStart(2, '0') + ':00');

    function rowHeightFraction(tasks) {
        const rowNum = tasks.length;
        return `grid-rows-${rowNum}`;
    }

    function handleDateSelect(date) {
        setDate(date)
    }

    function requestReservationsPrevDay(date) {
        const prev = dayjs(date).subtract(1, "day").toDate();
        setDate(prev);
    }

    function requestReservationsNextDay(date) {
        const next = dayjs(date).add(1, "day").toDate();
        setDate(next);
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center place-content-center sticky top-16 py-2 z-10 bg-gray-800">
                <div className='w-full flex items-center justify-between px-2 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-center gap-4'>
                        <button
                            onClick={() => requestReservationsPrevDay(date)}
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
                            onClick={() => requestReservationsNextDay(date)}
                            className='cursor-pointer group'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className="fill-white group-hover:fill-theme bg-transparent group-hover:bg-white transition-all duration-300 rounded-full">
                                <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
                            </svg>
                        </button>
                    </div>
                    {/* <button onClick={() => requestSwitchView()} className="cursor-pointer px-2 py-1 text-white border-[1px] border-white rounded-sm group hover:bg-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={20} height={20} className='fill-white group-hover:fill-theme transition-all duration-300'>
                            <path d="M128 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm32 97.3c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80S48 51.8 48 96c0 32.8 19.7 61 48 73.3L96 224l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0 54.7c-28.3 12.3-48 40.5-48 73.3c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3l0-54.7 256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-54.7c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 32.8 19.7 61 48 73.3l0 54.7-320 0 0-54.7zM488 96a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM320 392a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                        </svg>
                    </button> */}
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
                    <div className={`h-fit grid grid-cols-48 ${rowHeightFraction(todayReservations)} min-w-[2400px] col-start-1 row-start-1`}>
                        {todayReservations.map((reservation, i) => {
                            const colStart = timeToColIndex(reservation.time_start) + 1;
                            const colEnd = timeToColIndex(reservation.time_end) + 1;
                            const row = i + 1; // grid row is 1-based

                            return (
                                <div
                                    key={reservation.id}
                                    style={{
                                        gridColumnStart: colStart,
                                        gridColumnEnd: colEnd,
                                        gridRowStart: row,
                                        gridRowEnd: row,
                                    }}
                                    className={`text-white p-2 flex flex-col items-start rounded-sm bg-blue-500 z-1 hover:z-10 hover:bg-red-500`}
                                >
                                    {/* {task.task_category_id && <div className='grid place-content-center mb-1'><TaskCategoriesIcon categoryId={task.task_category_id} /></div>} */}
                                    <span className="text-xs">{reservation.name}</span>
                                    <span>{reservation.number}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="fixed flex gap-x-2 bottom-2 right-2 sm:right-4 sm:bottom-4 lg:bottom-8 lg:right-8">
                    <button type="button"
                        // onClick={() => setOpenTodoListDrawer(true)}
                        className="cursor-pointer p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={30} height={30} className="fill-theme">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* <InspectDayTodoListDrawer isOpen={isOpenTodoListDrawer} setOpen={setOpenTodoListDrawer} todoJobs={todayTodoJobs} todos={todos} currentSelectedDate={date} /> */}
        </>

    );
}