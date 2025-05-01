import { usePage } from "@inertiajs/react";

import MainWebNavbar from "../components/Navbar/MainAppNavbar";
import DashboardNavbar from "../components/Navbar/DashboardNavbar";

export default function Layout({ children }) {
    const { auth } = usePage().props;

    return (
        <>
            <header>
                {
                    auth ? 
                    <DashboardNavbar />
                    :
                    <MainWebNavbar />                   
                }
            </header>
            <main>
                {children}
            </main>
            <footer>

            </footer>
        </>
    )
}