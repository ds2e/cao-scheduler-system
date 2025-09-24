import { useForm, router } from "@inertiajs/react";
import RestaurantMenuNavTab from "../../components/Navbar/RestaurantMenuNavTab";
import SideMenuBar from "../../components/Navbar/SideMenuBar";
import { useMemo, useState } from "react";
import CategoryDialog from "../../components/Dialog/CategoryDialog";
import GenericDeletionDialog from "../../components/Dialog/GenericDeletionConfirmationDialog";

export default function CategoriesTab({ allCats }) {
    const { data, setData, post, patch, delete: destroy, processing, errors, transform, setError, clearErrors, reset } = useForm({
        currentSelectedCategoryData: {},
        mode: ''
    });

    const categoriesByParent = useMemo(() => {
        const map = {};
        allCats.forEach((cat) => {
            const parent = cat.sub_category_from || null;
            if (!map[parent]) map[parent] = [];
            map[parent].push(cat);
        });
        return map;
    }, [allCats]);

    // Current navigation path (breadcrumb style)
    const [path, setPath] = useState([]);

    // Current level of categories depends on path
    const currentParent = path.length > 0 ? path[path.length - 1].id : null;
    const currentLevel = categoriesByParent[currentParent] || [];

    function goInto(cat) {
        if (categoriesByParent[cat.id]?.length > 0) {
            setPath([...path, cat]);
        }
    }

    function goUp() {
        if (path.length > 0) {
            setPath(path.slice(0, -1));
        }
    }

    function goRoot() {
        setPath([]);
    }

    const [isOpenDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false);
    const [isOpenCategoryDialog, setOpenCategoryDialog] = useState(false);

    function requestEditCategory(category) {
        setData({
            currentSelectedCategoryData: category,
            mode: 'update'
        });
        setOpenCategoryDialog(true);
    }

    function requestAddCategory() {
        setData({
            mode: 'create'
        });
        setOpenCategoryDialog(true);
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
            ...data.currentSelectedCategoryData,
            ...payload,
            sub_category_from: payload.sub_category_from !== "null" ? payload.sub_category_from : null
        };

        transform((data) => ({
            ...data,
            currentSelectedCategoryData: updatedData,
        }));

        if (data.mode == "create") {
            post(`/dashboard/manage/menu/categories`, {
                onSuccess: () => {
                    clearErrors();
                    reset();
                    setOpenCategoryDialog(false);
                }
            })
        } else if (data.mode == "update") {
            patch(`/dashboard/manage/menu/categories/${data.currentSelectedCategoryData.id}`, {
                onSuccess: () => {
                    clearErrors();
                    reset();
                    setOpenCategoryDialog(false);
                }
            });
        }
    }

    function requestDeleteCategory(cat) {
        setData({
            currentSelectedCategoryData: cat,
            mode: 'delete'
        });
        setOpenDeleteCategoryDialog(true);
    }

    function confirmDeleteCategory() {
        destroy(`/dashboard/manage/menu/categories/${data.currentSelectedCategoryData.id}`, {
            onSuccess: () => {
                reset();
                setOpenDeleteCategoryDialog(false);
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
                    <div className="relative overflow-x-auto">
                        <div className="space-y-6">
                            {/* Breadcrumb Navigation */}
                            <div className="flex items-center space-x-2">
                                {path.length > 0 && (
                                    <>
                                        <button
                                            onClick={goRoot}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            {"<<"}
                                        </button>
                                        <button
                                            onClick={goUp}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            {"<"}
                                        </button>
                                    </>
                                )}
                                {path.map((cat, i) => (
                                    <span key={i} className="text-sm text-white">
                                        {'›'} {cat.name}
                                    </span>
                                ))}
                            </div>

                            {/* Current Categories Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...currentLevel]
                                    .sort((a, b) => {
                                        // if both are null → sort by name
                                        if (a.priority == b.priority) {
                                            return a.name.localeCompare(b.name);
                                        }

                                        // if only a is null → a goes last
                                        if (a.priority === null) return 1;

                                        // if only b is null → b goes last
                                        if (b.priority === null) return -1;

                                        return a.priority - b.priority;
                                    }).map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="border border-theme-highlight rounded-lg bg-white flex flex-col items-stretch justify-between gap-y-4"
                                        >
                                            <div
                                                onClick={() => goInto(cat)}
                                                className="cursor-pointer p-4 shadow-xs shadow-black hover:bg-gray-200 rounded-lg">
                                                <div className="font-semibold text-center">{cat.name}</div>
                                                {categoriesByParent[cat.id]?.length > 0 && (
                                                    <div className="text-xs text-gray-500 mt-2 text-center">{categoriesByParent[cat.id].length} Unterkategorie(n)</div>
                                                )}
                                            </div>
                                            <div className="flex justify-center gap-x-2 px-4 pb-4">
                                                <button type="button" onClick={() => requestEditCategory(cat)} className="cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className="fill-theme">
                                                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                                                    </svg>
                                                </button>
                                                <button type="button" onClick={() => requestDeleteCategory(cat)} className="cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="fill-theme-secondary">
                                                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                {currentLevel.length === 0 && (
                                    <div className="col-span-full text-white text-center">
                                        Keine Unterkategorie vorhanden.
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="my-4 flex justify-between">
                        <button type="button" onClick={() => requestAddCategory()} className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                            + Kategorie
                        </button>
                    </div>
                </section>
            </div>
            <CategoryDialog
                isOpen={isOpenCategoryDialog}
                setOpen={setOpenCategoryDialog}
                categoryData={data.mode == "create" ? null : data.currentSelectedCategoryData}
                allCats={allCats}
                requestSubmitData={requestSubmitData}
                errors={errors}
                clearErrors={clearErrors}
                processing={processing}
            />
            <GenericDeletionDialog isOpen={isOpenDeleteCategoryDialog} setOpen={setOpenDeleteCategoryDialog} confirmDelete={confirmDeleteCategory} />
        </>
    )
}