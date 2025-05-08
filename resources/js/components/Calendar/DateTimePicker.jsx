"use client";

// import { format } from "date-fns";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function DateTimePicker({ dataTime, confirmSetDataTime }) {
    // console.log(dataTime)
    const [date, setDate] = useState(dayjs(dataTime));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const parsed = dayjs(dataTime);
        if (parsed.isValid()) {
            setDate(parsed);
        }
    }, [dataTime]);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const handleDateSelect = (selectedDate) => {
        if (selectedDate) {
            // Preserve the time part
            const updated = date
                .set("year", selectedDate.getFullYear())
                .set("month", selectedDate.getMonth())
                .set("date", selectedDate.getDate());
            console.log(updated)
            setDate(updated);
        }
    };

    const handleTimeChange = (type, value) => {
        const updated = date.set(type, parseInt(value));
        setDate(updated);
    };

    function requestSetDataTime(date) {
        confirmSetDataTime(date);
        setIsOpen(false);
    }

    function setOpen(){
        const parsed = dayjs(dataTime);
        setDate(parsed);
        setIsOpen((prev) => !prev);
    }

    return (
        <Popover modal={true} open={isOpen} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="w-full justify-start text-center font-normal"
                >
                    {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                    {date ? (
                        <span className="text-white">{dayjs(date).format('HH:mm')}</span>
                    ) : (
                        <span className="text-white">HH:mm</span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date?.toDate()}
                        disabled={true}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={date && date.hour() === hour ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={date && date.minute() === minute ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("minute", minute.toString())}
                                    >
                                        {minute.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => requestSetDataTime(date)}
                    className="cursor-pointer rounded-sm px-2 py-1 text-white bg-theme-secondary hover:bg-theme-secondary-highlight ms-3 mb-3"
                >
                    Fertig
                </button>
            </PopoverContent>
        </Popover>
    );
}
