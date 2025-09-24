import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "@inertiajs/react"
import mainLogo from '+/images/Cao_Laura_ohneText.png'
import { useEffect } from "react"

export default function ItemClassDialog({ isOpen, setOpen }) {
    const { data, setData, post, processing, errors, setError } = useForm({
        name: '',
        rate: null
    })

    function requestAddItemClass(e) {
        e.preventDefault();
        const value = parseFloat(data.rate);

        if (
            data.rate !== "" && // allow empty if nullable
            (value < 0 || value > 100)
        ) {
            setError("rate", "Steuersatz muss eine Zahl zwischen 0 und 100 sein.");
            return;
        }

        if (data.name == "" || data.name.trim() == "") {
            setError("name", "Name ist ein erforderliches Feld");
            return;
        }

        post('/dashboard/manage/menu/items/tax', {
            onSuccess: () => {
                setOpen(false)
            },
        })
    }

    useEffect(() => {
        setData(
            {
                name: '',
                rate: null,
            }
        )
    }, [isOpen])

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
                        Neuer Steuersatz hinzufügen
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={requestAddItemClass} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                                Name<span className="text-theme-secondary">*</span>
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="name"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="tax" className="block text-sm/6 font-medium text-white">
                                Steuersatz (Prozent)
                            </label>
                            <div className="mt-2">
                                <input
                                    id="tax"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.rate ?? ""}
                                    step="0.01"
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setData('rate', e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            {errors.rate && <p className="mt-2 text-red-500">{errors.rate}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {processing ? 'Laden...' : 'Bestätigen'}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}