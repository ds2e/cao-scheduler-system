import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/de';
import { useMemo, useState } from "react";

dayjs.extend(isoWeek);
dayjs.extend(duration);
dayjs.locale('de');

export default function AdminScheduleSummaryDialog({ isOpen, setOpen, tasks, month, year, currentSelectedDate }) {
    const [weekOffset, setWeekOffset] = useState(0); // -1, 0, +1
    const [selectedUserId, setSelectedUserId] = useState(null);

    // inside your component
    const baseDate = dayjs(currentSelectedDate);

    // only show weekly breakdown if currentSelectedDate's month/year match baseDate
    const isSameMonthYear =
        baseDate.month() + 1 == month &&
        baseDate.year() == year;

    // Group tasks per user
    const tasksGroupedByUser = useMemo(() => {
        const grouped = {};
        tasks.forEach(task => {
            task.users.forEach(user => {
                if (!grouped[user.id]) {
                    grouped[user.id] = { user, tasks: [] };
                }
                grouped[user.id].tasks.push(task);
            });
        });
        return grouped;
    }, [tasks]);

    const users = Object.values(tasksGroupedByUser).map(g => g.user);
    const activeUserId = selectedUserId ?? (users.length > 0 ? users[0].id : null);
    const activeUserTasks = activeUserId ? tasksGroupedByUser[activeUserId]?.tasks ?? [] : [];

    // Helper: format minutes -> HH:mm
    const formatMinutes = (minutes) => {
        const dur = dayjs.duration(minutes, 'minutes');
        const hours = String(dur.asHours().toFixed(0)).padStart(2, '0');
        const mins = String(dur.minutes()).padStart(2, '0');
        return `${hours}:${mins}`;
    };

    // Daily breakdown + weekly total
    const visibleTasks = useMemo(() => {
        const baseDate = dayjs().add(weekOffset, 'week');
        const startOfWeek = baseDate.startOf('isoWeek');
        const endOfWeek = baseDate.endOf('isoWeek');

        const weekSchedule = {};
        for (let i = 0; i < 7; i++) {
            const weekday = startOfWeek.add(i, 'day').format('dddd');
            weekSchedule[weekday] = [];
        }

        let totalMinutes = 0;

        activeUserTasks.forEach(task => {
            let start = dayjs(`${task.date_start} ${task.time_start}`);
            let end = dayjs(`${task.date_start} ${task.time_end}`);

            // handle overnight tasks (end before start)
            if (end.isBefore(start)) {
                end = end.add(1, "day");
            }

            if (start.isBetween(startOfWeek, endOfWeek, 'day', '[]')) {
                const weekday = start.format('dddd');
                weekSchedule[weekday].push(task);

                totalMinutes += Math.max(0, end.diff(start, 'minute')); // clamp negatives
            }
        });

        // sort each day by start time
        for (const weekday in weekSchedule) {
            weekSchedule[weekday] = weekSchedule[weekday].sort((a, b) =>
                a.time_start.localeCompare(b.time_start)
            );
        }

        return { weekSchedule, weekTotal: formatMinutes(totalMinutes) };
    }, [activeUserTasks, weekOffset]);

    // Monthly total
    const monthTotal = useMemo(() => {
        const startOfMonth = dayjs().year(year).month(month - 1).startOf('month');
        const endOfMonth = dayjs().year(year).month(month - 1).endOf('month');

        let totalMinutes = 0;

        activeUserTasks.forEach(task => {
            let start = dayjs(`${task.date_start} ${task.time_start}`);
            let end = dayjs(`${task.date_start} ${task.time_end}`);
            if (end.isBefore(start)) {
                end = end.add(1, "day");
            }
            if (start.isBetween(startOfMonth, endOfMonth, 'day', '[]')) {
                totalMinutes += Math.max(0, end.diff(start, 'minute'));
            }
        });

        return formatMinutes(totalMinutes);
    }, [activeUserTasks, month, year]);

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="px-2 sm:px-4">
                <DialogHeader>
                    <DialogTitle>Zusammenfassung</DialogTitle>
                    <DialogDescription>
                        Wöchentliche & monatliche Übersicht Ihrer Aufgaben
                    </DialogDescription>
                </DialogHeader>

                {/* User selection */}
                {users.length > 0 && (
                    <div className="mb-4 flex justify-center">
                        <select
                            value={activeUserId}
                            onChange={e => setSelectedUserId(Number(e.target.value))}
                            className="border px-2 py-1 rounded"
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Week tabs */}
                {

                    isSameMonthYear &&
                    <>
                        <Tabs value={String(weekOffset)} onValueChange={setWeekOffset} className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="-1">lzt. Woche</TabsTrigger>
                                <TabsTrigger value="0">akt. Woche</TabsTrigger>
                                <TabsTrigger value="1">nächste Woche</TabsTrigger>
                            </TabsList>

                            <TabsContent value={String(weekOffset)}
                                className="max-h-[50vh] overflow-y-auto p-2"
                            >
                                {Object.entries(visibleTasks.weekSchedule).map(([weekday, dayTasks]) => (
                                    <div key={weekday} className="flex flex-col gap-y-1 items-center">
                                        <b className={`${weekOffset == 0 && weekday === dayjs().format('dddd') ? "text-red-500" : ""}`}>
                                            {weekday}
                                        </b>
                                        {
                                            dayTasks.length > 0 &&
                                            <div className="flex flex-col items-center justify-center border-2 border-gray-200 w-full">
                                                {dayTasks.map(task => {
                                                    const taskDisplay = `${dayjs(`${task.date_start} ${task.time_start}`).format('HH:mm')} - ${dayjs(`${task.date_start} ${task.time_end}`).format('HH:mm')}`;
                                                    return (
                                                        <div key={weekday + task.id} className="px-2">
                                                            {taskDisplay}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        }

                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>

                        <div className="mt-4 text-center font-bold">
                            Gesamtzeit (Woche): {visibleTasks.weekTotal}
                        </div>
                    </>
                }

                {/* Month total */}
                <div className="mt-4 flex justify-center">
                    <b>
                        Gesamtzeit (Monat - {dayjs().year(year).month(month - 1).format("MMMM")}) : {monthTotal}
                    </b>
                </div>
            </DialogContent>
        </Dialog>
    );
}