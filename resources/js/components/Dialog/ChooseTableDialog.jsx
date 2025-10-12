import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function ChooseTableDialog({ isOpen, setOpen, tables, chooseTable }) {
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="!max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle>Tisch auswählen</DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-rows-10 grid-flow-col gap-2 overflow-x-auto">
                    {tables.map((table, tableInd) => {
                        const hasOrder = tables.some((t) => t.id === table.id && t.storedOrders.length > 0);
                        return (
                            <button
                                onClick={() => chooseTable(table.id)}
                                key={String(table.id + '-' + tableInd)}
                                className={`${hasOrder ? "bg-theme-secondary text-white" : "bg-gray-200"} rounded-lg p-2 whitespace-nowrap`}
                            >
                                {table.name}
                            </button>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}