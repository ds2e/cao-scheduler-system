import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import mainLogo from '+/images/Cao_Laura_ohneText.png'
import { useEffect, useMemo, useState } from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ItemDialog({ isOpen, setOpen, itemData, allCats, requestSubmitData, errors, processing }) {
    const [data, setData] = useState({
        name: '',
        code: "",
        price_euro: -1,
        price_cent: -1,
        sub_category_id: -1
    });

    const [selectedCategory, setSelectedCategory] = useState(-1);
    const originalCategoryId = itemData?.sub_category_id
        ? allCats.find((cat) =>
            cat.sub_categories.some(
                (sub) => sub.id === itemData.sub_category_id
            )
        )?.id
        : undefined;

    const originalSubCategoryId = itemData?.sub_category_id;

    useEffect(() => {
        if (itemData !== null) {
            const price = Number(itemData.price) ?? 0; // fallback if null/undefined
            const [price_euro, price_cent] = price.toFixed(2).split(".");
            const foundCat = allCats.find((cat) =>
                cat.sub_categories.some((sub) => sub.id === itemData.sub_category_id)
            );

            if (foundCat) {
                setSelectedCategory(foundCat.id)
                setData({
                    name: itemData.name,
                    code: itemData.code,
                    price_euro: price_euro,
                    price_cent: price_cent,
                    sub_category_id: itemData.sub_category_id
                })
            }
        }
        else {
            setData({
                name: '',
                code: "",
                price_euro: -1,
                price_cent: -1,
                sub_category_id: -1
            })
        }

        return () => {
            setSelectedCategory(-1);
            setData({});
        }

    }, [itemData, isOpen])

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
                        {itemData == null ? "Add Item" : "Edit Item"}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={requestSubmitData} className="space-y-6">
                        <div className="flex items-center justify-between gap-x-2">
                            <div>
                                <label htmlFor="code" className="block text-sm/6 font-medium text-white">
                                    Code
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        required
                                        value={data.code}
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            code: e.target.value,
                                        }))}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                {errors.code && <p className="mt-2 text-red-500">{errors.code}</p>}
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                                    Name
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
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                {errors.name && <p className="mt-2 text-red-500">{errors.name}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-x-2">
                            <div>
                                <label htmlFor="price_euro" className="block text-sm/6 font-medium text-white">
                                    Price (Euro)
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="price_euro"
                                        name="price_euro"
                                        type="number"
                                        required
                                        value={data.price_euro}
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            price_euro: e.target.value,
                                        }))}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="price_cent" className="block text-sm/6 font-medium text-white">
                                    Price (Cent)
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="price_cent"
                                        name="price_cent"
                                        type="number"
                                        required
                                        value={data.price_cent}
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            price_cent: e.target.value,
                                        }))}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.price && <p className="mt-2 text-red-500">{errors.price}</p>}

                        <label htmlFor="sub_category_id" className="block text-sm/6 font-medium text-white">
                            Category
                        </label>
                        <div className="flex items-center justify-between gap-x-4">

                            {/* Category */}
                            <Select
                                value={String(selectedCategory)}
                                onValueChange={(val) => {
                                    const catId = Number(val)
                                    setSelectedCategory(catId)
                                    setData((prev) => ({ ...prev, sub_category_id: -1 }))
                                }}
                                disabled={processing}
                            >
                                <SelectTrigger
                                    className={`w-1/2 ${selectedCategory !== originalCategoryId
                                        ? "bg-blue-600 text-white" // changed
                                        : "bg-gray-700 text-white" // unchanged
                                        }`}
                                >
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categories</SelectLabel>
                                        {allCats.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {/* SubCategory Select */}
                            <Select
                                name="sub_category_id"
                                key={selectedCategory}
                                value={String(data.sub_category_id)}
                                onValueChange={(val) =>
                                    setData((prev) => ({ ...prev, sub_category_id: Number(val) }))
                                }
                                disabled={processing}
                            >
                                <SelectTrigger
                                    className={`w-1/2 ${data.sub_category_id !== originalSubCategoryId
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-white"
                                        }`}
                                >
                                    <SelectValue placeholder="Select SubCategory" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>SubCategories</SelectLabel>
                                        {selectedCategory &&
                                            allCats
                                                .find((cat) => cat.id === selectedCategory)
                                                ?.sub_categories.map((sub) => (
                                                    <SelectItem key={sub.id} value={String(sub.id)}>
                                                        {sub.name}
                                                    </SelectItem>
                                                ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {
                                    processing
                                        ? (itemData == null ? "Adding..." : "Editing...")
                                        : (itemData == null ? "Add" : "Edit")
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}