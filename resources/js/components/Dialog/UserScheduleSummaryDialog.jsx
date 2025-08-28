import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/de';
import { useMemo, useState } from "react";
dayjs.extend(isoWeek);
dayjs.locale('de');

export default function UserScheduleSummaryDialog({ isOpen, setOpen, tasks, taskCategories }) {

    const [weekOffset, setWeekOffset] = useState(0); // 0 = this week, -1 = last, +1 = next

    const visibleTasks = useMemo(() => {
        const baseDate = dayjs().add(weekOffset, 'week');
        const startOfWeek = baseDate.startOf('isoWeek');
        const endOfWeek = baseDate.endOf('isoWeek');

        // Initialize schedule
        const weekSchedule = {};
        for (let i = 0; i < 7; i++) {
            const weekday = startOfWeek.add(i, 'day').format('dddd');
            weekSchedule[weekday] = [];
        }

        // Populate only matching week’s tasks
        tasks.forEach(task => {
            const taskDate = dayjs(`${task.date_start} ${task.time_start}`);
            if (taskDate.isBetween(startOfWeek, endOfWeek, 'day', '[]')) {
                const weekday = taskDate.format('dddd');
                weekSchedule[weekday].push(task); // push raw task
            }
        });

        // Sort and format each day's tasks
        for (const weekday in weekSchedule) {
            weekSchedule[weekday] = weekSchedule[weekday]
                .sort((a, b) => {
                    const [aHour, aMin] = a.time_start.split(':').map(Number);
                    const [bHour, bMin] = b.time_start.split(':').map(Number);
                    return aHour !== bHour ? aHour - bHour : aMin - bMin;
                })
        }

        return weekSchedule;
    }, [tasks, weekOffset]);

    function renderTaskCategoryTextColor(taskCatID) {
        const itemColor = taskCategories.find(cat => cat.id === taskCatID)?.color
        return itemColor;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="px-2 sm:px-4">
                <DialogHeader>
                    <DialogTitle>Wochenzusammenfassung</DialogTitle>
                    <DialogDescription>
                        w&ouml;chentliche Zusammenfassung Ihrer Aufgaben
                    </DialogDescription>
                </DialogHeader>
                <Tabs value={String(weekOffset)} onValueChange={setWeekOffset} className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="-1">lzt. Woche</TabsTrigger>
                        <TabsTrigger value="0">akt. Woche</TabsTrigger>
                        <TabsTrigger value="1">n&auml;chste Woche</TabsTrigger>
                    </TabsList>

                    <TabsContent value={String(weekOffset)}
                        className="max-h-[50vh] overflow-y-auto"
                    >
                        {
                            Object.entries(visibleTasks).map(([weekday, tasks]) => {
                                return (
                                    <div key={weekday} className="flex flex-col gap-y-1 items-center">
                                        <b className={`${weekOffset == 0 && weekday == dayjs().format('dddd') ? "text-red-500" : ""}`}>{weekday}</b>
                                        <div className="flex flex-col items-center justify-center border-2 border-gray-200">
                                            {
                                                tasks.map((task, taskInd) => {
                                                    const taskDisplay = `${taskCategories.find((ele) => ele.id == task.task_category_id).name} ${dayjs(`${task.date_start} ${task.time_start}`).format('HH:mm')} - ${dayjs(`${task.date_start} ${task.time_end}`).format('HH:mm')}`;
                                                    return (
                                                        <div
                                                            key={weekday + taskInd}
                                                            className={`px-2`}
                                                            style={{
                                                                color: renderTaskCategoryTextColor(task.task_category_id)
                                                            }}
                                                        >
                                                            {taskDisplay}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </TabsContent>

                </Tabs>
            </DialogContent>
        </Dialog>
    )
}