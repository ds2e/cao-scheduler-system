import { Link } from "@inertiajs/react";

export default function MaintainancePage() {

    return (
        <div className="h-screen w-full bg-theme place-content-center text-center">
            <h1 className="text-theme-secondary text-6xl">This page is in Maintainance</h1>
            <p className="text-theme-secondary text-xl my-4">Please wait or try again later!</p>
            <Link href='/' className="cursor-pointer w-auto rounded-md bg-theme-secondary px-3 py-1.5 text-xl font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Home
            </Link>
        </div>
    )
}