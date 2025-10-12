const findCategoryByPath = (categories, path) => {
    let current = { sub_categories: categories };
    for (const id of path) {
        current = current.sub_categories?.find((c) => c.id === id);
        if (!current) break;
    }
    return current;
};

export default function SubCategoryTree({ categories, path, setPath, visited, onVisit }) {

    const current = findCategoryByPath(categories, path);
    const subs = current?.sub_categories ?? [];

    const handleClick = (sub) => {
        if (sub.sub_categories?.length > 0) {
            // traverse deeper
            setPath([...path, sub.id]);
        }
        onVisit?.(sub);
    };

    return (
        <div className="overflow-x-hidden">
            {/* Controls */}
            {path.length > 0 && (
                <div className="flex flex-col justify-between gap-y-2 mb-2">
                    <button
                        onClick={() => {
                            onVisit?.(null);
                            setPath([])
                        }}
                        className="bg-gray-900 text-white px-2 py-1 rounded"
                    >
                        Root
                    </button>
                    <button
                        onClick={() => {
                            if (path.length === 0) {
                                // Already at root
                                onVisit?.(null);
                                return;
                            }

                            const newPath = path.slice(0, -1);
                            setPath(newPath);

                            // Determine the new "current node" after going back
                            if (newPath.length === 0) {
                                onVisit?.(null); // back to root, no visited leaf
                            } else {
                                const parentNode = findCategoryByPath([selectedCategory], newPath);
                                onVisit?.(parentNode); // show items for the new "current" node
                            }
                        }}
                        className="bg-gray-900 text-white px-2 py-1 rounded"
                    >
                        Back
                    </button>
                </div>
            )}

            {/* Subcategories */}
            {subs.length > 0 ? (
                <div className="flex flex-col gap-y-2">
                    {subs.map((sub) => {
                        return (
                            <button
                                key={sub.id}
                                onClick={() => handleClick(sub)}
                                className={`${visited == sub.id ? "bg-white text-theme-secondary hover:bg-gray-200 active:bg-gray-200 font-semibold" : "bg-theme-secondary text-white hover:bg-theme-secondary-highlight active:bg-theme-secondary-highlight"} w-full text-left p-1.5 rounded`}
                            >
                                {sub.name}
                            </button>
                        )
                    })}
                </div>
            ) : (
                <div className="text-gray-700">No subcategories here</div>
            )}
        </div>
    );
};