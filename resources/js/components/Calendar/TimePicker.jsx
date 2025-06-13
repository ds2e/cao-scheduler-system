import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDurationFromSecond } from "@/lib/utils.ts"

export function TimePicker({ dataTime, confirmSetDataTime }) {
    const [time, setTime] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setTime(dataTime);
    }, [dataTime]);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const timeHours = Math.floor(time / 3600);
    const timeMinutes = Math.floor((time % 3600) / 60);

    const handleTimeChange = (type, value) => {
        // transpose from hours, minutes, seconds to seconds
        switch (type) {
            case 'minute':
                setTime((prev) => {
                    const hourExtract = Math.floor(prev / 3600);
                    return (hourExtract * 3600) + (value * 60)
                })
                break;
            case 'hour':
                setTime((prev) => {
                    const minuteExtract = Math.floor((prev % 3600) / 60);
                    return (minuteExtract * 60) + (value * 3600)
                })
                break;
            default:
                break;
        }
    };

    function requestSetDataTime() {
        confirmSetDataTime(time);
        setIsOpen(false);
    }

    function setOpen() {
        setIsOpen((prev) => !prev);
    }

    return (
        <Popover modal={true} open={isOpen} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="w-full justify-start text-center font-normal"
                >
                    {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                    {time ? (
                        <span className="text-theme-secondary">{formatDurationFromSecond(time)}</span>
                    ) : (
                        <span className="text-theme-secondary">std:min</span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                {/* <div className="sm:flex"> */}
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                            {hours.reverse().map((hour) => (
                                <Button
                                    key={hour}
                                    size="icon"
                                    variant={time && timeHours === hour ? "default" : "ghost"}
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
                                    variant={time && timeMinutes === minute ? "default" : "ghost"}
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
                {/* </div> */}
                <button
                    type="button"
                    onClick={() => requestSetDataTime(time)}
                    className="cursor-pointer rounded-sm px-2 py-1 text-white bg-theme-secondary hover:bg-theme-secondary-highlight ms-3 mb-3"
                >
                    Fertig
                </button>
            </PopoverContent>
        </Popover>
    );
}
