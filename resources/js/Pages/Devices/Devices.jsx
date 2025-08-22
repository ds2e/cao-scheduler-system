import SideMenuBar from "../../components/Navbar/SideMenuBar";

export default function DevicesPage({passwords}){
    return (
        <>
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <SideMenuBar />
            <section className="p-4 md:ml-64 h-auto pt-20 bg-theme min-h-screen place-content-center">
                <h1 className="text-white">Master Password</h1>
                <h2 className="text-white">{passwords[0].password}</h2>
            </section>
        </div>
        </>
    )
}