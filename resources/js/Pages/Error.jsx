import { Link } from "@inertiajs/react";

export default function ErrorPage({ status }) {
    console.log(status);
    const titleMap = {
        503: '503 | Service Unavailable',
        500: '500 | Server Error',
        404: '404 | Page Not Found',
        403: '403 | Forbidden',
        419: '419 | Page Expired',
        406: '406 | Not Acceptable',
        405: '405 | Method Not Allowed'
    }

    const descriptionMap = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: 'Sorry, you are forbidden from accessing this page.',
        419: 'Sorry, your session is expired',
        406: 'Sorry, somehow we detected malicious request',
        405: 'Sorry, it seems the endpoint doesn\'t support this method'
    }

    const title = titleMap[status] || `${status} | Unknown Error`;
    const description = descriptionMap[status] || 'An unexpected error occurred. Please try again later.';

    return (
        <div className="h-screen w-full bg-theme place-content-center text-center">
            <h1 className="text-theme-secondary text-6xl">{title}</h1>
            <p className="text-theme-secondary text-xl my-4">{description}</p>
            <Link href='/' className="cursor-pointer w-auto rounded-md bg-theme-secondary px-3 py-1.5 text-xl font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Home
            </Link>
        </div>
    )
}