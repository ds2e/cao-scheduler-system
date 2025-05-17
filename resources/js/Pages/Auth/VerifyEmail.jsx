import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import mainLogo from '+/images/Cao_Laura_ohneText.png'

export default function VerifyEmail() {
    const { auth } = usePage().props;

    const [statusEmail, setStatusEmail] = useState(null);
    const { data, setData, post, processing, errors } = useForm({})

    function resendVerification() {
        post('/email/verification-notification', {
            onSuccess: () => {
                setStatusEmail(true);
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-y-4 px-6 pt-14 lg:px-8 bg-theme">
            <div className="text-center text-white space-y-4">
                <img
                    alt="Your Company"
                    src={mainLogo}
                    className="mx-auto h-36 w-auto"
                />
                <h1 className="text-2xl font-semibold">Ihre Email verifizieren</h1>
                <p>
                    Vielen Dank für Ihre Anmeldung! Den Link zur Best&auml;tigung haben wir Ihnen per <strong className='text-theme-secondary'>{auth.user.email}</strong> gesendet.
                </p>
                <p>
                    Sollten Sie die E-Mail nicht erhalten haben, senden wir Ihnen gerne eine neue zu.
                </p>

                {
                    statusEmail !== null ?
                        statusEmail == true ?
                            <div className="text-green-600">
                                Ein neuer Best&auml;tigungslink wurde an Ihre E-Mail-Adresse gesendet.
                            </div>
                            :
                            <div className="space-y-1">
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
            <button
                className="cursor-pointer flex self-center justify-center rounded-md bg-theme-secondary ml-3 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => resendVerification()}
                disabled={processing}
            >
                {processing ? 'Sending...' : 'Bestätigung erneut senden'}
            </button>
        </div>
    );
}