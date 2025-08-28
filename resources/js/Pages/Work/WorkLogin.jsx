import { Link, router, useForm } from "@inertiajs/react";
import mainLogo from '+/images/Cao_Laura_ohneText.png'

export default function WorkLoginPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        pin: '',
    })

    function requestLoginWork(e) {
        e.preventDefault();
        post('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls/login', {
            onSuccess: () => {
                reset();
                router.get('/dQ7mZ-pT9wKx2jR~aY3nF_6Ls/work');
            },
        });
    }

    return (
        <div className="flex flex-1 flex-col justify-center p-6 bg-theme">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src={mainLogo}
                    className="mx-auto h-36 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-theme-secondary">
                    Sign in to begin work
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {errors.error && <p className="my-2 text-center text-red-500">{errors.error}</p>}
                <form onSubmit={requestLoginWork} className="space-y-6">
                    <div>
                        <label htmlFor="pin" className="block text-sm/6 font-medium text-white">
                            PIN
                        </label>
                        <div className="mt-2">
                            <input
                                id="pin"
                                name="pin"
                                type="number"
                                maxLength={4}
                                required
                                value={data.pin}
                                onChange={(e) => setData('pin', e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                        {errors.pin && <p className="mt-2 text-red-500">{errors.pin}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="cursor-pointer flex w-full justify-center rounded-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {processing ? 'Signing... in' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}