import { useMemo, useRef, useState } from "react";
import RogueItemDialog from "../../../../components/Dialog/RogueItemDialog";

export default function OrderTable({
    isLoading,
    taxClasses,

    tables,
    currentSelectedTableId,
    openChooseTable,

    currentOrders,
    storedOrders,

    requestRemoveItemFromOrder,
    requestAddItemAmountFromOrder,
    requestRemoveItemAmountFromOrder,
    requestResetChangeOrderItemList,
    requestSubmitOrderItemList,
    saveNoticeItem,

    submitAddRogueItemToOrder
}) {
    const [selectedItem, setSelectedItem] = useState(null);
    const noticeRef = useRef(null);
    const [isOpenRogueItemModal, setIsOpenRogueItemModal] = useState(false);

    const table = tables.find(t => t.id === currentSelectedTableId);

    // Union of stored + current orders
    const combinedOrders = (storedOrders[currentSelectedTableId] || []).map(so => {
        const currentItem = (currentOrders[currentSelectedTableId] || []).find(
            co => co.id === so.id
        );

        if (currentItem) {
            // if exists in both → take current version
            return currentItem;
        } else {
            // if exists only in stored → mark as removed
            return { ...so, _removed: true };
        }
    }).concat(
        // Add new items that don't exist in storedOrders
        (currentOrders[currentSelectedTableId] || []).filter(
            co => !(storedOrders[currentSelectedTableId] || []).some(so => so.id === co.id)
        )
    );

    const sumStored = useMemo(() => {
        const storedTableOrders = storedOrders?.[currentSelectedTableId] || [];
        return storedTableOrders.reduce((total, item) => {
            const amount = Number(item.amount) || 0;
            const price = Number(item.price) || 0;
            return total + amount * price;
        }, 0);
    }, [storedOrders, currentSelectedTableId]);

    const sumCurrent = useMemo(() => {
        const currentTableOrders = currentOrders?.[currentSelectedTableId] || [];
        return currentTableOrders.reduce((total, item) => {
            const amount = Number(item.amount) || 0;
            const price = Number(item.price) || 0;
            return total + amount * price;
        }, 0);
    }, [currentOrders, currentSelectedTableId]);

    function switchSelectedItem(item) {
        if (selectedItem && noticeRef.current) {
            noticeRef.current.value = item.notice ?? '';
        }

        if (selectedItem == null) {
            // Nothing selected → select this one
            setSelectedItem(item);
        } else if (selectedItem.id === item.id) {
            // Clicked the same again → unselect
            setSelectedItem(null);
        } else {
            // Clicked a different item → switch selection
            setSelectedItem(item);
        }
    }

    function submitOrderItemList() {
        setSelectedItem(null);
        requestSubmitOrderItemList();
    }

    function resetChangeOrderItemList() {
        setSelectedItem(null);
        requestResetChangeOrderItemList();
    }

    function requestAddRogueItem() {
        setIsOpenRogueItemModal(true);
    }

    function requestSubmitData(e) {
        setIsOpenRogueItemModal(false);
        submitAddRogueItemToOrder(e);
    }

    return (
        <>
            <div className="flex flex-col gap-y-2 h-full justify-between">
                <button
                    onClick={openChooseTable}
                    className={`${table?.storedOrders.length > 0 ? "bg-theme-secondary text-white" : "text-theme bg-gray-200"} font-bold p-2 text-center rounded-full border-2 border-theme`}
                >
                    {table?.name || 'Select table'}
                </button>

                <div className="flex flex-col bg-black h-[80%] overflow-y-auto">
                    {combinedOrders.map((o_item, o_item_ind) => {
                        const storedItem = (storedOrders[currentSelectedTableId] || []).find(
                            so => so.id === o_item.id
                        );

                        const isStored = !!storedItem;

                        // Amount difference
                        const oldAmount = storedItem ? storedItem.amount : 0;
                        const newAmount = o_item.amount;
                        const amountDiff = newAmount - oldAmount;

                        // Notice difference
                        const oldNotice = storedItem ? storedItem.notice || "" : "";
                        const newNotice = o_item.notice || "";
                        const noticeChanged = oldNotice !== newNotice;

                        let bgClass = '';
                        if (o_item._removed) {
                            bgClass = 'bg-red-900'; // removed
                        } else if (!storedItem) {
                            bgClass = 'bg-green-900'; // new
                        } else {
                            bgClass = 'bg-gray-900'; // existing
                        }

                        return (
                            <div key={String(o_item.id) + o_item_ind + "order"}>
                                <button
                                    onClick={() => switchSelectedItem(o_item)}
                                    className={`w-full py-2 px-4 flex justify-between ${bgClass}`}
                                >
                                    <div className="flex gap-x-2 items-center">
                                        {o_item.code && <span className="text-sm text-gray-200">{o_item.code}</span>}
                                        <span className="text-white text-start">{o_item.name}</span>
                                        {o_item.notice &&
                                            <div className="flex flex-col items-start">
                                                <span className="text-white text-sm italic text-start">{oldNotice}</span>
                                                {noticeChanged && <span className="text-theme-secondary text-sm text-start">{newNotice}</span>}
                                            </div>
                                        }
                                        {/* {noticeChanged && (
                                            <span className="text-xs text-theme-secondary italic">
                                                (Bemerkung geändert)
                                            </span>
                                        )}
                                        {newNotice && (
                                            <span className="text-white text-sm">[{newNotice}]</span>
                                        )} */}
                                    </div>

                                    <div className="flex gap-x-2 items-center">
                                        <span className="text-sm text-white">{o_item.price}&euro;</span>
                                        {/* If new item → show only xAmount */}
                                        {!storedItem ? (
                                            <span className="font-bold text-white">x{newAmount}</span>
                                        ) : (
                                            <>
                                                {/* Show old + diff */}
                                                <span className="font-bold text-white">x{oldAmount}</span>
                                                {amountDiff !== 0 && (
                                                    <span
                                                        className={`font-bold ${amountDiff > 0 ? 'text-green-400' : 'text-red-400'
                                                            } text-sm`}
                                                    >
                                                        {amountDiff > 0 ? `+${amountDiff}` : `${amountDiff}`}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </button>
                                {selectedItem && selectedItem.id === o_item.id &&
                                    <div className="flex w-full justify-between items-stretch">
                                        <div className="flex gap-x-2 items-center ms-2">
                                            <button
                                                onClick={() => requestRemoveItemFromOrder(o_item.id)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={28} height={28} className="fill-theme-secondary">
                                                    <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM231 231C240.4 221.6 255.6 221.6 264.9 231L319.9 286L374.9 231C384.3 221.6 399.5 221.6 408.8 231C418.1 240.4 418.2 255.6 408.8 264.9L353.8 319.9L408.8 374.9C418.2 384.3 418.2 399.5 408.8 408.8C399.4 418.1 384.2 418.2 374.9 408.8L319.9 353.8L264.9 408.8C255.5 418.2 240.3 418.2 231 408.8C221.7 399.4 221.6 384.2 231 374.9L286 319.9L231 264.9C221.6 255.5 221.6 240.3 231 231z" />
                                                </svg>
                                            </button>
                                            <input
                                                ref={noticeRef}
                                                defaultValue={o_item.notice}
                                                // value={itemNotices[o_item.id] || ""}
                                                // onChange={e =>
                                                //     setItemNotices(prev => ({
                                                //         ...prev,
                                                //         [o_item.id]: e.target.value
                                                //     }))
                                                // }
                                                placeholder="Bemerkung..." className="border-2 border-gray-500 text-white placeholder:text-gray-500 rounded p-1"
                                            />
                                            <button
                                                onClick={() => saveNoticeItem(o_item.id, noticeRef.current.value)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={28} height={28} className="fill-green-500">
                                                    <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center">
                                            <button
                                                onClick={() => requestAddItemAmountFromOrder(o_item.id)}
                                                className="bg-green-500 h-full px-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={24} height={24}>
                                                    <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => requestRemoveItemAmountFromOrder(o_item.id)}
                                                className="bg-red-500 h-full px-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={24} height={24}>
                                                    <path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-end gap-x-2">
                    {sumStored !== sumCurrent && <p className="text-sm text-theme-secondary font-semibold">{sumCurrent.toFixed(2)}&euro;</p>}
                    {storedOrders[currentSelectedTableId]?.length > 0 && <p className="font-bold">{sumStored.toFixed(2)}&euro;</p>}
                </div>

                <div className="flex gap-x-2">
                    <div className="flex items-center justify-center w-1/2">
                        <button
                            onClick={() => requestAddRogueItem()}
                            className="w-1/2 h-full p-1.5 text-center text-white bg-green-500 rounded-l-full"
                        >
                            + fremde Artikel
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={() => resetChangeOrderItemList()}
                            className="w-1/2 h-full p-1.5 text-center text-white bg-theme-secondary rounded-r-full flex items-center justify-center"
                        >
                            {
                                isLoading ?
                                    <div role="status">
                                        <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-theme-secondary-highlight" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={24} height={24} className="fill-white">
                                        <path d="M320 128C263.2 128 212.1 152.7 176.9 192L224 192C241.7 192 256 206.3 256 224C256 241.7 241.7 256 224 256L96 256C78.3 256 64 241.7 64 224L64 96C64 78.3 78.3 64 96 64C113.7 64 128 78.3 128 96L128 150.7C174.9 97.6 243.5 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C233 576 156.1 532.6 109.9 466.3C99.8 451.8 103.3 431.9 117.8 421.7C132.3 411.5 152.2 415.1 162.4 429.6C197.2 479.4 254.8 511.9 320 511.9C426 511.9 512 425.9 512 319.9C512 213.9 426 128 320 128z" />
                                    </svg>
                            }
                        </button>
                    </div>
                    <button
                        disabled={isLoading}
                        onClick={() => submitOrderItemList()}
                        className="p-1.5 text-center text-white bg-theme-secondary rounded-full w-1/2"
                    >
                        {
                            isLoading ?
                                <div role="status">
                                    <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-theme-secondary-highlight" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                :
                                "Abonnieren"
                        }
                    </button>
                </div>
            </div>
            <RogueItemDialog
                isOpen={isOpenRogueItemModal}
                setOpen={setIsOpenRogueItemModal}
                allItemClasses={taxClasses}
                requestSubmitData={requestSubmitData}
            // errors={undefined}
            // clearErrors={}
            // processing
            />
        </>
    );
}