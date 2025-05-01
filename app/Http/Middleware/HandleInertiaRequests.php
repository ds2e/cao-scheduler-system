<?php

namespace App\Http\Middleware;

use App\Enums\UserRoles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        if (Auth::user()) {
            $roleEnum = UserRoles::fromId(Auth::user()->role_id);

            return array_merge(
                parent::share($request),
                [
                    'auth' => Auth::check() ? [
                        'user' => Auth::user() ? [
                            'uid' => Auth::user()->id,
                            'name' => Auth::user()->name,
                            'email' => Auth::user()->email,
                            'role' => Auth::user()->role_id ? [
                                'name' => $roleEnum->value,
                                'rank' => $roleEnum->rank(),
                            ] : [
                                'name' => UserRoles::User,
                                'rank' => UserRoles::User->rank()
                            ],
                        ] : null
                    ] : null
                ]
            );
        }

        return [];
    }
}
