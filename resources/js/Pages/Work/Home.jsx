// import { Link, useForm } from "@inertiajs/react";
// import mainLogo from '+/images/Cao_Laura_ohneText.png'
// import WorkLayout from "../../Layouts/WorkLayout";

// const WorkHomePage = () => {

//     const { data, setData, post, processing, errors } = useForm({
//         PIN: '',
//     })

//     function requestLogin(e) {
//         e.preventDefault();
//         post('/login');
//     }

//     return (
//         <div className="flex min-h-screen flex-1 flex-col justify-center px-6 pt-14 lg:px-8 bg-theme">
//             <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//                 <img
//                     alt="Your Company"
//                     src={mainLogo}
//                     className="mx-auto h-36 w-auto"
//                 />
//                 <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-theme-secondary">
//                     Sign in to begin work
//                 </h2>
//             </div>

//             <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//                 {errors.error && <p className="my-2 text-center text-red-500">{errors.error}</p>}
//                 <form onSubmit={requestLogin} className="space-y-6">
//                     <div>
//                         <label htmlFor="PIN" className="block text-sm/6 font-medium text-white">
//                             PIN
//                         </label>
//                         <div className="mt-2">
//                             <input
//                                 id="PIN"
//                                 name="PIN"
//                                 type="text"
//                                 required
//                                 value={data.PIN}
//                                 onChange={(e) => setData('PIN', e.target.value)}
//                                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                             />
//                         </div>
//                         {errors.PIN && <p className="mt-2 text-red-500">{errors.PIN}</p>}
//                     </div>

//                     <div>
//                         <button
//                             type="submit"
//                             disabled={processing}
//                             className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                         >
//                             {processing ? 'Signing... in' : 'Sign in'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// WorkHomePage.layout = page => <WorkLayout children={page} />

// export default WorkHomePage;

import { useState } from "react";
import WorkHomeTab from "../../components/Navbar/WorkHomeTab";
import WorkLoginPage from "./WorkLogin";
import WorkLayout from "../../Layouts/WorkLayout";
import WorkLogoutPage from "./WorkLogout";

const WorkHomePage = () => {
    const [activeTab, setActiveTab] = useState("Login");

    function requestSwitchTab(tabName) {
        setActiveTab(tabName);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-16 px-4">
            {/* Tabs */}
            <WorkHomeTab activeTab={activeTab} requestSwitchTab={requestSwitchTab} />

            {/* Content */}
            <div className="w-full bg-white shadow-lg rounded-2xl p-6">
                {activeTab === "Login" ? (
                    <WorkLoginPage />
                ) : (
                    <WorkLogoutPage />
                )}
            </div>
        </div>
    );
}

WorkHomePage.layout = page => <WorkLayout children={page} />

export default WorkHomePage;