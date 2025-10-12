export default function CategoryWithItems({ itemsList, orderItem }) {

    return (
        <>
            {/* Items */}
            {itemsList.map((group) => (
                <div key={group.categoryName} className="mb-2">
                    <h3 className="text-lg text-white font-semibold mb-2">{group.categoryName}</h3>
                    <div className="flex flex-col gap-y-2">
                        {group.items.map((item) => (
                            <button
                                onClick={() => orderItem(item)}
                                key={item.id}
                                className="bg-white shadow rounded p-2 flex justify-between items-center"
                            >
                                <div className="flex gap-x-2 items-center justify-between">
                                    <span className="text-sm">{item.code}</span>
                                    <span className="font-medium text-start">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-theme-secondary">${item.price}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};