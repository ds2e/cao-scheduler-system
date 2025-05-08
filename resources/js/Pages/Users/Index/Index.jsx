import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import mainLogo from '+/images/Cao_Laura_ohneText.png';

dayjs.extend(isBetween);

export default function UserProfile({ user, tasks }) {

    console.log(tasks)
    const now = dayjs();

    // Define month boundaries
    const startOfLastMonth = now.subtract(1, 'month').startOf('month');
    const endOfLastMonth = now.subtract(1, 'month').endOf('month');

    const startOfThisMonth = now.startOf('month');
    const endOfThisMonth = now.endOf('month');

    const startOfNextMonth = now.add(1, 'month').startOf('month');
    const endOfNextMonth = now.add(1, 'month').endOf('month');

    console.log(startOfLastMonth)

    // Filter tasks into 3 groups
    const lastMonthTasks = tasks.filter(task =>
        dayjs(task.date_start).isBetween(startOfLastMonth, endOfLastMonth, null, '[]')
    );

    const thisMonthTasks = tasks.filter(task =>
        dayjs(task.date_start).isBetween(startOfThisMonth, endOfThisMonth, null, '[]')
    );

    const nextMonthTasks = tasks.filter(task =>
        dayjs(task.date_start).isBetween(startOfNextMonth, endOfNextMonth, null, '[]')
    );

    return (
        <div className="p-4 sm:p-8 mt-16">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className='flex sm:justify-end justify-center'>
                    <img
                        alt="Cao Navbar Logo"
                        src={mainLogo}
                        className="min-h-[100px] max-h-[300px] object-fill aspect-square bg-theme rounded-full shadow-md shadow-black"
                    />
                </div>
                <div className='flex flex-col justify-center sm:text-start text-center'>
                    <h1 className='text-theme-secondary text-3xl font-bold'>{user.name}</h1>
                    <h2 className='text-xl'>({user.role.name})</h2>
                    <p className='text-gray-400'>{user.email}</p>
                </div>
            </div>
            <h3 className='text-theme text-xl font-semibold mb-4'>Tasks</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
                    <h4>Last month</h4>
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        {lastMonthTasks.length}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
                    <h4>This month</h4>
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        {thisMonthTasks.length}
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
                    <h4>Next month</h4>
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        {nextMonthTasks.length}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </p>
                </div>
            </div>
        </div>
    )
}