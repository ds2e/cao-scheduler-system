import { usePage, Link } from "@inertiajs/react";

const tabs = [
    { name: "Artikel", path: "/dashboard/manage/menu/items" },
    { name: "Kategorie", path: "/dashboard/manage/menu/categories" },
    { name: "Tisch", path: "/dashboard/manage/menu/tables" },
];

export default function RestaurantMenuNavTab() {
    const { url } = usePage();

    return (
        <div className="flex w-full rounded-full bg-white p-1 mb-10">
            {tabs.map((tab) => {
                const isActive = url.startsWith(tab.path); // handles query params
                return (
                    <div key={tab.path} className="relative flex-1">
                        <Link
                            href={tab.path}
                            className={`block text-center py-2 px-4 rounded-full font-medium transition-colors duration-200 ${isActive
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "bg-white text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            {tab.name}
                        </Link>

                        {tab.name === "Artikel" && (
                            <Link
                                href={'/dashboard/manage/menu/items/tax'}
                                className={`absolute left-1/2 top-[100%] -translate-x-1/2
                       py-2 px-4 rounded-b-md font-medium text-sm z-10
                       ${url.startsWith("/dashboard/manage/menu/items/tax")
                                ? "bg-gray-900 text-white hover:bg-gray-800"
                                : "bg-white text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                Steuersatz
                            </Link>
                        )}
                    </div>
                );
            })}
        </div>
    );
}