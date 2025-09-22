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

export default function TableDialog({ isOpen, setOpen, tableData, requestSubmitData, errors, clearErrors, processing }) {
  
    const [data, setData] = useState({
        name: '',
        type: "",
    });

    useEffect(() => {
        if (tableData) {
            setData({
                name: tableData.name,
                type: tableData.type
            })
        }

        return () => {
            clearErrors();
            setData({
                name: '',
                type: "",
            })
        }

    }, [tableData, isOpen])

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
                        {tableData == null ? "Add Category" : "Edit Category"}
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
                            <div>
                                <label htmlFor="type" className="block text-sm/6 font-medium text-white">
                                    Type
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="type"
                                        name="type"
                                        type="number"
                                        min="0"
                                        value={data.type ?? ""}
                                        onKeyDown={(e) => {
                                            if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => setData((prev) => ({
                                            ...prev,
                                            type: e.target.value,
                                        }))}
                                        placeholder="Type..."
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                                {errors.type && <p className="mt-2 text-red-500">{errors.type}</p>}
                            </div>
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
                                        ? (tableData == null ? "Adding..." : "Editing...")
                                        : (tableData == null ? "Add" : "Edit")
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}