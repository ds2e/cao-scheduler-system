import { useState } from "react";
import SideMenuBar from "@/components/Navbar/SideMenuBar";
import { router } from "@inertiajs/react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import GenericConfirmationDialog from "@/components/Dialog/GenericConfirmationDialog";


function getSumStorage(tables) {
    let sum = 0;
    for (var i = 0; i < tables.length; i++) {
        sum += Number(tables[i].table_size_mb);
    }
    return sum.toFixed(2);
}

export default function StorageResourcePage({ storage_tables, users }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenChooseDate, setOpenChooseDate] = useState(false);
    const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] = useState(false);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [action, setAction] = useState('');

    function requestCleanUpRecords() {
        setAction("cleanup-records");
        setIsOpenConfirmationDialog(true)
    }

    function requestSelectDay(date) {
        setDate(dayjs(date).format('YYYY-MM-DD'));
        setOpenChooseDate(false)
    }

    function submitAction() {
        router.post('/dashboard/manage/storage', { action: action, payload: { date: date, users: selectedUsers } }, {
            onStart: () => setIsLoading(true),
            onSuccess: () => {
                setIsOpenConfirmationDialog(false);
                setDate(dayjs().format('YYYY-MM-DD'));
                setSelectedUsers([]);
                router.reload({ only: ['storage_tables'] })
            },
            onFinish: () => setIsLoading(false),
        });
    }

    function addUserToCleanUp(uid) {
        setSelectedUsers((prev) => {
            let newUser = [...prev]
            return [...newUser, uid]
        })
    }

    function removeUserFromCleanUp(uid) {
        setSelectedUsers((prev) => {
            let newUser = [...prev]
            return newUser.filter((u) => uid !== u.id)
        })
    }

    return (
        <>
            <SideMenuBar />
            <div className="p-4 md:ml-64 min-h-screen pt-20">
                <h1>Speicherplatz Zusammenfassung</h1>
                <div className="my-4">
                    <div className="min-w-full border border-gray-200 rounded-t-xl shadow-sm">
                        <div className="grid grid-cols-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-t-xl">
                            <div className="px-4 py-2 border-r">Tabelle</div>
                            <div className="px-4 py-2 border-r text-center">Speicherplatz (Mb)</div>
                        </div>
                        {storage_tables.map((table, idx) => (
                            <div
                                key={'table-' + table.table_name}
                                className={`grid grid-cols-2 text-sm ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                                <div className="px-4 py-2 border-r font-medium">{table.table_name}</div>
                                <div className="px-4 py-2 border-r text-center">
                                    {table.table_size_mb}
                                </div>
                            </div>
                        ))}
                        <div className="px-4 py-2 bg-theme">
                            <h2 className="text-white">Gesamtspeicherplatz: <span className="font-bold text-theme-secondary">{getSumStorage(storage_tables)}</span> (Mb)</h2>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center gap-y-4">
                    <div className="flex items-center justify-center gap-x-4">
                        <div className="flex flex-col">
                            {/* <h2>Daten von Nutzer:</h2> */}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    Daten von Nutzer:
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedUsers(users)} key={"rest-user-all"}>Alle</DropdownMenuItem>
                                    {
                                        users
                                            .filter(user => !selectedUsers.some(taskUser => taskUser.id === user.id))
                                            .map((restUser, restUserInd) => {
                                                return <DropdownMenuItem onClick={() => addUserToCleanUp(restUser)} key={"rest-user" + restUserInd + restUser.id}>{restUser.name}</DropdownMenuItem>
                                            })
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className="max-h-[400px] overflow-y-auto flex flex-col">
                                {selectedUsers.map((sl_user, sl_user_ind) => {
                                    return (
                                        <button onClick={() => removeUserFromCleanUp(sl_user.id)} key={sl_user.name + sl_user.id} className="cursor-pointer px-2 py-1 my-1 w-auto rounded-sm md:rounded-full bg-theme-secondary text-white hover:bg-theme-secondary-highlight">{sl_user.name}</button>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <h2>beibehalten seit:</h2>
                            <Popover modal={true} open={isOpenChooseDate} onOpenChange={setOpenChooseDate}>
                                <PopoverTrigger asChild>
                                    <button
                                        className="w-full justify-start text-center font-normal border-2 rounded-lg border-theme"
                                    >
                                        <span>{dayjs(date).format("DD/MM/YYYY")}</span>
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <div className="sm:flex">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={requestSelectDay}
                                            initialFocus
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <button type="button"
                        disabled={isLoading || selectedUsers.length <= 0}
                        onClick={() => requestCleanUpRecords()}
                        className={`${isLoading || selectedUsers.length <= 0 ? "bg-gray-200 text-theme-secondary" : "bg-theme-secondary text-white hover:bg-theme-secondary-highlight hover:scale-90 focus-within:scale-90 focus-within:bg-theme-secondary-highlight"} w-fit self-center transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black text-lg`}
                    >
                        {isLoading ? "Laden..." : "Daten aufräumen"}
                    </button>

                    {/* <div>
                        <button type="button" className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                            Datenbank optimieren
                        </button>
                    </div> */}
                    {/* <button type="button" className="transition-all duration-200 px-2 py-1 cursor-pointer rounded-sm shadow-md shadow-black bg-theme-secondary text-white hover:bg-theme-secondary-highlight focus-within:bg-theme-secondary-highlight text-lg hover:scale-90 focus-within:scale-90">
                        + User
                    </button> */}
                </div>
            </div>
            <GenericConfirmationDialog isOpen={isOpenConfirmationDialog} setOpen={setIsOpenConfirmationDialog} confirmAction={submitAction} />
        </>
    )
}