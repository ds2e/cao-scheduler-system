import { useMemo } from "react";

export default function MainCheckoutTable({
    isLoading,

    tables,
    currentSelectedTableId,
    openChooseTable,

    itemsList,

    requestTransferItemAmountToSideCheckout,
    requestTransferItemToSideCheckout,
    requestCheckoutMainTable
}) {
    const table = tables.find(t => t.id === currentSelectedTableId);

    const sumItems = useMemo(() => {
        return itemsList.reduce((total, item) => {
            const amount = Number(item.amount) || 0;
            const price = Number(item.price) || 0;
            return total + amount * price;
        }, 0);
    }, [tables, currentSelectedTableId, itemsList]);

    return (
        <div className="flex flex-col gap-y-2 h-full justify-between">
            <button
                onClick={openChooseTable}
                className={`${table.storedOrders.length > 0 ? "bg-theme-secondary text-white" : "text-theme bg-gray-200"} font-bold p-2 text-center rounded-full border-2 border-theme`}
            >
                {table?.name || 'Select table'}
            </button>

            <div className="flex flex-col bg-black h-[80%] overflow-y-auto">
                {itemsList.map((co_item_main, co_item_main_ind) => {
                    return (
                        <div key={String(co_item_main.id) + co_item_main_ind + "order"}>
                            <div
                                className={`w-full flex justify-between bg-gray-900`}
                            >
                                <button
                                    onClick={() => requestTransferItemAmountToSideCheckout(co_item_main.id)}
                                    className="flex gap-x-2 items-center bg-gray-700 rounded-r-full px-4 py-2">
                                    {co_item_main.code && <span className="text-sm text-gray-200">{co_item_main.code}</span>}
                                    <span className="text-white">{co_item_main.name}</span>
                                </button>

                                <div className="flex gap-x-2">
                                    <div className="flex gap-x-2 items-center">
                                        <span className="text-sm text-white">{co_item_main.price}&euro;</span>
                                        <span
                                            className={`font-bold text-theme-secondary`}
                                        >
                                            x{co_item_main.amount}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => requestTransferItemToSideCheckout(co_item_main.id)}
                                        className="bg-green-500 p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={24} height={24} className="fill-white">
                                            <path d="M566.6 214.6L470.6 310.6C458.1 323.1 437.8 323.1 425.3 310.6C412.8 298.1 412.8 277.8 425.3 265.3L466.7 224L96 224C78.3 224 64 209.7 64 192C64 174.3 78.3 160 96 160L466.7 160L425.3 118.6C412.8 106.1 412.8 85.8 425.3 73.3C437.8 60.8 458.1 60.8 470.6 73.3L566.6 169.3C579.1 181.8 579.1 202.1 566.6 214.6zM169.3 566.6L73.3 470.6C60.8 458.1 60.8 437.8 73.3 425.3L169.3 329.3C181.8 316.8 202.1 316.8 214.6 329.3C227.1 341.8 227.1 362.1 214.6 374.6L173.3 416L544 416C561.7 416 576 430.3 576 448C576 465.7 561.7 480 544 480L173.3 480L214.7 521.4C227.2 533.9 227.2 554.2 214.7 566.7C202.2 579.2 181.9 579.2 169.4 566.7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-theme-secondary font-bold text-end">{sumItems.toFixed(2)}&euro;</p>

            <button
                disabled={isLoading || itemsList.length <= 0}
                onClick={() => requestCheckoutMainTable()}
                className={`${itemsList.length > 0 ? "bg-theme-secondary text-white" : "text-theme bg-gray-200"} p-2 text-center rounded-full`}
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
                        "Kasiert"
                }
            </button>
        </div>
    );
}