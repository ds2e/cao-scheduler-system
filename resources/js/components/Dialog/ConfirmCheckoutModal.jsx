import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function ConfirmCheckoutModal({ isOpen, setOpen, onConfirmAction, saveCurrentBill }) {

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent
                className={`rounded-md p-4 w-full max-w-md m-auto ${saveCurrentBill ? "bg-green-500" : "bg-red-500 text-white"}`}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-white">
                        {saveCurrentBill ? "Speichern" : "Wegwerfen"}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-white">
                        {saveCurrentBill ? "Diese Rechnung speichern?" : "Wirklich wegwerfen?"}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row justify-center items-center mt-4">
                    <button
                        onClick={onConfirmAction}
                        className="bg-white rounded-md px-3 py-1.5 w-1/2"
                    >
                        <p className={`${saveCurrentBill ? "text-green-500" : "text-red-500"} text-center`}>{saveCurrentBill ? "Speichern" : "Discard"}</p>
                    </button>
                    <button
                        onClick={() => setOpen(false)}
                        className="px-3 py-1.5 w-1/2"
                    >
                        <p className="text-white text-center">Cancel</p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}