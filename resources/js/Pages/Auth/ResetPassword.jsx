import { useForm } from '@inertiajs/react';
import mainLogo from '+/images/Cao_Laura_ohneText.png'

export default function ResetPassword({ token, email: initialEmail }) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email: initialEmail || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 pt-14 lg:px-8 bg-theme">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src={mainLogo}
                    className="mx-auto h-36 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-theme-secondary">
                    Reset Password
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                readOnly
                                defaultValue={data.email}
                                disabled
                                // value={data.email}
                                // onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email"
                                className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base text-gray-600 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        {errors.email && <p className="mt-2 text-red-500">{errors.email}</p>}
                    </div>
                    <div className="flex sm:flex-row flex-col gap-4 justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="New Password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password_confirmation" className="block text-sm/6 font-medium text-white">
                                    Repeat Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm Password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                            {errors.password_confirmation && <p className="text-red-500">{errors.password_confirmation}</p>}
                        </div>
                    </div>

                    <button
                        type='submit'
                        disabled={processing}
                        className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {processing ? "Requesting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
