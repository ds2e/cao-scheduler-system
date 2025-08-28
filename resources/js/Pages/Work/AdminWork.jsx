import { useState } from "react";
import WorkLayout from "../../Layouts/WorkLayout";
import Timer from "./Timer";
import AdminConfirmDialog from "../../components/Dialog/AdminConfirmDialog";
import { router, useForm } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideMenuBar from "../../components/Navbar/SideMenuBar";

const AdminWorkWorkPage = ({ users, works }) => {
    const [action, setAction] = useState('');
    console.log(works)
    const [isOpenAdminConfirmDialog, setOpenAdminConfirmDialog] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        pin: '',
    })

    function requestLogoutUser(userPIN) {
        // console.log(userData)
        setData("pin", userPIN);
        setAction("logout");
        setOpenAdminConfirmDialog(true);
    }

    function confirmRequest() {
        setOpenAdminConfirmDialog(false);
        if (action == "logout") {
            post('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls/logout', {
                onSuccess: () => {
                    reset();
                    router.reload({ only: ['works'] });
                },
            });
        }
        else {
            post('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls/login', {
                onSuccess: () => {
                    reset();
                    router.reload({ only: ['works'] });
                },
            });
        }
    }

    function requestLoginUser(userPIN) {
        setData("pin", userPIN);
        setAction("login");
        setOpenAdminConfirmDialog(true);
    }

    return (
        <>
            <SideMenuBar />
            <div className="p-4 md:ml-64 min-h-screen pt-20">
                {errors.pin && <div className="text-center font-bold text-theme-secondary bg-gray-200 py-2">{errors.pin}</div>}
                <div className="my-2 flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={30} height={30} className="fill-theme">
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                            </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Available Users</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {
                                users
                                    .filter(user => !works.some(work => work.user_id === user.id))
                                    .map((restUser, restUserInd) => {
                                        return <DropdownMenuItem onClick={() => requestLoginUser(restUser.PIN)} key={"rest-user" + restUserInd + restUser.id}>{restUser.name}</DropdownMenuItem>
                                    })
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {
                    works.length <= 0 ?
                        <div className="h-[75vh] flex items-center justify-center">
                            <h2>Niemand ist gerade in Arbeit!</h2>
                        </div>
                        :
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {works.map((work, ind) => (
                                <div
                                    key={String(work.user.id) + String(ind)}
                                    className="flex flex-col items-center bg-white rounded-lg p-4 shadow"
                                >
                                    <h3 className="font-semibold mb-2">{work.user.name}</h3>
                                    <h4 className="text-theme-secondary mb-2">{work.user.PIN}</h4>
                                    <Timer timeStart={`${work.date}T${work.time_start}`} />
                                    <button
                                        onClick={() => requestLogoutUser(work.user.PIN)}
                                        className="rounded-full text-white bg-theme-secondary hover:bg-theme-secondary-highlight py-2 px-3 mt-2"
                                    >
                                        Abmelden
                                    </button>
                                </div>
                            ))}
                        </div>
                }
            </div>
            <AdminConfirmDialog isOpen={isOpenAdminConfirmDialog} setOpen={setOpenAdminConfirmDialog} currentUserData={users.find(u => u.PIN == data.pin)} confirmRequest={confirmRequest} action={action} />
        </>
    )
}

AdminWorkWorkPage.layout = page => <WorkLayout children={page} />

export default AdminWorkWorkPage;