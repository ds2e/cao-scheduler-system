import { Link, usePage } from "@inertiajs/react";
import SideMenuBar from "@/components/Navbar/SideMenuBar";

export default function AdminDashboard({ users_num, tasks_num, todos_num, avg_hpd }) {
    const { auth } = usePage().props;

    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <SideMenuBar />

            <section className="p-4 md:ml-64 h-auto pt-20">
                <h1 className="mb-4">Welcome <span className="text-theme-secondary">{auth.user.name}</span> ({auth.user.role.name})</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <Link
                        href="/dashboard/manage/users"
                        className="h-32 md:h-64 grid place-content-center text-center hover:bg-gray-100 rounded-lg"
                    >
                        <span className="text-6xl font-bold text-theme-secondary">{users_num}</span> 
                        Nutzer
                    </Link>
                    <Link
                        href="/dashboard/manage/todos"
                        className="h-32 md:h-64 grid place-content-center text-center hover:bg-gray-100 rounded-lg"
                    >
                        <span className="text-6xl font-bold text-theme-secondary">{todos_num}</span> 
                        Todos
                    </Link>
                    <div
                        className="h-32 md:h-64 grid place-content-center text-center"
                    >
                        aktueller Monat
                        <span className="text-6xl font-bold">{tasks_num}</span> 
                        Aufgabe(n)
                    </div>
                    <div
                        className="h-32 md:h-64 grid place-content-center text-center"
                    >
                        aktueller Monat
                        <span className="text-6xl font-bold">{avg_hpd}</span>
                        std/Tag
                    </div>
                </div>
                <div
                    className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"
                ></div>
            </section>
        </div>
    )
}