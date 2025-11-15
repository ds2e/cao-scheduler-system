import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function GenericConfirmationDialog({ isOpen, setOpen, confirmAction }) {
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Aktion best&auml;tigen</DialogTitle>
                    <DialogDescription>
                        Best&auml;tigen Sie dieser Aktion, damit es nicht als ein Fehlklick interpretiert werden.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => confirmAction()} className="cursor-pointer px-4 py-2 text-white bg-theme rounded-full hover:bg-theme-highlight">Best&auml;tigen</button>
                    <button type="button" onClick={() => setOpen(false)} className="cursor-pointer px-4 py-2 text-theme rounded-full border-[1px] border-theme hover:bg-gray-100">Cancel</button>
                </div>
            </DialogContent>
        </Dialog>
    )
}