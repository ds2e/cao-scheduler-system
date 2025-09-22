import { Link, useForm, router } from "@inertiajs/react";
import RestaurantMenuNavTab from "@/components/Navbar/RestaurantMenuNavTab";
import SideMenuBar from "@/components/Navbar/SideMenuBar";
import { useState } from "react";
import TableDialog from "@/components/Dialog/TableDialog";
import GenericDeletionDialog from "../../components/Dialog/GenericDeletionConfirmationDialog";

export default function TablesTab({ tables }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, clearErrors, reset, transform } = useForm({
        currentSelectedTableData: {},
        mode: ''
    });

    const [isOpenDeleteTableDialog, setOpenDeleteTableDialog] = useState(false);
    const [isOpenTableDialog, setOpenTableDialog] = useState(false);

    function requestEditTable(table) {
        setData({
            currentSelectedTableData: table,
            mode: 'update'
        });
        setOpenTableDialog(true);
    }

    function requestAddTable() {
        setData({
            mode: 'create'
        });
        setOpenTableDialog(true);
    }

    function requestSubmitData(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());
        clearErrors();

        // Data validation frontend
        if (payload.name == "" || payload.name.trim() == "") {
            setError("name", "erforderliches Feld ist nicht ausgefüllt.");
            return;
        }

        const updatedData = {
            ...data.currentSelectedTableData,
            ...payload
        };

        transform((data) => ({
            ...data,
            currentSelectedTableData: updatedData,
        }));

        if (data.mode == "create") {
            post(`/dashboard/manage/menu/tables`, {
                onSuccess: () => {
                    clearErrors();
                    reset();
                    setOpenTableDialog(false);
                }
            })
        } else if (data.mode == "update") {
            patch(`/dashboard/manage/menu/tables/${data.currentSelectedTableData.id}`, {
                onSuccess: () => {
                    clearErrors();
                    reset();
                    setOpenTableDialog(false);
                }
            });
        }
    }

    function requestDeleteTable(table) {
        setData({
            currentSelectedTableData: table,
            mode: 'delete'
        });
        setOpenDeleteTableDialog(true);
    }

    function confirmDeleteTable() {
        destroy(`/dashboard/manage/menu/tables/${data.currentSelectedTableData.id}`, {
            onSuccess: () => {
                reset();
                setOpenDeleteTableDialog(false);
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
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tables.map((table, item_ind) => {
                                    return (
                                        <tr key={item_ind} className="bg-white hover:bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600">
                                            <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center">
                                                    <div className="text-gray-500">{table.name}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {table.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button type="button" onClick={() => requestEditTable(table)} className="cursor-pointer p-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className="fill-theme">
                                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                                                    </svg>
                                                </button>
                                                <button type="button" onClick={() => requestDeleteTable(table)} className="cursor-pointer p-2">
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
                        <button type="button" onClick={() => requestAddTable()} className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                            + Tisch
                        </button>
                    </div>
                </section>
            </div>
            <TableDialog
                isOpen={isOpenTableDialog}
                setOpen={setOpenTableDialog}
                tableData={data.mode == "create" ? null : data.currentSelectedTableData}
                requestSubmitData={requestSubmitData}
                errors={errors}
                clearErrors={clearErrors}
                processing={processing}
            />
            <GenericDeletionDialog isOpen={isOpenDeleteTableDialog} setOpen={setOpenDeleteTableDialog} confirmDelete={confirmDeleteTable}/>
        </>
    )
}