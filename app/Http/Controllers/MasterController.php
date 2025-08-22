<?php

namespace App\Http\Controllers;

use App\Models\Master;
use App\Http\Requests\StoreMasterRequest;
use App\Http\Requests\UpdateMasterRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Crypt;

class MasterController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Master::class);

        $passwords = Master::all()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'password' => Crypt::decryptString($item->password),
                ];
            })
            ->values(); // reset keys to 0,1,2...

        return inertia('Devices/Devices', [
            'passwords' => $passwords
        ]);
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
    public function store(StoreMasterRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Master $master)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Master $master)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMasterRequest $request, Master $master)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Master $master)
    {
        //
    }
}
