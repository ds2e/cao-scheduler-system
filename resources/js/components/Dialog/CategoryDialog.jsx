import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import mainLogo from '+/images/Cao_Laura_ohneText.png'
import { useEffect, useState } from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CategoryDialog({ isOpen, setOpen, categoryData, allCats, requestSubmitData, errors, clearErrors, processing }) {
    const [data, setData] = useState({
        name: '',
        priority: "",
        sub_category_from: null
    });

    const [selectedCategory, setSelectedCategory] = useState(null);
    const originalCategoryId = categoryData?.sub_category_from
        ? allCats.find((cat) =>
            (cat.id === categoryData.sub_category_from)
        )?.id
        : null;

    useEffect(() => {
        if (categoryData !== null) {
            const foundCat = allCats.find((cat) =>
                (cat.id === categoryData.id)
            );

            if (foundCat) {
                setSelectedCategory(foundCat.sub_category_from ? Number(foundCat.sub_category_from) : null)
                setData({
                    name: categoryData.name,
                    priority: categoryData.priority,
                    sub_category_from: categoryData.sub_category_from
                })
            }
        }

        return () => {
            clearErrors();
            setSelectedCategory(null);
            setData({
                name: '',
                priority: "",
                sub_category_from: null
            })
        }

    }, [categoryData, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="bg-theme">
                <DialogHeader>
                    <DialogDescription>
                        <img
                            alt="Your Company"
                            src={mainLogo}
                            className="mx-auto h-18 sm:h-36 w-auto"
                        />
                    </DialogDescription>
                    <DialogTitle className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-theme-secondary">
                        {categoryData == null ? "Add Category" : "Edit Category"}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={requestSubmitData} className="space-y-6">
                        <div className="flex items-center justify-between gap-x-2">
                            <div>
                                <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                                    Name <span className="text-theme-secondary">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))}
                                        placeholder="Name..."
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                {errors.name && <p className="mt-2 text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-sm/6 font-medium text-white">
                                    Priorität
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="priority"
                                        name="priority"
                                        type="number"
                                        min="0"
                                        value={data.priority ?? ""}
                                        onKeyDown={(e) => {
                                            if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            priority: e.target.value,
                                        }))}
                                        placeholder="Priorität..."
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                {errors.priority && <p className="mt-2 text-red-500">{errors.priority}</p>}
                            </div>
                        </div>

                        <label htmlFor="sub_category_from" className="block text-sm/6 font-medium text-white mb-2">
                            Unterkategorie von:
                        </label>
                        <div className="flex items-center justify-between gap-x-4">

                            {/* Category */}
                            <Select
                                name="sub_category_from"
                                value={selectedCategory === null ? "null" : String(selectedCategory)}
                                onValueChange={(val) => {
                                    const catId = (val === "null") ? null : Number(val);
                                    setSelectedCategory(catId)
                                    setData((prev) => ({ ...prev, sub_category_from: catId }))
                                }}
                                disabled={processing}
                            >
                                <SelectTrigger
                                    className={`w-1/2 ${selectedCategory !== originalCategoryId && categoryData
                                        ? "bg-theme-secondary text-white" // changed
                                        : "bg-gray-700 text-white" // unchanged
                                        }`}
                                >
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categories</SelectLabel>
                                        <SelectItem key={'Cat-null'} value="null" className={
                                            originalCategoryId == null && categoryData
                                                ? "text-theme-secondary font-semibold"
                                                : ""
                                        }>
                                            None
                                        </SelectItem>
                                        {allCats
                                            .filter((cat) => cat.id !== categoryData?.id) // exclude current category
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={String(cat.id)}
                                                    className={
                                                        cat.id === originalCategoryId
                                                            ? "text-theme-secondary font-semibold"
                                                            : ""
                                                    }
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        {
                            Object.keys(errors).length > 0 ?
                                <div className="space-y-1 overflow-y-scroll h-10 py-2">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <p className="text-red-500 font-semibold" key={field}>
                                            {message}
                                        </p>
                                    ))}
                                </div>
                                :
                                <></>
                        }
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {
                                    processing
                                        ? (categoryData == null ? "Adding..." : "Editing...")
                                        : (categoryData == null ? "Add" : "Edit")
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}