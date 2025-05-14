import dayjs from "dayjs";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";

export default function InspectDayTodoListDrawer({ isOpen, setOpen, todoJobs, todos, currentSelectedDate }) {
    const [formSubmitSuccess, setFormSubmitSuccess] = useState(null); // using extra field for form submission success because reset() in Inertia doesn't reset wasSuccessful nor isDirty
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        todoJobs: [],
        date: ''
    });

    useEffect(() => {
        setData({
            todoJobs: todoJobs,
            date: currentSelectedDate
        });

        return () => {
            clearErrors();
            setFormSubmitSuccess(null);
        }
    }, [currentSelectedDate, isOpen])

    function addTodoToDate(todoEntry) {
        const newTodos = [...data.todoJobs,
        {
            date: currentSelectedDate,
            notice: '',
            todo_id: todoEntry.id
        }]

        console.log(newTodos)

        setData({
            ...data,
            todoJobs: newTodos
        })
    }

    function removeTodoFromDate(jobInd) {
        const newTodos = data.todoJobs.filter((_, i) => i !== jobInd);
        setData({
            ...data,
            todoJobs: newTodos
        })
    }


    function handleAssignTodosDate(data) {
        // console.log(data);
        post('/dashboard/schedule/todo', {
            onSuccess: () => {
                setOpen(false);
                setFormSubmitSuccess(true);
            }
        });
    }


    // console.log(tasks)

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerContent className="bg-white">
                <DrawerHeader>
                    <DrawerTitle>Assign Todo</DrawerTitle>
                    <DrawerDescription>{dayjs(currentSelectedDate).format('DD.MM.YYYY')}</DrawerDescription>
                </DrawerHeader>

                <div className="w-full px-4 grid gap-y-2 place-content-center">
                    <div className="max-h-[70dvh] max-w-3xl overflow-y-auto">
                        <ul className="list-disc ps-8">
                            {data.todoJobs.map((job, jobInd) => {
                                return (
                                    <li key={(job.id) ? job.id + jobInd : 'new' + jobInd}>
                                        <span onClick={() => removeTodoFromDate(jobInd)} className="cursor-pointer text-theme hover:text-theme-highlight">{todos.find(todo => todo.id === job.todo_id)?.name}</span>
                                        <input
                                            type="text"
                                            value={data.todoJobs[jobInd].notice}
                                            onChange={(e) => {
                                                const updatedTodoJobs = [...data.todoJobs]
                                                updatedTodoJobs[jobInd].notice = e.target.value
                                                setData({
                                                    ...data,
                                                    todoJobs: updatedTodoJobs
                                                })
                                            }}
                                            className="text-theme-secondary ms-1 w-64 border-[1px] border-theme px-1"
                                        />
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        {formSubmitSuccess == null ?
                            (
                                <div className="space-y-1 overflow-y-auto h-10">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <p className="text-red-500 font-semibold" key={field}>
                                            {field}: {message}
                                        </p>
                                    ))}
                                </div>
                            )
                            :
                            (
                                <p className="text-green-500 font-semibold">
                                    Assign Day Tasks successfully!
                                </p>
                            )

                        }
                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer flex items-center gap-x-1 bg-theme rounded-full pe-2 py-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={30} height={30} className="fill-white">
                                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                                </svg>
                                <span className="text-white">Todo</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Available Todos</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {
                                    [...todos]
                                        .filter(todo => !data.todoJobs.some(job => job.todo_id === todo.id))
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((todo, todoInd) => {
                                            return <DropdownMenuItem onClick={() => addTodoToDate(todo)} key={"rest-Todo" + todo.id}>{todo.name}</DropdownMenuItem>
                                        })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <DrawerFooter className="w-full flex flex-row items-center justify-center gap-4">
                    <button disabled={processing} type="button" onClick={() => handleAssignTodosDate(data)} className={`rounded-full px-4 py-2 select-none ${(processing) ? "bg-muted text-theme" : "cursor-pointer bg-theme text-white hover:bg-theme-highlight"}`}>
                        {processing ? 'Submitting...' : 'Submit'}
                    </button>
                    <DrawerClose className='cursor-pointer text-theme-secondary rounded-full border-theme-secondary border-2 px-4 py-2 hover:bg-gray-100'>
                        Close
                    </DrawerClose>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    )
}