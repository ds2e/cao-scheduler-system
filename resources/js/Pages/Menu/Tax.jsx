import { Link, useForm, router, usePage } from "@inertiajs/react";
import RestaurantMenuNavTab from "@/components/Navbar/RestaurantMenuNavTab";
import SideMenuBar from "@/components/Navbar/SideMenuBar";
import { useState } from "react";
import ItemDialog from "@/components/Dialog/ItemDialog";
import GenericDeletionDialog from "@/components/Dialog/GenericDeletionConfirmationDialog";
import ItemClassDialog from "@/components/Dialog/ItemClassDialog";

export default function ItemTaxClassTab({ itemClasses }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, transform, setError, clearErrors, reset } = useForm({
        currentSelectedTaxClassData: {}
    });

    const [isOpenDeleteTaxClassDialog, setOpenDeleteTaxClassDialog] = useState(false);
    const [isOpenItemDialog, setOpenItemDialog] = useState(false);

    function requestDoneEditTaxClass() {
        const taxClassData = data.currentSelectedTaxClassData;
        const value = parseFloat(taxClassData.rate);

        if (
            taxClassData.rate !== "" && // allow empty if nullable
            (isNaN(value) || value < 0 || value > 100)
        ) {
            setError("rate", "Steuersatz muss eine Zahl zwischen 0 und 100 sein.");
            return;
        }

        if (taxClassData.name == "" || taxClassData.name.trim() == "") {
            setError("name", "Name ist ein erforderliches Feld");
            return;
        }

        patch(`/dashboard/manage/menu/items/tax/${data.currentSelectedTaxClassData.id}`, {
            onSuccess: () => {
                setData({
                    ...data,
                    currentSelectedTaxClassData: {}
                })
            }
        });
    }

    function requestAddItem() {
        setOpenItemDialog(true);
    }

    function toggleEditTaxClass(taxClass) {
        if (Object.keys(data.currentSelectedTaxClassData).length == 0 || data.currentSelectedTaxClassData.id !== taxClass.id) {
            setData({
                ...data,
                currentSelectedTaxClassData: taxClass
            });
        } else {
            setData({
                ...data,
                currentSelectedTaxClassData: {}
            });
        }
    }

    // function requestDeleteTaxClass(taxClass) {
    //     setData({
    //         currentSelectedTaxClassData: taxClass
    //     });
    //     setOpenDeleteItemDialog(true);
    // }

    function confirmDeleteTaxClass() {
        destroy(`/dashboard/manage/menu/items/tax/${data.currentSelectedTaxClassData.id}`, {
            onSuccess: () => {
                setData({
                    ...data,
                    currentSelectedTaxClassData: {}
                })
                setOpenDeleteTaxClassDialog(false);
            }
        })
    }

    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                <SideMenuBar />
                <section className="relative p-4 md:ml-64 h-auto pt-20 bg-theme min-h-screen place-content-center">
                    {/* <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-2">
                        <span className="text-white text-lg font-bold">Diese Funktion befindet sich im Aufbau</span>
                    </div> */}
                    <RestaurantMenuNavTab />
                    <div className="relative overflow-x-auto rounded-md">
                        <div className="flex items-center justify-between rounded-tl-md rounded-tr-md bg-white dark:bg-gray-900 overflow-x-clip">
                            <div>
                                {
                                    Object.keys(errors).length > 0 ?
                                        <div className="space-y-1 overflow-y-scroll h-10 px-6 py-2">
                                            {Object.entries(errors).map(([field, message]) => (
                                                <p className="text-red-500 font-semibold" key={field}>
                                                    {message}
                                                </p>
                                            ))}
                                        </div>
                                        :
                                        <></>
                                }
                            </div>
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Steuersatz (Prozent)
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemClasses.map((itemClass, itemClass_ind) => {
                                    return (
                                        <tr key={itemClass_ind} className={`${data.currentSelectedTaxClassData.id == itemClass.id ? "bg-red-100" : "bg-white hover:bg-gray-50"} border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600`}>
                                            <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center">
                                                    {
                                                        (Object.keys(data.currentSelectedTaxClassData).length > 0 && data.currentSelectedTaxClassData.id == itemClass.id) ?
                                                            <input
                                                                value={data.currentSelectedTaxClassData.name}
                                                                required
                                                                onChange={(e) => {
                                                                    const updatedCurrentSelectedTaxClassData = { ...data.currentSelectedTaxClassData };
                                                                    updatedCurrentSelectedTaxClassData.name = e.target.value;
                                                                    setData({
                                                                        ...data,
                                                                        currentSelectedTaxClassData: updatedCurrentSelectedTaxClassData
                                                                    })
                                                                }}
                                                                autoFocus
                                                                className="p-2 border-[1px] border-theme"
                                                            />
                                                            :
                                                            <div className="text-gray-500">{itemClass.name}</div>
                                                    }

                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                {
                                                    (Object.keys(data.currentSelectedTaxClassData).length > 0 && data.currentSelectedTaxClassData.id == itemClass.id) ?
                                                        <input
                                                            value={data.currentSelectedTaxClassData.rate ?? ""}
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            required
                                                            onKeyDown={(e) => {
                                                                if (["e", "E", "+", "-"].includes(e.key)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                const updatedCurrentSelectedTaxClassData = { ...data.currentSelectedTaxClassData };
                                                                updatedCurrentSelectedTaxClassData.rate = e.target.value;
                                                                setData({
                                                                    ...data,
                                                                    currentSelectedTaxClassData: updatedCurrentSelectedTaxClassData
                                                                })
                                                            }}
                                                            className="p-2 border-[1px] border-theme"
                                                        />
                                                        :
                                                        <div className="flex items-center">
                                                            {itemClass.rate ? itemClass.rate+"%": ""}
                                                        </div>
                                                }

                                            </td>
                                            <td className="px-6 py-4">
                                                <button type="button" onClick={() => toggleEditTaxClass(itemClass)} className="cursor-pointer p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className={(data.currentSelectedTaxClassData.id == itemClass.id) ? "fill-theme-secondary-highlight" : "fill-theme"}>
                                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                                                    </svg>
                                                </button>
                                                {
                                                    (Object.keys(data.currentSelectedTaxClassData).length > 0 && data.currentSelectedTaxClassData.id == itemClass.id)
                                                    &&
                                                    <>
                                                        <button type="button" onClick={() => setOpenDeleteTaxClassDialog(true)} className="cursor-pointer p-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="fill-theme-secondary">
                                                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                                            </svg>
                                                        </button>
                                                        {
                                                            processing ?
                                                                <div role="status" className="inline-block ps-2">
                                                                    <svg className="fill-muted animate-spin" width={20} height={20} viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                    </svg>
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                                :
                                                                <button type="button" onClick={() => requestDoneEditTaxClass()} className="cursor-pointer p-2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="fill-theme">
                                                                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                                    </svg>
                                                                </button>
                                                        }
                                                    </>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="my-4 flex justify-between">
                        <button type="button" onClick={() => requestAddItem()} className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                            + Eintrag
                        </button>
                    </div>
                </section>
            </div>
            <ItemClassDialog isOpen={isOpenItemDialog} setOpen={setOpenItemDialog}/>
            <GenericDeletionDialog isOpen={isOpenDeleteTaxClassDialog} setOpen={setOpenDeleteTaxClassDialog} confirmDelete={confirmDeleteTaxClass} />
        </>
    )
}