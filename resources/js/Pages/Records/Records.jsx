import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideMenuBar from "@/components/Navbar/SideMenuBar";
import { getYearDropdownOptions } from "@/components/Calendar/helpers";
import { router } from "@inertiajs/react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import dayjs from "dayjs";

export default function RecordsPage({ users, user, year, months }) {
    const requestViewUser = (userId) => {
        router.visit(`/dashboard/manage/records?userID=${userId}&interval=${year}`)
    };

    const handleYearSelect = (e) => {
        router.visit(`/dashboard/manage/records?userID=${user.id}&interval=${e.target.value}`)
    };

    const [selectedMonth, setSelectedMonth] = useState(months[0])

    const chartConfig = {
        tasks_hours: {
            label: "Soll",
            color: "#2563eb",
        },
        records_hours: {
            label: "Ist",
            color: "#60a5fa",
        },
    };

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
                    <div className="w-full flex lg:flex-row flex-col items-center border border-gray-200 rounded-t-xl shadow-sm">
                        <ChartContainer config={chartConfig} className="min-h-[50dvh] max-h-[500px] w-full lg:w-2/3">
                            <BarChart onClick={(e) => setSelectedMonth(e.activePayload[0].payload)} accessibilityLayer data={months}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="monthName"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="tasks_hours" fill="var(--color-theme)" radius={4}
                                    shape={(props) => {
                                        const isSelected = props.payload?.monthName === selectedMonth?.monthName;
                                        return (
                                            <rect
                                                {...props}
                                                fill={isSelected ? "var(--color-theme)" : "var(--color-accent-secondary)"}
                                                opacity={isSelected ? 1 : 0.5}
                                                stroke={isSelected ? "var(--color-accent-secondary)" : "none"}
                                                strokeWidth={isSelected ? 2 : 0}
                                            />
                                        );
                                    }}
                                >
                                    <LabelList
                                        position="top"
                                        className="fill-foreground"
                                        fontSize={10}
                                    />
                                </Bar>
                                <Bar dataKey="records_hours" fill="var(--color-theme-secondary)" radius={4}
                                    shape={(props) => {
                                        const isSelected = props.payload?.monthName === selectedMonth?.monthName;
                                        return (
                                            <rect
                                                {...props}
                                                fill={isSelected ? "var(--color-theme-secondary)" : "var(--color-accent-secondary)"}
                                                opacity={isSelected ? 1 : 0.5}
                                                stroke={isSelected ? "var(--color-accent-secondary)" : "none"}
                                                strokeWidth={isSelected ? 2 : 0}
                                            />
                                        );
                                    }}
                                >
                                    <LabelList
                                        position="top"
                                        className="fill-foreground"
                                        fontSize={10}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>

                        <div className="min-h-[50dvh] max-h-[500px] relative overflow-auto w-full lg:w-1/3">
                            <div className="sticky top-0 grid grid-cols-3 bg-gray-100 text-gray-700 font-semibold text-sm rounded-t-xl lg:rounded-t-none">
                                <div className="px-4 py-2 border-r">Tag</div>
                                <div className="px-4 py-2 border-r text-center">Geplant<span className="xl:inline-block hidden">e Arbeitszeit</span> (h) <span className="text-theme">(Soll)</span></div>
                                <div className="px-4 py-2 text-center"><span className="xl:inline-block hidden">Gespeicherte </span>Leistung (h) <span className="text-theme-secondary">(Ist)</span></div>
                            </div>
                            {selectedMonth?.details.map((data, idx) => {
                                const plan_hour = Number(data.task_hours).toFixed(2);
                                const record_hour = Number(data.record_hours).toFixed(2);
                                return (
                                    <div
                                        key={String(data.dateString) + idx}
                                        className={`grid grid-cols-3 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                    >
                                        <div className={`px-4 py-2 border-r font-medium ${dayjs().format('DD.MM.YYYY') === data.dateString ? "text-theme-secondary" : ""
                                            }`}>{data.dateString}</div>
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
            </div>
        </>
    )
}