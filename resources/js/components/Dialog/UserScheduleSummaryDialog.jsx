import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCategoriesColor } from '@/lib/enums'

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/de';
import { useMemo, useState } from "react";
dayjs.extend(isoWeek);
dayjs.locale('de');

export default function UserScheduleSummaryDialog({ isOpen, setOpen, tasks, taskCategories }) {
    // console.log(tasks)

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
                // console.log(task)
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
        const item = taskCategories.find(cat => cat.id === taskCatID)?.name
        return `text-${TaskCategoriesColor[item]}`;
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
                        <TabsTrigger value="-1">letzte Woche</TabsTrigger>
                        <TabsTrigger value="0">aktuelle Woche</TabsTrigger>
                        <TabsTrigger value="1">n&auml;chste Woche</TabsTrigger>
                    </TabsList>

                    <TabsContent value={String(weekOffset)}>
                        {
                            Object.entries(visibleTasks).map(([weekday, tasks]) => {

                                return (
                                    <div key={weekday} className="flex sm:flex-row flex-col gap-x-1 sm:items-start items-center">
                                        <b>{weekday}:</b>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start divide-x-1 divide-theme">
                                            {
                                                tasks.map((task, taskInd) => {
                                                    const taskDisplay = `${taskCategories.find((ele) => ele.id == task.task_category_id).name} ${dayjs(`${task.date_start} ${task.time_start}`).format('HH:mm')} - ${dayjs(`${task.date_start} ${task.time_end}`).format('HH:mm')}`;
                                                    return (
                                                        <span key={weekday + taskInd} className={`${renderTaskCategoryTextColor(task.task_category_id)} px-2`}>
                                                            {taskDisplay}
                                                        </span>
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