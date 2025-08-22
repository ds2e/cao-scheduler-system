import { Link, useForm, usePage } from "@inertiajs/react";
import mainLogo from '+/images/Cao_Laura_ohneText.png';

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DashboardNavbar({ auth }) {
    const { url } = usePage();

    const navigationItems = [
        { title: 'Zeitplan', href: '/dashboard/schedule' },
        { title: 'Reservierung', href: '/dashboard/reservation' }
    ]

    const navigation = [...navigationItems]
        .map(item => ({
            ...item,
            current: item.href === url,
        }));

    const { post, processing, errors } = useForm({});

    function requestLogout(e) {
        e.preventDefault();
        post('/logout');
    }

    return (
        <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 w-full z-50">
            <div className="mx-auto px-2 sm:px-6">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true" className="block size-6 group-data-open:hidden" fill="#fff">
                                <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" className="hidden size-6 group-data-open:block" fill="#fff">
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <Link href="/dashboard" className="flex shrink-0 items-center">
                            <img
                                alt="Cao Navbar Logo"
                                src={mainLogo}
                                className="h-10 w-auto"
                            />
                        </Link>
                        <div className="hidden sm:ml-6 sm:block place-content-center">
                            <div className="flex space-x-4">
                                {
                                    navigation.map((navMenu, navInd) => {
                                        return (
                                            <Link
                                                key={navMenu.title + navInd}
                                                href={navMenu.href}
                                                aria-current={navMenu.current ? 'page' : undefined}
                                                className={classNames(
                                                    navMenu.current
                                                        ? 'bg-gray-900 text-white'
                                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                            >
                                                {navMenu.title}
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true" className="size-6" fill="#fff">
                                <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
                            </svg>
                        </button>
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="cursor-pointer relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        alt="Profile Picture"
                                        src={mainLogo}
                                        className="size-10 border-[1px] border-white rounded-full bg-theme object-fill p-1"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <div className="px-4 py-2">
                                    <h2>{auth.user.name} {auth.user.role.name !== 'Mitarbeiter' && <span>({auth.user.role.name})</span>}</h2>
                                </div>

                                <MenuItem>
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Dashboard
                                    </Link>
                                </MenuItem>

                                <MenuItem>
                                    <Link
                                        href={`/dashboard/profile/${auth.user.uid}`}
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Profil
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        href="/dashboard/setting/security"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                    >
                                        Einstellung
                                    </Link>
                                </MenuItem>
                                <form onSubmit={requestLogout}>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="cursor-pointer flex w-full justify-center rounded-b-md bg-theme-secondary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-theme-secondary-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        {processing ? 'Processing...' : 'Ausloggen'}
                                    </button>
                                </form>

                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item, itemInd) => (
                        <DisclosureButton
                            key={item.title + itemInd}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.title}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}