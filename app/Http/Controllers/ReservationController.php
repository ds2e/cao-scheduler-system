<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\Reservation;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $startDate = now()->subDays(2)->toDateString();
        $endDate = now()->addDays(3)->toDateString();
        $reservations = Reservation::whereBetween('date', [$startDate, $endDate])
            ->get();

        $user = Auth::user();
        $role = UserRoles::fromId($user->role_id);

        return match ($role) {
            UserRoles::Mitarbeiter => (function () use ($reservations) {
                return inertia('Reservation/UserReservation', [
                    'reservations' => $reservations
                ]);
            })(),

            UserRoles::Moderator, UserRoles::Admin, UserRoles::SuperAdmin => (function () use ($reservations) {
                return inertia('Reservation/Reservation', [
                    'reservations' => $reservations
                ]);
            })(),

            default => inertia('Error', ['status' => 406]),
        };
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationRequest $request, Reservation $reservation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        //
    }
}
