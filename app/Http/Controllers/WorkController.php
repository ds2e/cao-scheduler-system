<?php

namespace App\Http\Controllers;

use App\Enums\UserRoles;
use App\Models\Work;
use App\Http\Requests\StoreWorkRequest;
use App\Http\Requests\UpdateWorkRequest;
use App\Models\ReportRecord;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreWorkRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Work $work)
    {
        return inertia('Work/Home');
    }

    public function showWork(Work $work)
    {
        $user = Auth::user();
        $works = Work::with('user:id,name,PIN')->get();

        if (!$user) {
            return inertia('Work/Work', [
                'works' => $works,
            ]);
        }

        $role = UserRoles::fromId($user->role_id);

        return match ($role) {
            UserRoles::Admin, UserRoles::SuperAdmin => (function () use ($works) {
                // $today = Carbon::today()->toDateString();
                $users = User::whereIn('role_id', UserRoles::taskAssignable())->get();
                // Eager load tasks for today to reduce DB hits
                // $users->load(['tasks' => function ($query) use ($today) {
                //     $query->whereDate('date_start', $today);
                // }]);
                return inertia('Work/AdminWork', [
                    'users' => $users,
                    'works' => $works
                ]);
            })(),
            default => inertia('Work/Work', ['works' => $works])
        };
    }

    public function loginWork(Request $request)
    {
        // 1. Validate PIN
        $validated = Validator::make($request->all(), [
            'pin' => ['required', 'string'],
        ])->validate();

        $inputPIN = $validated['pin'];

        // 2. Find matching user by decrypting PIN
        $user = User::all()->first(function ($user) use ($inputPIN) {
            try {
                return $user->PIN === $inputPIN;
            } catch (\Exception $e) {
                return false; // decryption failed
            }
        });

        if (!$user) {
            return back()->withErrors(['pin' => 'Ungültige PIN.']);
        }

        // 3. Check if user has any task assigned for today
        $today = Carbon::today()->toDateString();

        $hasTaskToday = $user->tasks()
            ->whereDate('date_start', $today)
            ->exists();

        // who is making the request (authority user)
        $authorityUser = Auth::user();
        $authorityUserRole = $authorityUser ? UserRoles::fromId($authorityUser->role_id) : null;

        $bypassLoginCheck = in_array($authorityUserRole, [UserRoles::Admin, UserRoles::SuperAdmin]);

        if (!$hasTaskToday && !$bypassLoginCheck) {
            return back()->withErrors(['pin' => 'Das Einloggen für diesen Nutzer ist nicht erlaubt.']);
        }

        // 4. Check if already has a work entry today
        $today = Carbon::today()->format('Y-m-d');

        $alreadyAtWork = Work::where('user_id', $user->id)
            ->where('date', $today)
            ->exists();

        if ($alreadyAtWork) {
            return back()->withErrors(['pin' => 'Dieser Nutzer ist bereits eingeloggt.']);
        }

        // 5. Insert new Work record
        $now = Carbon::now();
        Work::create([
            'user_id'    => $user->id,
            'date'       => $now->format('Y-m-d'),
            'time_start' => $now->format('H:i:s'),
            'notice' => ''
        ]);

        return back()->with('success', 'Work started successfully!');
    }

    public function logoutWork(Request $request)
    {
        // 1. Validate PIN
        $validated = Validator::make($request->all(), [
            'pin' => ['required', 'string'],
        ])->validate();

        $inputPIN = $validated['pin'];

        // 2. Find matching user by PIN
        $user = User::all()->first(function ($user) use ($inputPIN) {
            try {
                return $user->PIN === $inputPIN;
            } catch (\Exception $e) {
                return false;
            }
        });

        if (!$user) {
            return back()->withErrors(['pin' => 'Invalid PIN.']);
        }

        // 3. Check if user has a work entry today
        $today = Carbon::today()->format('Y-m-d');

        $work = Work::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        if (!$work) {
            return back()->withErrors(['pin' => 'You are not currently checked in.']);
        }

        // 4. Calculate time_end and duration
        $timeStart = Carbon::parse($work->time_start);
        $timeEnd = Carbon::now();
        $durationInSeconds = $timeEnd->diffInSeconds($timeStart, true);

        // 5. Save ReportRecord
        $savedRecord = ReportRecord::create([
            'user_id'    => $user->id,
            'date'       => $work->date,
            'time_start' => $work->time_start,
            'time_end'   => $timeEnd->format('H:i:s'),
            'duration'   => $durationInSeconds,
            'notice'     => $work->notice,
        ]);

        // 6. Delete Work entry
        Work::where('user_id', $user->id)
            ->where('date', $today)
            ->delete();

        return back()->with('success', 'Work ended successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Work $work)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkRequest $request, Work $work)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Work $work)
    {
        //
    }
}
