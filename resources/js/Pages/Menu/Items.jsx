import { Link, useForm, router } from "@inertiajs/react";
import RestaurantMenuNavTab from "../../components/Navbar/RestaurantMenuNavTab";
import SideMenuBar from "../../components/Navbar/SideMenuBar";
import { useState } from "react";
import ItemDialog from "../../components/Dialog/ItemDialog";

export default function ItemsTab({ items, allCats }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, transform } = useForm({
        currentSelectedItemData: {},
        mode: ''
    });
    const [currentPage, setCurrentPage] = useState(items.current_page);

    const [isOpenDeleteItemDialog, setOpenDeleteItemDialog] = useState(false);
    const [isOpenItemDialog, setOpenItemDialog] = useState(false);

    const goToPage = (page) => {
        // Inertia automatically handles page requests
        setCurrentPage(page);
        router.get(`/dashboard/manage/menu/items?page=${page}`);
    };

    function requestEditItem(item) {
        const ItemData = {
            ...item,
        }
        setData({
            currentSelectedItemData: ItemData,
            mode: 'update'
        });
        setOpenItemDialog(true);
    }

    function requestAddItem() {
        setData({
            mode: 'create'
        });
        setOpenItemDialog(true);
    }

    function requestSubmitData(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        if (data.mode == "create") {
        }

        console.log(payload)
        // console.log(data)
        // patch(`/dashboard/manage/users/${data.currentSelectedItemData.id}`, {
        //     onSuccess: () => {
        //         setData({
        //             ...data,
        //             currentSelectedItemData: {}
        //         });
        //     }
        // });
    }

    function requestDeleteItem(item) {
        const ItemData = {
            ...item,
        }
        setData({
            currentSelectedItemData: ItemData,
            mode: 'delete'
        });
        setOpenDeleteItemDialog(true);
    }

    function confirmDeleteItem() {
        destroy(`/dashboard/manage/users/${data.currentSelectedItemData.id}`, {
            onSuccess: () => {
                setData({
                    currentSelectedItemData: {}
                });
                setOpenDeleteItemDialog(false);
            }
        })
    }

    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                <SideMenuBar />
                <section className="relative p-4 md:ml-64 h-auto pt-20 bg-theme min-h-screen place-content-center">
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-2">
                        <span className="text-white text-lg font-bold">Diese Funktion befindet sich im Aufbau</span>
                    </div>
                    <RestaurantMenuNavTab />
                    <div className="relative overflow-x-auto rounded-md mt-4">
                        <div className="flex items-center justify-between rounded-tl-md rounded-tr-md bg-white dark:bg-gray-900 overflow-x-clip">
                            <div>
                                {
                                    Object.keys(errors).length > 0 ?
                                        <div className="space-y-1 overflow-y-scroll h-10 px-6 py-2">
                                            {Object.entries(errors).map(([field, message]) => (
                                                <p className="text-red-500 font-semibold" key={field + "password"}>
                                                    {message}
                                                </p>
                                            ))}
                                        </div>
                                        :
                                        <></>
                                }
                            </div>
                            <div className="relative translate-x-0.5 -translate-y-0.5">
                                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <label htmlFor="table-search" className="sr-only">Search</label>
                                <input type="text" id="table-search-users" className="h-10 rounded-tr-sm rounded-bl-sm p-2 ps-10 text-sm text-white w-80 bg-theme focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" placeholder="Search for users" />
                            </div>
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Code
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Preis
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.data.map((item, item_ind) => {
                                    return (
                                        <tr key={item_ind} className="bg-white hover:bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center">
                                                    <div className="text-gray-500">{item.code}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {item.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-normal text-gray-500">{item.price} &euro;</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button type="button" onClick={() => requestEditItem(item)} className="cursor-pointer p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className="fill-theme">
                                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                                                    </svg>
                                                </button>
                                                <button type="button" onClick={() => requestDeleteItem(item)} className="cursor-pointer p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="fill-theme-secondary">
                                                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="my-4 flex justify-between">
                        <button type="button" onClick={() => requestAddItem()} className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                            + Artikel
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className={(currentPage === 1) ? "fill-theme-secondary" : "fill-white"}>
                                    <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
                                </svg>
                            </button>

                            <span className="text-white">Page {currentPage} of {items.last_page}</span>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === items.last_page}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className={(currentPage === items.last_page) ? "fill-theme-secondary" : "fill-white"}>
                                    <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            <ItemDialog
                isOpen={isOpenItemDialog}
                setOpen={setOpenItemDialog}
                itemData={data.mode == "create" ? null : data.currentSelectedItemData}
                allCats={allCats}
                requestSubmitData={requestSubmitData}
                errors={errors}
                processing={processing}
            />
        </>
    )
}