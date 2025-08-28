import { Link, usePage } from "@inertiajs/react";
import SideMenuBar from "@/components/Navbar/SideMenuBar";

export default function UserDashboard({ tasks, monthly_stats }) {
    const { auth } = usePage().props;

    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <SideMenuBar />

            <section className="p-4 md:ml-64 min-h-screen pt-20">
                <h1 className="mb-4">Willkommen <span className="text-theme-secondary">{auth.user.name}</span></h1>
                <div className="mb-4 border-2 border-theme rounded-sm p-4">
                    <h2 className="text-theme text-2xl font-bold text-center xs:text-start">Zeitplan</h2>
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 my-4">
                        <div className="flex flex-col items-center justify-center">
                            <p>
                                letzte Woche
                            </p>
                            <p>
                                <span className="text-2xl text-theme-secondary">{tasks.last_week.count}</span> Aufgabe(n) <br />
                                <span className="text-2xl text-theme-secondary">{tasks.last_week.days}</span> Tag(e)
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p>
                                aktuelle Woche
                            </p>
                            <p>
                                <span className="text-2xl text-theme-secondary">{tasks.this_week.count}</span> Aufgabe(n) <br />
                                <span className="text-2xl text-theme-secondary">{tasks.this_week.days}</span> Tag(e)
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p>
                                nächste Woche
                            </p>
                            <p>
                                <span className="text-2xl text-theme-secondary">{tasks.next_week.count}</span> Aufgabe(n) <br />
                                <span className="text-2xl text-theme-secondary">{tasks.next_week.days}</span> Tag(e)
                            </p>
                        </div>
                    </div>
                    <div className="text-center xs:text-end">
                        <Link href="/dashboard/schedule" className="text-white bg-theme hover:bg-theme-highlight px-2 py-1 rounded-sm">Details anzeigen {`>>`}</Link>
                    </div>
                </div>
                <div className="mb-4 border-2 border-theme rounded-sm p-4">
                    <h2 className="text-theme text-2xl font-bold text-center xs:text-start">Leistung</h2>
                    <div className="my-4">
                        <div className="min-w-full border border-gray-200 rounded-t-xl shadow-sm">
                            <div className="grid grid-cols-3 bg-gray-100 text-gray-700 font-semibold text-sm rounded-t-xl">
                                <div className="px-4 py-2 border-r">Monat</div>
                                <div className="px-4 py-2 border-r text-center">Gesamtstunden</div>
                                <div className="px-4 py-2 text-center">Stunde / Tag</div>
                            </div>

                            {Object.entries(monthly_stats).map(([month, data], idx) => (
                                <div
                                    key={month}
                                    className={`grid grid-cols-3 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <div className="px-4 py-2 border-r font-medium">{month}</div>
                                    <div className="px-4 py-2 border-r text-center">
                                        {data.total_hours}
                                    </div>
                                    <div className="px-4 py-2 text-center">
                                        {data.avg_hours_per_day}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <div className="text-center xs:text-end">
                        <Link href="/dashboard/schedule" className="text-white bg-theme hover:bg-theme-highlight px-2 py-1 rounded-sm">Details anzeigen {`>>`}</Link>
                    </div> */}
                </div>
            </section>
        </div>
    )
}