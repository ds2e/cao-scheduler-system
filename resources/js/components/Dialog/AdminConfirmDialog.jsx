import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

export default function AdminConfirmDialog({ currentUserData, isOpen, setOpen, confirmRequest, action }) {
    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{action == "logout" ? "Sind Sie absolut sicher?" : "Nutzer einloggen"}</DialogTitle>
                </DialogHeader>
                {action == "logout" ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={50} height={50} className="fill-theme-secondary mx-auto">
                        <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={50} height={50} className="fill-theme mx-auto">
                        <path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 240C302.3 240 288 254.3 288 272C288 285.3 277.3 296 264 296C250.7 296 240 285.3 240 272C240 227.8 275.8 192 320 192C364.2 192 400 227.8 400 272C400 319.2 364 339.2 344 346.5L344 350.3C344 363.6 333.3 374.3 320 374.3C306.7 374.3 296 363.6 296 350.3L296 342.2C296 321.7 310.8 307 326.1 302C332.5 299.9 339.3 296.5 344.3 291.7C348.6 287.5 352 281.7 352 272.1C352 254.4 337.7 240.1 320 240.1zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z" />
                    </svg>
                }
                {action == "logout" ? "Abgemeldete" : "Eingeloggte"} Nutzer: <b> {currentUserData?.name}</b>
                <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => confirmRequest()} className={`${action == "logout" ? "bg-theme-secondary hover:bg-theme-secondary-highlight" : "bg-theme hover:bg-theme-highlight"} cursor-pointer px-4 py-2 text-white rounded-full`}>Zustimmen</button>
                    <button type="button" onClick={() => setOpen(false)} className={`${action == "logout" ? "text-theme-secondary border-theme-secondary" : "text-theme border-theme"} cursor-pointer px-4 py-2 rounded-full border-[1px] hover:bg-gray-100`}>Abbrechen</button>
                </div>
            </DialogContent>
        </Dialog>
    )
}