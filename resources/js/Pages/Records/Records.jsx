import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideMenuBar from "../../components/Navbar/SideMenuBar";
import { getYearDropdownOptions } from "../../components/Calendar/helpers";
import { router } from "@inertiajs/react";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // 0-based → 1-based
const currentYear = currentDate.getFullYear();

export default function RecordsPage({ users, user, year, months }) {
    const requestViewUser = (userId) => {
        router.visit(`/dashboard/manage/records?userID=${userId}&interval=${year}`)
    };

    const handleYearSelect = (e) => {
        router.visit(`/dashboard/manage/records?userID=${user.id}&interval=${e.target.value}`)
    };

    const monthNames = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];

    return (
        <>
            <SideMenuBar />
            <div className="p-4 md:ml-64 min-h-screen pt-20">
                <div className="my-2 flex flex-col items-center justify-center gap-y-4">
                    <div className='w-full flex items-center justify-center sm:justify-start'>
                        <div className='flex items-center justify-center gap-4'>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="border-2 border-gray-200 rounded-xl p-2">
                                    {users.find((u) => u.id === user.id).name}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Available Users</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {
                                        users
                                            .map((user, userInd) => {
                                                return <DropdownMenuItem
                                                    onClick={() => requestViewUser(user.id)}
                                                    key={"user" + userInd + user.id}
                                                >
                                                    {user.name}
                                                </DropdownMenuItem>
                                            })
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <select
                                className="year-select"
                                value={year}
                                onChange={handleYearSelect}
                            >
                                {getYearDropdownOptions(year).map(({ label, value }) => (
                                    <option value={value} key={String(label + value)} className='text-black'>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="min-w-full border border-gray-200 rounded-t-xl shadow-sm">
                        <div className="grid grid-cols-3 bg-gray-100 text-gray-700 font-semibold text-sm rounded-t-xl">
                            <div className="px-4 py-2 border-r">Monat</div>
                            <div className="px-4 py-2 border-r text-center">Geplante Arbeitszeit (h) (Soll)</div>
                            <div className="px-4 py-2 text-center">Gespeicherte Leistung (h) (Ist)</div>
                        </div>
                        {Object.entries(months).map(([month, data], idx) => {
                            const plan_hour = Number(data.tasks_hours).toFixed(2);
                            const record_hour = Number(data.records_hours).toFixed(2);
                            const isCurrentMonth = parseInt(month) === currentMonth && year === currentYear;
                            return (
                                <div
                                    key={month}
                                    className={`grid grid-cols-3 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <div className={`px-4 py-2 border-r font-medium ${isCurrentMonth ? "text-theme-secondary" : ""
                                        }`}>{monthNames[month - 1]}</div>
                                    <div className="px-4 py-2 border-r text-center">
                                        {plan_hour}
                                    </div>
                                    <div className="px-4 py-2 text-center">
                                        {record_hour}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}