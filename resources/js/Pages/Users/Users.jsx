import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Link, router, useForm, usePage } from "@inertiajs/react";
import mainLogo from '+/images/Cao_Laura_ohneText.png'
import { useEffect, useState } from "react";
import UserDeleteDialog from "@/components/Dialog/UserDeleteDialog";
import UserRegisterDialog from "@/components/Dialog/UserRegisterDialog";
import UserUpdatePromotionDialog from "@/components/Dialog/UserUpdatePromotionDialog";

export default function UsersPage({ users, roles }) {
    const rolesNeedConfirmation = roles.filter((role) => role.requires_confirmation == true);
    const { auth } = usePage().props;

    const { data, setData, patch, delete: destroy, processing, errors, transform } = useForm({
        currentSelectedUserData: {},
        authorData: {
            id: auth.user.uid,
            password: ''
        }
    });
    const [currentPage, setCurrentPage] = useState(users.current_page);

    const [isOpenDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);
    const [isOpenRegisterUserDialog, setOpenRegisterUserDialog] = useState(false);
    const [isOpenPromotionUserDialog, setOpenPromotionUserDialog] = useState(false);

    const goToPage = (page) => {
        // Inertia automatically handles page requests
        setCurrentPage(page);
        router.get(`/dashboard/users?page=${page}`);
    };

    function toggleEditUser(user) {
        if (Object.keys(data.currentSelectedUserData).length == 0 || data.currentSelectedUserData.id !== user.id) {
            setData({
                ...data,
                currentSelectedUserData: user
            });
        } else {
            setData({
                ...data,
                currentSelectedUserData: {}
            });
        }
    }

    function requestDoneEditUser() {
        const selectedRank = data.currentSelectedUserData.new_role_rank ?? data.currentSelectedUserData.role_rank;

        const needConfirmation = rolesNeedConfirmation.some(
            (role) => role.rank === selectedRank
        );

        // console.log(data);

        if (data.currentSelectedUserData.new_role_rank > data.currentSelectedUserData.role_rank && needConfirmation) {
            setOpenPromotionUserDialog(true);
        }
        else {
            transform((data) => ({
                ...data,
                currentSelectedUserData: {
                    ...data.currentSelectedUserData,
                    role_id: roles.find(role => role.rank === selectedRank)?.id
                }
            }))
            patch(`/dashboard/users/${data.currentSelectedUserData.id}`, {
                onSuccess: () => {
                    setData({
                        ...data,
                        currentSelectedUserData: {}
                    });
                }
            });
        }
    }

    function requestDeleteUser() {
        setOpenDeleteUserDialog(true);
    }

    function confirmDeleteUser() {
        destroy(`/dashboard/users/${data.currentSelectedUserData.id}`, {
            onSuccess: () => {
                setData({
                    ...data,
                    currentSelectedUserData: {}
                });
                setOpenDeleteUserDialog(false);
            }
        })
    }

    function confirmPromotionUser(authorPassword) {
        setOpenPromotionUserDialog(false);
        transform((data) => ({
            ...data,
            currentSelectedUserData: {
                ...data.currentSelectedUserData,
                role_id: roles.find(role => role.rank === data.currentSelectedUserData.new_role_rank)?.id
            },
            authorData: {
                ...data.authorData,
                password: authorPassword
            }
        }));
        patch(`/dashboard/users/${data.currentSelectedUserData.id}`, {
            onSuccess: () => {
                setData({
                    ...data,
                    currentSelectedUserData: {}
                });
            }
        });
    }

    // console.log(users.data);
    // console.log(roles);

    return (
        <>
            <div className="pt-18 px-4 bg-theme place-content-center min-h-screen w-full">
                <div className="relative overflow-x-auto rounded-md">
                    <div className="flex items-center justify-between rounded-tl-md rounded-tr-md bg-white dark:bg-gray-900 overflow-x-clip">
                        <div>
                            {
                                Object.keys(errors).length > 0 ?
                                    <div className="space-y-1 overflow-y-scroll h-10 px-6 py-2">
                                        {Object.entries(errors).map(([field, message]) => (
                                            <p className="text-red-500 font-semibold" key={field + "password"}>
                                                {message}
                                            </p>
                                        ))}
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                        <div className="relative translate-x-0.5 -translate-y-0.5">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <label htmlFor="table-search" className="sr-only">Search</label>
                            <input type="text" id="table-search-users" className="h-10 rounded-tr-sm rounded-bl-sm p-2 ps-10 text-sm text-white w-80 bg-theme focus:ring-blue-500 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500" placeholder="Search for users" />
                        </div>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user, user_ind) => {
                                return (
                                    <tr key={user_ind} className={`${data.currentSelectedUserData.id == user.id ? "bg-red-100" : "bg-white hover:bg-gray-50"} border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600`}>
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <img className="w-10 h-10 rounded-full bg-theme p-1.5" src={mainLogo} alt="Jese image" />
                                            <div className="ps-3">
                                                {
                                                    (Object.keys(data.currentSelectedUserData).length > 0 && data.currentSelectedUserData.id == user.id) ?
                                                        <input
                                                            value={data.currentSelectedUserData.name}
                                                            onChange={(e) => {
                                                                const updatedCurrentSelectedUserData = { ...data.currentSelectedUserData };
                                                                updatedCurrentSelectedUserData.name = e.target.value;
                                                                setData({
                                                                    ...data,
                                                                    currentSelectedUserData: updatedCurrentSelectedUserData
                                                                })
                                                            }}
                                                            autoFocus
                                                            className="p-2 border-[1px] border-theme"
                                                        />
                                                        :
                                                        <div className="flex gap-x-2 items-center">
                                                            <Link href={`/dashboard/users/${user.id}`} className="text-base font-semibold">{user.name}</Link>
                                                            {
                                                                user.id == auth.user.uid ? <span className="text-theme-secondary">(You)</span> : <></>
                                                            }
                                                        </div>
                                                }
                                                <div className="font-normal text-gray-500">{user.email}</div>
                                                {
                                                    (Object.keys(data.currentSelectedUserData).length > 0 && data.currentSelectedUserData.id == user.id) ?
                                                        <input
                                                            type="text"
                                                            maxLength="4"
                                                            pattern="\d{4}"
                                                            required
                                                            value={data.currentSelectedUserData.PIN}
                                                            onChange={(e) => {
                                                                const updatedCurrentSelectedUserData = { ...data.currentSelectedUserData };
                                                                updatedCurrentSelectedUserData.PIN = e.target.value;
                                                                setData({
                                                                    ...data,
                                                                    currentSelectedUserData: updatedCurrentSelectedUserData
                                                                })
                                                            }}
                                                            className="p-2 border-[1px] border-theme"
                                                        />
                                                        :
                                                        <div className="font-normal text-gray-500">{user.PIN}</div>
                                                }
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {
                                                (Object.keys(data.currentSelectedUserData).length > 0 && data.currentSelectedUserData.id == user.id) ?
                                                    <Select
                                                        value={String(data.currentSelectedUserData.new_role_rank ?? data.currentSelectedUserData.role_rank)}
                                                        onValueChange={(selectedRoleRank) => {
                                                            const updatedCurrentSelectedUserData = { ...data.currentSelectedUserData };
                                                            updatedCurrentSelectedUserData.new_role_rank = Number(selectedRoleRank)
                                                            setData({
                                                                ...data,
                                                                currentSelectedUserData: updatedCurrentSelectedUserData
                                                            })
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-[180px] border-theme">
                                                            <SelectValue placeholder="Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {roles.map((role, role_ind) => (
                                                                <SelectItem key={`${user.id}-${role.id}`} value={String(role.rank)}>
                                                                    {role.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    :
                                                    roles.find(role => role.id === user.role_id)?.name
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-full bg-muted me-2"></div> Unknown
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button type="button" onClick={() => toggleEditUser(user)} className="cursor-pointer p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} className={(data.currentSelectedUserData.id == user.id) ? "fill-theme-secondary-highlight" : "fill-theme"}>
                                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                                                </svg>
                                            </button>
                                            {
                                                (Object.keys(data.currentSelectedUserData).length > 0 && data.currentSelectedUserData.id == user.id)
                                                &&
                                                <>
                                                    <button type="button" onClick={() => requestDeleteUser(data.currentSelectedUserData.id)} className="cursor-pointer p-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="fill-theme-secondary">
                                                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                                        </svg>
                                                    </button>
                                                    {
                                                        processing ?
                                                            <div role="status" className="inline-block ps-2">
                                                                <svg className="fill-muted animate-spin" width={20} height={20} viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                </svg>
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                            :
                                                            <button type="button" onClick={() => requestDoneEditUser()} className="cursor-pointer p-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} className="fill-theme">
                                                                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                                                </svg>
                                                            </button>
                                                    }
                                                </>
                                            }

                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="my-4 flex justify-between">
                    <button type="button" onClick={() => setOpenRegisterUserDialog(true)} className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                        + User
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className={(currentPage === 1) ? "fill-theme-secondary" : "fill-white"}>
                                <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM271 135c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-87 87 87 87c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L167 273c-9.4-9.4-9.4-24.6 0-33.9L271 135z" />
                            </svg>
                        </button>

                        <span className="text-white">Page {currentPage} of {users.last_page}</span>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === users.last_page}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={25} height={25} className={(currentPage === users.last_page) ? "fill-theme-secondary" : "fill-white"}>
                                <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <UserRegisterDialog isOpen={isOpenRegisterUserDialog} setOpen={setOpenRegisterUserDialog} />
            <UserDeleteDialog isOpen={isOpenDeleteUserDialog} setOpen={setOpenDeleteUserDialog} currentUserData={data.currentSelectedUserData} role={roles.find(role => role.id === data.currentSelectedUserData.role_id)?.name} confirmDeleteUser={confirmDeleteUser} />
            <UserUpdatePromotionDialog isOpen={isOpenPromotionUserDialog} setOpen={setOpenPromotionUserDialog} currentUserData={data.currentSelectedUserData} oldRole={roles.find(role => role.id === data.currentSelectedUserData.role_id)?.name} newRole={roles.find(role => role.rank === data.currentSelectedUserData.new_role_rank)?.name} confirmPassword={confirmPromotionUser} />
        </>
    )
}