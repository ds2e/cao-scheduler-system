import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import GenericDeletionConfirmationDialog from "@/components/Dialog/GenericDeletionConfirmationDialog";
import dayjs from "dayjs";
import CheckoutModal from "@/components/Dialog/CheckoutModal";

export default function HistoryBills({ bills, taxClasses }) {

    const { data, setData, patch, delete: destroy, processing, errors, transform } = useForm({
        currentSelectedBillData: {},
    });

    const [isOpenDeleteBillDialog, setOpenDeleteBillDialog] = useState(false);
    const [isOpenBillView, setIsOpenBillView] = useState(false);

    function requestDeleteBill() {
        setOpenDeleteBillDialog(true);
    }

    function confirmDeleteBill() {
        destroy(`/ZGF0YV9lbmNvZGVkX2hlcmU/payment/${data.currentSelectedBillData.id}`, {
            onSuccess: () => {
                setData({
                    ...data,
                    currentSelectedBillData: {}
                });
                setOpenDeleteBillDialog(false);
                setIsOpenBillView(false);
                router.reload({ only: ['tables'] })
            }
        })
    }

    function viewHistoryBill(billId) {
        const selectedBill = bills.find(b => b.id === billId);
        if (!selectedBill) return;

        setData({
            ...data,
            currentSelectedBillData: selectedBill,
        });

        setIsOpenBillView(true);
    }

    if(processing){
        return (
            <section className="antialiased p-4 h-auto pt-20 bg-theme min-h-screen place-content-center pb-12">
                <h1 className="animate-pulse text-center text-2xl font-bold text-theme-secondary">Laden...</h1>
            </section>
        )
    }

    return (
        <>
            <section className="antialiased p-4 h-auto pt-20 bg-theme min-h-screen place-content-center pb-12">
                {
                    bills.length > 0 ?
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {
                                bills.map((bill, bill_ind) => {
                                    return (
                                        <button
                                            onClick={() => viewHistoryBill(bill.id)}
                                            key={bill_ind} className="p-2 bg-white hover:bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600 rounded-md">
                                            <p className="text-gray-500 text-center">{dayjs(bill.created_at).format('HH:mm DD/MM/YYYY')}</p>
                                        </button>
                                    )
                                })
                            }
                        </div>
                        :
                        <h2 className="text-white font-bold text-2xl text-center">
                            Keine Rechnung im Moment.
                        </h2>
                }
            </section>
            <GenericDeletionConfirmationDialog
                isOpen={isOpenDeleteBillDialog}
                setOpen={setOpenDeleteBillDialog}
                confirmDelete={confirmDeleteBill}
            />
            <CheckoutModal
                isOpen={isOpenBillView}
                setOpen={setIsOpenBillView}
                itemsList={data.currentSelectedBillData.bill_items ?? []}
                taxClasses={taxClasses}
                tableName={undefined}
                isPending={undefined}
                onSaveBill={() => setIsOpenBillView(false)}
                onDiscardBill={requestDeleteBill}
            />
        </>
    )
}