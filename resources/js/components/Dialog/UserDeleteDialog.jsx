import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function UserDeleteDialog({ currentUserData, role, isOpen, setOpen, confirmDeleteUser }) {
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the account
                        and remove the data from the server.
                    </DialogDescription>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={50} height={50} className="fill-theme-secondary mx-auto">
                        <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                    </svg>
                    Deleting<b> {currentUserData.name} ({role})</b>
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => confirmDeleteUser()} className="cursor-pointer px-4 py-2 text-white bg-theme-secondary rounded-full hover:bg-theme-secondary-highlight">Confirm</button>
                        <button type="button" onClick={() => setOpen(false)} className="cursor-pointer px-4 py-2 text-theme-secondary rounded-full border-[1px] border-theme-secondary hover:bg-gray-100">Cancel</button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}