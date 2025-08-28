import { usePage } from "@inertiajs/react";
import WorkNavbar from "../components/Navbar/WorkNavbar";
import DashboardNavbar from "../components/Navbar/DashboardNavbar";

export default function WorkLayout({ children }) {
    const { auth } = usePage().props;
    return (
        <>
            <header>
                {
                    auth && auth.user?.role?.rank > 2 ?
                        <DashboardNavbar auth={auth} />
                        :
                        <WorkNavbar />
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