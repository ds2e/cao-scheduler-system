import { useEffect, useMemo, useState } from "react";

import { router, useForm } from "@inertiajs/react";
import MainCheckoutTable from "./MainCheckoutTable";
import SideCheckoutTable from "./SideCheckoutTable";
import CheckoutModal from "../../../../components/Dialog/CheckoutModal";
import ConfirmCheckoutModal from "../../../../components/Dialog/ConfirmCheckoutModal";

export default function PaymentTab({ taxClasses, tables, requestChangeTable, currentSelectedTableId }) {
    const [isOpenCheckoutModal, setIsOpenCheckoutModal] = useState(false);

    const [mainTableItemsList, setMainTableItemsList] = useState(currentSelectedTableId ? tables.find((t) => t.id == currentSelectedTableId).storedOrders : tables[0].storedOrders);
    const [sideTableItemList, setSideTableItemList] = useState([]);

    const [isOpenConfirmCheckoutModal, setIsOpenConfirmCheckoutModal] = useState(false);
    const [saveCurrentBill, setSaveCurrentBill] = useState(false);

    const { data, setData, post, delete: destroy, processing, errors, reset, transform, put } = useForm({
        tableId: currentSelectedTableId ?? tables[0].id,
        orderId: currentSelectedTableId ? tables.find((t) => t.id == currentSelectedTableId).order_id : tables[0].order_id,
        itemsList: currentSelectedTableId ? tables.find((t) => t.id == currentSelectedTableId).storedOrders : tables[0].storedOrders,
    });

    // Initialize storedOrders on component mount
    useEffect(() => {
        setMainTableItemsList(currentSelectedTableId ? tables.find((t) => t.id == currentSelectedTableId).storedOrders : tables[0].storedOrders);
        setSideTableItemList([]);
        setData({
            "tableId": currentSelectedTableId ?? tables[0].id,
            "orderId": currentSelectedTableId ? tables.find((t) => t.id == currentSelectedTableId).order_id : tables[0].order_id,
            "itemsList": currentSelectedTableId ? tables.find((t) => t.id == currentSelectedTableId).storedOrders : tables[0].storedOrders
        });

        return () => {
            setMainTableItemsList(currentSelectedTableId ? tables.find((t) => t.id == currentSelectedTableId).storedOrders : tables[0].storedOrders);
            setSideTableItemList([]);
            setData({
                tableId: -1,
                orderId: -1,
                itemsList: [],
            })
        }
    }, [tables, currentSelectedTableId]);

    function requestTransferItemAmountToSideCheckout(itemId) {
        setMainTableItemsList(prevMain => {
            const updatedMain = prevMain.map(item => ({ ...item })); // clone all to prevent mutation
            const itemIndex = updatedMain.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return prevMain;

            const item = updatedMain[itemIndex];
            const updatedItem = { ...item, amount: item.amount - 1 }; // safe copy

            // reduce from main
            if (updatedItem.amount <= 0) {
                updatedMain.splice(itemIndex, 1);
            } else {
                updatedMain[itemIndex] = updatedItem;
            }

            // update side list
            setSideTableItemList(prevSide => {
                const updatedSide = prevSide.map(i => ({ ...i })); // clone to avoid shared refs
                const sideIndex = updatedSide.findIndex(i => i.id === itemId);

                if (sideIndex !== -1) {
                    updatedSide[sideIndex].amount += 1;
                } else {
                    updatedSide.push({ ...item, amount: 1 });
                }

                return updatedSide;
            });

            return updatedMain;
        });
    }

    function requestTransferItemAmountToMainCheckout(itemId) {
        setSideTableItemList(prevSide => {
            const updatedSide = [...prevSide];
            const itemIndex = updatedSide.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return prevSide;

            const item = updatedSide[itemIndex];
            // reduce from main
            item.amount -= 1;
            if (item.amount <= 0) updatedSide.splice(itemIndex, 1);

            // update side list
            setMainTableItemsList(prevMain => {
                const updatedMain = [...prevMain];
                const mainIndex = updatedMain.findIndex(i => i.id === itemId);
                if (mainIndex !== -1) {
                    updatedMain[mainIndex].amount += 1;
                } else {
                    updatedMain.push({ ...item, amount: 1 });
                }
                return updatedMain;
            });

            return updatedSide;
        });
    }

    function requestTransferItemToSideCheckout(itemId) {
        setMainTableItemsList(prevMain => {
            const updatedMain = [...prevMain];
            const itemIndex = updatedMain.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return prevMain; // item not found

            const [item] = updatedMain.splice(itemIndex, 1); // remove from main

            // merge into side
            setSideTableItemList(prevSide => {
                const updatedSide = [...prevSide];
                const sideIndex = updatedSide.findIndex(i => i.id === itemId);
                if (sideIndex !== -1) {
                    updatedSide[sideIndex].amount += item.amount;
                } else {
                    updatedSide.push(item);
                }
                return updatedSide;
            });

            return updatedMain;
        });
    }

    function requestTransferItemToMainCheckout(itemId) {
        setSideTableItemList(prevSide => {
            const updatedSide = [...prevSide];
            const itemIndex = updatedSide.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return prevSide; // item not found

            const [item] = updatedSide.splice(itemIndex, 1); // remove from main

            // merge into side
            setMainTableItemsList(prevMain => {
                const updatedMain = [...prevMain];
                const mainIndex = updatedMain.findIndex(i => i.id === itemId);
                if (mainIndex !== -1) {
                    updatedMain[mainIndex].amount += item.amount;
                } else {
                    updatedMain.push(item);
                }
                return updatedMain;
            });

            return updatedSide;
        });
    }

    function requestCheckoutMainTable() {
        setData({
            ...data,
            "itemsList": mainTableItemsList
        });
        setIsOpenCheckoutModal(true);
    }

    function requestCheckoutSideTable() {
        setData({
            ...data,
            "itemsList": sideTableItemList
        });
        setIsOpenCheckoutModal(true);
    }

    function onDiscardBill() {
        setSaveCurrentBill(false);
        setIsOpenConfirmCheckoutModal(true);
    }

    function onSaveBill() {
        setSaveCurrentBill(true);
        setIsOpenConfirmCheckoutModal(true);
    }

    function onConfirmAction() {
        setIsOpenConfirmCheckoutModal(false);
        setIsOpenCheckoutModal(false);
        if (saveCurrentBill) {
            // Perform saving current bill
            post(`/ZGF0YV9lbmNvZGVkX2hlcmU/payment`, {
                onSuccess: () => {
                    router.reload({ only: ['tables'] });
                },
            })
        }
        else {
            // else discard current bill
            put(`/ZGF0YV9lbmNvZGVkX2hlcmU/payment/${data.orderId}`, {
                onSuccess: () => {
                    router.reload({ only: ['tables'] })
                },
            })
        }
    }

    return (
        <>
            <div className="flex items-stretch justify-between bg-theme min-h-dvh max-h-dvh pb-14">
                <div className="flex-1/2 p-2">
                    {/* Main Table Checkout */}
                    <MainCheckoutTable
                        tables={tables}
                        currentSelectedTableId={data.tableId}
                        openChooseTable={requestChangeTable}
                        isLoading={processing}
                        itemsList={mainTableItemsList}
                        requestTransferItemAmountToSideCheckout={requestTransferItemAmountToSideCheckout}
                        requestTransferItemToSideCheckout={requestTransferItemToSideCheckout}
                        requestCheckoutMainTable={requestCheckoutMainTable}
                    />
                </div>

                <div className="flex-1/2 p-2">
                    {/* Side Table Checkout */}
                    <SideCheckoutTable
                        isLoading={processing}
                        itemsList={sideTableItemList}
                        requestTransferItemAmountToMainCheckout={requestTransferItemAmountToMainCheckout}
                        requestTransferItemToMainCheckout={requestTransferItemToMainCheckout}
                        requestCheckoutSideTable={requestCheckoutSideTable}
                    />
                </div>
            </div>
            <CheckoutModal
                isOpen={isOpenCheckoutModal}
                itemsList={data.itemsList}
                setOpen={setIsOpenCheckoutModal}
                taxClasses={taxClasses}
                tableName={tables.find((t) => t.id === data.tableId)?.name}
                isPending={processing}
                onSaveBill={onSaveBill}
                onDiscardBill={onDiscardBill}
            />
            <ConfirmCheckoutModal
                isOpen={isOpenConfirmCheckoutModal}
                setOpen={setIsOpenConfirmCheckoutModal}
                onConfirmAction={onConfirmAction}
                saveCurrentBill={saveCurrentBill}
            />
        </>
    );
};