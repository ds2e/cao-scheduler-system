import WaiterLayout from "@/Layouts/WaiterLayout";
import { router } from "@inertiajs/react";
import HistoryBills from "./HistoryBills";
import { useState } from "react";
import GenericConfirmationDialog from "../../../../components/Dialog/GenericConfirmationDialog";

function extractAllBillsFromTables(tables) {
    const allBills = [];

    tables.forEach(table => {
        table.orders.forEach(order => {
            order.bills.forEach(bill => {
                // Flatten bill items (merge `item` fields directly)
                const flatBillItems = bill.bill_items.map(bi => ({
                    ...bi,
                    name: bi.item?.name,
                    price: bi.item?.price,
                    code: bi.item?.code,
                    item_class: bi.item?.item_class,
                    category_id: bi.item?.category_id,
                    item: undefined,
                }));

                allBills.push({
                    ...bill,
                    name: table.name,
                    table_id: table.id,
                    order_id: order.id,
                    bill_items: flatBillItems,
                });
            });
        });
    });

    // Sort newest first (same as backend would do)
    return allBills.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

const HistoryTab = ({ tables, taxClasses }) => {
    const bills = extractAllBillsFromTables(tables);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    function requestSwitchTab() {
        router.visit("/ZGF0YV9lbmNvZGVkX2hlcmU");
    }

    function requestCleanHistory() {
        if (bills.length <= 0) {
            return;
        }
        setIsOpenConfirmationDialog(true);
    }

    function confirmDeleteHistory() {
        setIsOpenConfirmationDialog(false);
        router.delete(`/ZGF0YV9lbmNvZGVkX2hlcmU/history`, {
            onStart: () => {
                setIsLoading(true)
            },
            onSuccess: () => {
                router.reload({ only: ['tables'] })
            },
            onFinish: () => {
                setIsLoading(false);
            },
        })
    }

    return (
        <>
            {
                isLoading &&
                <div className="fixed inset-0 bg-black/50 grid place-content-center">
                    <h1 className="text-white text-center text-2xl font-semibold">Laden...</h1>
                </div>
            }
            <HistoryBills bills={bills} taxClasses={taxClasses} />
            <div className="fixed bottom-0 left-0 flex gap-x-2 p-2 bg-theme">
                <button
                    disabled={isLoading}
                    onClick={() => requestSwitchTab()}
                    className="bg-white hover:bg-gray-100 p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={20} height={20}>
                        <path d="M280 128C266.7 128 256 138.7 256 152C256 165.3 266.7 176 280 176L296 176L296 209.3C188.8 220.7 104.2 307.7 96.6 416L543.5 416C535.8 307.7 451.2 220.7 344 209.3L344 176L360 176C373.3 176 384 165.3 384 152C384 138.7 373.3 128 360 128L280 128zM88 464C74.7 464 64 474.7 64 488C64 501.3 74.7 512 88 512L552 512C565.3 512 576 501.3 576 488C576 474.7 565.3 464 552 464L88 464z" />
                    </svg>
                </button>
                <div
                    className="bg-theme-secondary hover:bg-theme-secondary-highlight p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={20} height={20}>
                        <path d="M142 66.2C150.5 62.3 160.5 63.7 167.6 69.8L208 104.4L248.4 69.8C257.4 62.1 270.7 62.1 279.6 69.8L320 104.4L360.4 69.8C369.4 62.1 382.6 62.1 391.6 69.8L432 104.4L472.4 69.8C479.5 63.7 489.5 62.3 498 66.2C506.5 70.1 512 78.6 512 88L512 552C512 561.4 506.5 569.9 498 573.8C489.5 577.7 479.5 576.3 472.4 570.2L432 535.6L391.6 570.2C382.6 577.9 369.4 577.9 360.4 570.2L320 535.6L279.6 570.2C270.6 577.9 257.3 577.9 248.4 570.2L208 535.6L167.6 570.2C160.5 576.3 150.5 577.7 142 573.8C133.5 569.9 128 561.4 128 552L128 88C128 78.6 133.5 70.1 142 66.2zM232 200C218.7 200 208 210.7 208 224C208 237.3 218.7 248 232 248L408 248C421.3 248 432 237.3 432 224C432 210.7 421.3 200 408 200L232 200zM208 416C208 429.3 218.7 440 232 440L408 440C421.3 440 432 429.3 432 416C432 402.7 421.3 392 408 392L232 392C218.7 392 208 402.7 208 416zM232 296C218.7 296 208 306.7 208 320C208 333.3 218.7 344 232 344L408 344C421.3 344 432 333.3 432 320C432 306.7 421.3 296 408 296L232 296z" />
                    </svg>
                </div>
                <button
                    disabled={isLoading}
                    onClick={() => requestCleanHistory()}
                    className="bg-white hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-theme-secondary"
                >
                    {
                        isLoading ?
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-theme-secondary-highlight" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                            :
                            "Aufräumen"
                    }
                </button>
            </div>
            <GenericConfirmationDialog
                isOpen={isOpenConfirmationDialog}
                setOpen={setIsOpenConfirmationDialog}
                confirmAction={confirmDeleteHistory}
            />
        </>
    )
}

HistoryTab.layout = page => <WaiterLayout children={page} />

export default HistoryTab;