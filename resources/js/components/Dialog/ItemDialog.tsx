import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import * as React from "react"
import { CategoryData, ItemClassData, ItemDataBackend, ItemDataFrontend } from "@/lib/types"

type ItemDialogProps = {
    isOpen: boolean,
    setOpen: VoidFunction,
    itemData: ItemDataBackend,
    allCats: Array<CategoryData>,
    allItemClasses: Array<ItemClassData>,
    requestSubmitData: VoidFunction,
    errors: Record<keyof ItemDataBackend, string>,
    clearErrors: VoidFunction,
    processing: boolean
}

export default function ItemDialog({ isOpen, setOpen, itemData, allCats, allItemClasses, requestSubmitData, errors, clearErrors, processing }: ItemDialogProps) {
    const [data, setData] = useState<Partial<ItemDataFrontend>>({
        name: '',
        code: "",
        item_class: null,
        price_euro: "",
        price_cent: "",
        category_id: -1
    });

    const [selectedCategory, setSelectedCategory] = useState(-1);
    const originalCategoryId = itemData?.category_id
        ? allCats.find((cat) =>
            (cat.id === itemData.category_id)
        )?.id
        : -1;

    const [selectedItemClass, setSelectedItemClass] = useState<number | null>(-1);
    const originalItemClass = itemData?.item_class
        ? allItemClasses.find((itemClass) =>
            (itemClass.id === itemData.item_class)
        )?.id
        : null;

    useEffect(() => {
        if (itemData !== null) {
            const price = Number(itemData.price) ?? 0; // fallback if null/undefined
            const [price_euro, price_cent] = price.toFixed(2).split(".");

            setData({
                name: itemData.name,
                code: itemData.code,
                item_class: itemData.item_class !== null ? Number(itemData.item_class) : null,
                price_euro: price_euro,
                price_cent: price_cent,
                category_id: itemData.category_id !== null ? Number(itemData.category_id) : -1
            })

            setSelectedCategory((prev) => {
                return itemData.category_id !== null ? Number(itemData.category_id) : -1
            })

            setSelectedItemClass((prev) => {
                return itemData.item_class !== null ? Number(itemData.item_class) : null
            })
        }

        return () => {
            setSelectedCategory(-1);
            setSelectedItemClass(-1);
            setData({
                name: '',
                code: "",
                item_class: null,
                price_euro: "",
                price_cent: "",
                category_id: -1
            });
            clearErrors();
        }

    }, [itemData, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="bg-theme max-h-[95%] items-center">
                <form onSubmit={requestSubmitData} className="space-y-6">
                    <DialogHeader>
                        <DialogDescription>
                            <img
                                alt="Your Company"
                                src={mainLogo}
                                className="mx-auto h-18 sm:h-36 w-auto"
                            />
                        </DialogDescription>
                        <DialogTitle className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-theme-secondary">
                            {itemData == null ? "Artikel hinzufügen" : "Artikel ändern"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 overflow-y-auto space-y-6">
                        <div className="flex items-center justify-between gap-x-2">
                            <div className="flex-1/2">
                                <label htmlFor="code" className="block text-sm/6 font-medium text-white">
                                    Code
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        value={data.code ?? ""}
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            code: e.target.value,
                                        }))}
                                        placeholder="Code..."
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                {errors.code && <p className="mt-2 text-red-500">{errors.code}</p>}
                            </div>
                            <div className="flex-1/2">
                                <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                                    Name <span className="text-theme-secondary">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={data.name ?? ""}
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
                        </div>

                        <div className="flex items-center justify-between gap-x-2">
                            <div className="flex-1/2">
                                <label htmlFor="price_euro" className="block text-sm/6 font-medium text-white">
                                    Preis (Euro) <span className="text-theme-secondary">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="price_euro"
                                        name="price_euro"
                                        type="number"
                                        min="0"
                                        required
                                        value={data.price_euro ?? ""}
                                        onKeyDown={(e) => {
                                            if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => setData((prev: any) => ({
                                            ...prev,
                                            price_euro: e.target.value,
                                        }))}
                                        placeholder="Euro..."
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div className="flex-1/2">
                                <label htmlFor="price_cent" className="block text-sm/6 font-medium text-white">
                                    Preis (Cent) <span className="text-theme-secondary">*</span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="price_cent"
                                        name="price_cent"
                                        type="number"
                                        min="0"
                                        max="99"
                                        required
                                        value={data.price_cent ?? ""}
                                        onKeyDown={(e) => {
                                            if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => setData((prev: any) => ({
                                            ...prev,
                                            price_cent: e.target.value,
                                        }))}
                                        placeholder="Cent..."
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.price && <p className="mt-2 text-red-500">{errors.price}</p>}

                        <div className="flex items-center justify-between gap-x-2">
                            <div className="flex-1/2">
                                <label htmlFor="item_class" className="block text-sm/6 font-medium text-white">
                                    Steuersatz
                                </label>
                                <div className="mt-2">

                                    {/* Category */}
                                    <Select
                                        name="item_class"
                                        value={selectedItemClass === null ? "null" : String(selectedItemClass)}
                                        onValueChange={(val) => {
                                            const itemClassId = (val === "null") ? null : Number(val);
                                            setSelectedItemClass(itemClassId)
                                            setData((prev) => ({ ...prev, item_class: itemClassId }))
                                        }}
                                        disabled={processing}
                                    >
                                        <SelectTrigger
                                            className={`w-full ${selectedItemClass !== originalItemClass && itemData
                                                ? "bg-theme-secondary text-white" // changed
                                                : "bg-gray-700 text-white" // unchanged
                                                } ${errors.item_class && "border-theme-secondary"}`}
                                        >
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Steuersatz</SelectLabel>
                                                <SelectItem value="-1" disabled>
                                                    Steuersatz auswählen
                                                </SelectItem>
                                                <SelectItem key={'Tax-null'} value="null" className={
                                                    originalItemClass == null && itemData
                                                        ? "text-theme-secondary font-semibold"
                                                        : ""
                                                }>
                                                    None
                                                </SelectItem>
                                                {allItemClasses
                                                    .sort((a, b) => {
                                                        return a.name.localeCompare(b.name);
                                                    })
                                                    .map((itemClass) => (
                                                        <SelectItem
                                                            key={itemClass.id}
                                                            value={String(itemClass.id)}
                                                            className={
                                                                itemClass.id === originalItemClass
                                                                    ? "text-theme-secondary font-semibold"
                                                                    : ""
                                                            }
                                                        >
                                                            {itemClass.name} ({itemClass.rate}%)
                                                        </SelectItem>
                                                    ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {errors.item_class && <p className="mt-2 text-red-500">{errors.item_class}</p>}
                            </div>
                            <div className="flex-1/2">
                                <label htmlFor="category_id" className="block text-sm/6 font-medium text-white">
                                    Kategorie <span className="text-theme-secondary">*</span>
                                </label>
                                <div className="mt-2">

                                    {/* Category */}
                                    <Select
                                        name="category_id"
                                        required
                                        value={String(selectedCategory)}
                                        onValueChange={(val) => {
                                            const catId = Number(val)
                                            setSelectedCategory(catId)
                                            setData((prev) => ({ ...prev, category_id: catId }))
                                        }}
                                        disabled={processing}
                                    >
                                        <SelectTrigger
                                            className={`w-full ${selectedCategory !== originalCategoryId && itemData
                                                ? "bg-theme-secondary text-white" // changed
                                                : "bg-gray-700 text-white" // unchanged
                                                } ${errors.category_id && "border-theme-secondary"}`}
                                        >
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Kategorien</SelectLabel>
                                                <SelectItem value="-1" disabled>
                                                    Kategorie auswählen
                                                </SelectItem>
                                                {allCats
                                                    .sort((a, b) => {
                                                        return a.name.localeCompare(b.name);
                                                    })
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
                                {errors.category_id && <p className="mt-2 text-red-500">{errors.category_id}</p>}
                            </div>

                        </div>



                        {
                            Object.keys(errors).length > 0 ?
                                <div className="space-y-1 overflow-y-scroll h-10 py-2">
                                    {Object.entries(errors).map(([field, message]: [React.Key, any]) => (
                                        <p className="text-red-500 font-semibold" key={field}>
                                            {message}
                                        </p>
                                    ))}
                                </div>
                                :
                                <></>
                        }
                    </div>
                    <DialogFooter>
                        <button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {
                                processing
                                    ? (itemData == null ? "Laden..." : "Laden...")
                                    : (itemData == null ? "Addieren" : "Ändern")
                            }
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}