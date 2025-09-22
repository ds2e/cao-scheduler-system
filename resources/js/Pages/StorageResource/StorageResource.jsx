import { useState } from "react";
import SideMenuBar from "../../components/Navbar/SideMenuBar";
import { router } from "@inertiajs/react";


function getSumStorage(tables) {
    let sum = 0;
    for (var i = 0; i < tables.length; i++) {
        sum += Number(tables[i].table_size_mb);
    }
    return sum.toFixed(2);
}

export default function StorageResourcePage({ storage_tables }) {
    const [isLoading, setIsLoading] = useState(false);

    function requestCleanUpRecords() {
        router.post('/dashboard/manage/storage', { action: 'cleanup-records' }, {
            onStart: () => setIsLoading(true),
            onSuccess: () => router.reload(),
            onFinish: () => setIsLoading(false),
        });
    }

    return (
        <>
            <SideMenuBar />
            <div className="p-4 md:ml-64 min-h-screen pt-20">
                <h1>Speicherplatz Zusammenfassung</h1>
                <div className="my-4">
                    <div className="min-w-full border border-gray-200 rounded-t-xl shadow-sm">
                        <div className="grid grid-cols-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-t-xl">
                            <div className="px-4 py-2 border-r">Tabelle</div>
                            <div className="px-4 py-2 border-r text-center">Speicherplatz (Mb)</div>
                        </div>
                        {storage_tables.map((table, idx) => (
                            <div
                                key={'table-' + table.table_name}
                                className={`grid grid-cols-2 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                                <div className="px-4 py-2 border-r font-medium">{table.table_name}</div>
                                <div className="px-4 py-2 border-r text-center">
                                    {table.table_size_mb}
                                </div>
                            </div>
                        ))}
                        <div className="px-4 py-2 bg-theme">
                            <h2 className="text-white">Gesamtspeicherplatz: <span className="font-bold text-theme-secondary">{getSumStorage(storage_tables)}</span> (Mb)</h2>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <button type="button"
                        disabled={isLoading}
                        onClick={() => requestCleanUpRecords()}
                        className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90"
                    >
                        {isLoading ? "Laden..." : "Leistung aufräumen"}
                    </button>
                    <button type="button" className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                        Datenbank optimieren
                    </button>
                    {/* <button type="button" className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                        + User
                    </button> */}
                </div>
            </div>
        </>
    )
}