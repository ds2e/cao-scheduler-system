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


export default function RogueItemDialog({ isOpen, setOpen, allItemClasses, requestSubmitData, errors, clearErrors, processing }) {
    const [data, setData] = useState({
        name: '',
        code: "",
        item_class: null,
        price_euro: "",
        price_cent: ""
    });

    const [selectedItemClass, setSelectedItemClass] = useState(-1);

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
                            fremde Artikel hinzufügen
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-6">
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
                                {/* {errors.code && <p className="mt-2 text-red-500">{errors.code}</p>} */}
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
                                {/* {errors.name && <p className="mt-2 text-red-500">{errors.name}</p>} */}
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
                                        onChange={(e) => setData((prev) => ({
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
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            price_cent: e.target.value,
                                        }))}
                                        placeholder="Cent..."
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* {errors.price && <p className="mt-2 text-red-500">{errors.price}</p>} */}
                    </div>
                    <DialogFooter>
                        <button
                            type="submit"
                            className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Addieren
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}