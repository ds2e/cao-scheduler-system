import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function UserUpdatePromotionDialog({ currentUserData, isOpen, setOpen, oldRole, newRole, confirmPassword }) {

    const [userPassword, setUserPassword] = useState('');

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        You are performing a crucial promotion! This action require a password.
                    </DialogDescription>
                </DialogHeader>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={50} height={50} className="fill-theme-secondary mx-auto">
                    <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                </svg>
                Promoting<b> {currentUserData?.name}</b>
                <div className="flex items-center gap-2">
                    <b className="text-theme-secondary">{oldRole}</b>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20}>
                        <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                    </svg>
                    <b className="text-theme-secondary">{newRole}</b>
                </div>

                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium">
                        Password
                    </label>
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={() => confirmPassword(userPassword)} className="cursor-pointer px-4 py-2 text-white bg-theme-secondary rounded-full hover:bg-theme-secondary-highlight">Confirm</button>
                    <button type="button" onClick={() => setOpen(false)} className="cursor-pointer px-4 py-2 text-theme-secondary rounded-full border-[1px] border-theme-secondary hover:bg-gray-100">Cancel</button>
                </div>
            </DialogContent>
        </Dialog>
    )
}