import { router, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import SubCategoryTree from "./SubCatTree";
import CategoryWithItems from "./CatWithItems";
import OrderTable from "./OrderTable";

// Helper: recursively collect items from a category and all its children
const collectItemsGrouped = (category) => {
    if (!category) return [];

    // Start with this category
    let grouped = [];

    if ((category.items ?? []).length) {
        grouped.push({
            categoryName: category.name,
            items: category.items
        });
    }

    // Recursively add subcategories
    if (category.sub_categories?.length) {
        for (const sub of category.sub_categories) {
            grouped = [...grouped, ...collectItemsGrouped(sub)];
        }
    }

    return grouped;
};

const findCategoryByPath = (categories, path) => {
    let current = { sub_categories: categories };
    for (const id of path) {
        current = current.sub_categories?.find((c) => c.id === id);
        if (!current) break;
    }
    return current;
};

export default function OrderTab({ categories, tables, taxClasses, requestChangeTable, currentSelectedTableId }) {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [path, setPath] = useState([]); // array of category IDs
    const [visited, setVisited] = useState(null);

    const [currentOrders, setCurrentOrders] = useState({});
    const [storedOrders, setStoredOrders] = useState({});
    const { data, setData, post, processing, errors, reset } = useForm({
        tableId: currentSelectedTableId ?? tables[0].id,
        itemsList: [],
    });

    // Initialize storedOrders on component mount
    useEffect(() => {
        const initialStoredOrders = {};
        tables.forEach(table => {
            initialStoredOrders[table.id] = table.storedOrders || [];
        });
        setStoredOrders(initialStoredOrders);
        setCurrentOrders(initialStoredOrders);

        setData({
            "tableId": currentSelectedTableId ?? tables[0].id,
            "itemsList": initialStoredOrders[currentSelectedTableId ?? tables[0].id]
        })
    }, [tables, currentSelectedTableId]);

    // Items list is based on selected subcategory
    const itemsList = useMemo(() => {
        // Determine which category to collect items from:
        // 1. If a leaf was visited, use that
        // 2. Else, use the last node in the path
        // 3. Else, fallback to selectedCategory
        const currentNode = visited
            ?? (path.length > 0 ? findCategoryByPath([selectedCategory], path) : selectedCategory);

        if (!currentNode) return [];

        return collectItemsGrouped(currentNode);
    }, [path, selectedCategory, visited]);

    function orderItem(item) {
        if (!data.tableId) return; // no table selected

        setCurrentOrders(prevOrders => {
            const tableOrders = prevOrders[data.tableId] || [];

            // Check if item already exists in the table's orders
            const existingIndex = tableOrders.findIndex(i => i.id === item.id);

            let updatedTableOrders;
            if (existingIndex !== -1) {
                // Item exists: increase amount
                updatedTableOrders = tableOrders.map((i, index) =>
                    index === existingIndex
                        ? { ...i, amount: i.amount + 1 } // increment amount
                        : i
                );
            } else {
                // Item doesn't exist: add new with default fields
                const newItem = {
                    ...item,
                    amount: 1,
                    notice: '',
                    type: 'normal'
                };
                updatedTableOrders = [...tableOrders, newItem];
            }

            setData("itemsList", updatedTableOrders)

            return {
                ...prevOrders,
                [data.tableId]: updatedTableOrders
            };
        });

        return null;
    }

    function requestRemoveItemFromOrder(itemId) {
        if (!data.tableId) return; // no table selected

        setCurrentOrders(prevOrders => {
            const tableOrders = prevOrders[data.tableId] || [];

            // Filter out the item to remove
            const updatedTableOrders = tableOrders.filter(i => i.id !== itemId);

            // Update external state (itemsList)
            setData("itemsList", updatedTableOrders);

            return {
                ...prevOrders,
                [data.tableId]: updatedTableOrders
            };
        });

        return null;
    }

    function requestAddItemAmountFromOrder(itemId) {
        if (!data.tableId) return; // no table selected

        setCurrentOrders(prevOrders => {
            const tableOrders = prevOrders[data.tableId] || [];
            const existingIndex = tableOrders.findIndex(i => i.id === itemId);
            let updatedTableOrders;

            if (existingIndex !== -1) {
                // Item exists → increment
                updatedTableOrders = tableOrders.map((i, index) =>
                    index === existingIndex
                        ? { ...i, amount: i.amount + 1 }
                        : i
                );
            } else {
                // Item doesn’t exist → try to get it from storedOrders
                const storedItem =
                    (storedOrders[data.tableId] || []).find(i => i.id === itemId);

                if (!storedItem) {
                    return prevOrders;
                }

                const newItem = {
                    ...storedItem,
                    amount: 1,
                    notice: '',
                    type: 'normal'
                };
                updatedTableOrders = [...tableOrders, newItem];
            }

            setData("itemsList", updatedTableOrders);

            return {
                ...prevOrders,
                [data.tableId]: updatedTableOrders
            };
        });
    }

    function requestRemoveItemAmountFromOrder(itemId) {
        if (!data.tableId) return; // no table selected

        setCurrentOrders(prevOrders => {
            const tableOrders = prevOrders[data.tableId] || [];

            const existingIndex = tableOrders.findIndex(i => i.id === itemId);
            if (existingIndex === -1) return prevOrders; // nothing to remove

            let updatedTableOrders;

            if (tableOrders[existingIndex].amount > 1) {
                // decrement
                updatedTableOrders = tableOrders.map((i, index) =>
                    index === existingIndex
                        ? { ...i, amount: i.amount - 1 }
                        : i
                );
            } else {
                // remove completely
                updatedTableOrders = tableOrders.filter(i => i.id !== itemId);
            }

            setData("itemsList", updatedTableOrders);

            return {
                ...prevOrders,
                [data.tableId]: updatedTableOrders
            };
        });
    }

    function submitAddRogueItemToOrder(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        const price =
            (Number(payload.price_euro) || 0) + (Number(payload.price_cent) || 0) / 100;

        const transformPayload = {
            ...payload,
            price: price.toFixed(2), // new price in float with 2 decimals
            item_class: payload.item_class !== "null" ? payload.item_class : null,
            id: crypto.randomUUID()
        }

        if (!data.tableId) return; // no table selected

        setCurrentOrders(prevOrders => {
            const tableOrders = prevOrders[data.tableId] || [];

            // Check if item already exists in the table's orders
            const existingIndex = tableOrders.findIndex(i => i.id === transformPayload.id);

            let updatedTableOrders;
            if (existingIndex !== -1) {
                // Item exists: increase amount
                updatedTableOrders = tableOrders.map((i, index) =>
                    index === existingIndex
                        ? { ...i, amount: i.amount + 1 } // increment amount
                        : i
                );
            } else {
                // Item doesn't exist: add new with default fields
                const newItem = {
                    ...transformPayload,
                    amount: 1,
                    notice: '',
                    type: 'rogue'
                };
                updatedTableOrders = [...tableOrders, newItem];
            }

            setData("itemsList", updatedTableOrders)

            return {
                ...prevOrders,
                [data.tableId]: updatedTableOrders
            };
        });

        return null;
    }

    function requestResetChangeOrderItemList() {
        setCurrentOrders(prevOrders => {
            setData("itemsList", storedOrders[data.tableId]);
            return {
                ...prevOrders,
                [data.tableId]: storedOrders[data.tableId]
            };
        });
    }

    function requestSubmitOrderItemList() {
        post(`/ZGF0YV9lbmNvZGVkX2hlcmU/order`, {
            onSuccess: () => {
                router.reload({ only: ['tables'] })
            },
            onError: (e) => {
                console.log(e)
            }
        })
    }

    return (
        <>
            <div className="flex items-stretch justify-between">
                {/* Categories with items */}
                <div className="flex-1/2 bg-theme min-h-dvh flex flex-col">
                    {/* Search Bar */}
                    {/* <div className="p-2">Search</div> */}

                    {/* Top-level categories */}
                    <div className="flex gap-x-2 p-2 flex-nowrap overflow-x-auto overflow-y-hidden h-[10dvh]">
                        {categories.map((upper_cat, uc_ind) => (
                            <button
                                key={String(upper_cat.id) + uc_ind}
                                onClick={() => {
                                    setSelectedCategory(upper_cat);
                                    setPath([]);
                                    setVisited(null); // reset leaf selection
                                }}
                                className={`px-3 py-1.5 rounded-full ${selectedCategory?.id === upper_cat.id
                                    ? "bg-white text-theme-secondary hover:bg-gray-200 font-bold"
                                    : "bg-theme-secondary text-white hover:bg-theme-secondary-highlight"
                                    }`}
                            >
                                {upper_cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Main content: subcategories + items */}
                    <div className="flex flex-1 max-h-[90dvh]">
                        {/* Sidebar - subcategories */}
                        <div className="flex-1/4 p-1 max-h-[95%] overflow-y-auto">
                            {selectedCategory && (
                                <SubCategoryTree
                                    categories={selectedCategory.sub_categories}
                                    path={path}
                                    setPath={setPath}
                                    visited={visited?.id}
                                    onVisit={(leaf) => setVisited(leaf)}
                                />
                            )}
                        </div>

                        {/* Items list */}
                        <div className="flex-3/4 px-3 overflow-y-auto h-full">
                            {selectedCategory ? (
                                <CategoryWithItems itemsList={itemsList} orderItem={orderItem} />
                            ) : (
                                <div className="text-gray-600">Select a category to view items</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Table */}
                <div className="flex-1/2 min-h-dvh p-2">
                    <OrderTable
                        isLoading={processing}
                        taxClasses={taxClasses}

                        tables={tables}
                        currentSelectedTableId={data.tableId}
                        openChooseTable={requestChangeTable}

                        currentOrders={currentOrders}
                        storedOrders={storedOrders}

                        requestRemoveItemFromOrder={requestRemoveItemFromOrder}
                        requestAddItemAmountFromOrder={requestAddItemAmountFromOrder}
                        requestRemoveItemAmountFromOrder={requestRemoveItemAmountFromOrder}
                        requestResetChangeOrderItemList={requestResetChangeOrderItemList}
                        requestSubmitOrderItemList={requestSubmitOrderItemList}

                        submitAddRogueItemToOrder={submitAddRogueItemToOrder}
                    />
                </div>
            </div>
        </>
    )
}