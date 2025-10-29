import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import dayjs from "dayjs";
import { formatDurationFromSecond } from "@/lib/utils.ts"

export default function ReportRecordsSummaryDialog({ isOpen, setOpen, records, currentSelectedDate }) {
    const dayRecords = records
        .filter((record) => record.date_start == currentSelectedDate)
        .sort((a, b) => {
            const [aHour, aMin] = a.time_start.split(':').map(Number);
            const [bHour, bMin] = b.time_start.split(':').map(Number);
            return aHour !== bHour ? aHour - bHour : aMin - bMin;
        });

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="!max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle>Tages Bericht</DialogTitle>
                    <DialogDescription>
                        {dayjs(currentSelectedDate).format('DD/MM/YYYY')}
                    </DialogDescription>
                </DialogHeader>
                <div className="hidden font-semibold sm:flex items-center justify-between">
                    <h2 className="basis-1/3">Mitarbeiter</h2>
                    <h2 className="basis-1/6">Onlinezeit</h2>
                    <h2 className="basis-1/6">Arbeitszeit</h2>
                    <h2 className="basis-1/3">Bemerkung</h2>
                </div>
                {
                    dayRecords.map((record, recordInd) => {
                        return (
                            <div key={String(record.id + '-' + recordInd)} className="flex sm:flex-row flex-col items-center justify-between max-h-[70dvh] scroll-y-auto">
                                <span className="basis-1/3 sm:text-start text-center">
                                    {record.user.name} ({record.user.PIN})
                                </span>
                                <span className="basis-1/6 sm:text-start text-center text-theme-secondary">
                                    Von: {record.time_start}<br />
                                    Bis: {record.time_end}
                                </span>
                                <span className="basis-1/6 sm:text-start text-center text-theme-secondary">
                                    {formatDurationFromSecond(record.duration)}
                                </span>
                                <span className="basis-1/3 sm:text-start text-center">
                                    {record.notice}
                                </span>
                            </div>
                        )
                    })
                }
            </DialogContent>
        </Dialog>
    )
}