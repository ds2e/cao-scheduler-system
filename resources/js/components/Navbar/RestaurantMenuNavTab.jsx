import { usePage, Link } from "@inertiajs/react";

const tabs = [
    { name: "Artikel", path: "/dashboard/manage/menu/items" },
    { name: "Kategorie", path: "/dashboard/manage/menu/categories" },
    { name: "Tisch", path: "/dashboard/manage/menu/tables" },
];

export default function RestaurantMenuNavTab() {
    const { url } = usePage();

    return (
        <div className="flex w-full rounded-full bg-white p-1">
            {tabs.map((tab) => {
                // const isActive = url === tab.path;
                const isActive = url.startsWith(tab.path); // handles query params
                return (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={`flex-1 text-center py-2 px-4 rounded-full font-medium transition-colors duration-200 ${isActive
                                ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        {tab.name}
                    </Link>
                );
            })}
        </div>
    );
}