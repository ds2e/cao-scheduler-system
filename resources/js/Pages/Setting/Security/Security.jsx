import { useForm, usePage } from "@inertiajs/react";
import SideMenuBar from "@/components/Navbar/SideMenuBar";
import { useState } from "react";

export default function SettingSecurityPage() {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors, transform } = useForm({
        email: auth.user.email || '',
        password: '',
        password_confirmation: '',
    });

    const [activePasswordReset, setActivePasswordReset] = useState(false);

    function confirmChangePassword() {
        transform((data) => ({
            targetData: { ...data },
            authorData: {
                id: auth.user.uid
            }
        }));
        post('/dashboard/setting/security/reset-password', {
            onSuccess: () => {
                setData({
                    email: auth.user.email || '',
                    password: '',
                    password_confirmation: '',
                })
                setActivePasswordReset(false);
            }
        });
    };

    const passwordTab = (!activePasswordReset) ?
        <div className="flex gap-x-4 items-center">
            <h2 htmlFor="current_password">Password</h2>
            <span>*********</span>
        </div>
        :
        <div className="flex flex-col gap-4 justify-between">
            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium">
                        Password
                    </label>
                </div>
                <div className="mt-2">
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="New Password"
                        className="block w-full md:w-48 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-theme sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password_confirmation" className="block text-sm/6 font-medium">
                        Repeat Password
                    </label>
                </div>
                <div className="mt-2">
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm Password"
                        className="block w-full md:w-48 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-theme sm:text-sm/6"
                    />
                </div>
                {errors['targetData.password'] && <p className="mt-2 text-red-500">{errors['targetData.password']}</p>}
            </div>
        </div>
        ;

    function toggleChangePassword() {
        setActivePasswordReset(prev => !prev)
    }

    return (
        <>
            <div className="antialiased bg-gray-50 dark:bg-gray-900">
                <SideMenuBar />

                <section className="p-4 md:ml-64 h-auto pt-20 min-h-screen flex flex-col justify-center gap-y-4">
                    <div className="flex flex-col xs:flex-row gap-x-4">
                        <h2 className="font-semibold">PIN</h2>
                        <span>{auth.user.PIN}</span>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-x-4">
                        <h2 className="font-semibold">Email</h2>
                        <span>{auth.user.email}</span>
                    </div>
                    <span className="border-t w-full border-gray-300 dark:border-gray-700"></span>
                    {passwordTab}
                    <div className="flex gap-x-4">
                        {activePasswordReset ?
                            <button
                                type="button"
                                onClick={() => confirmChangePassword()}
                                className="cursor-pointer flex justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-theme-secondary-highlight"
                            >
                                {processing ? "Saving..." : "Save"}
                            </button>
                            :
                            null
                        }
                        <button
                            type="button"
                            onClick={() => toggleChangePassword()}
                            className="cursor-pointer flex justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-theme-secondary-highlight"
                        >
                            {activePasswordReset ? "Cancel" : "Change Password"}
                        </button>
                    </div>
                    {
                        Object.keys(errors).length > 0 ?
                            <div className="space-y-1 h-10">
                                {Object.entries(errors).map(([field, message]) => (
                                    field !== 'targetData.password' ?
                                        <p className="text-red-500" key={field + "password"}>
                                            {message}
                                        </p>
                                        :
                                        null
                                ))}
                            </div>
                            :
                            null
                    }
                </section>
            </div>
        </>
    )
}