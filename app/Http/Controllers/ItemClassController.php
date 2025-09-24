<?php

namespace App\Http\Controllers;

use App\Models\ItemClass;
use App\Http\Requests\StoreItemClassRequest;
use App\Http\Requests\UpdateItemClassRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ItemClassController extends Controller
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', ItemClass::class);

        $itemClasses = ItemClass::all();

        return inertia('Menu/Tax', [
            'itemClasses' => $itemClasses
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', ItemClass::class);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemClassRequest $request)
    {
        $this->authorize('create', ItemClass::class);

        $validated = $request->validated();

        // $itemData = $validated['currentSelectedItemData'];

        ItemClass::create($validated);

        return back()->with('success', 'Tax class created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemClass $itemClass)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItemClass $itemClass)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemClassRequest $request, ItemClass $tax)
    {
        $this->authorize('update', ItemClass::class);
        $validated = $request->validated();

        $itemClassData = $validated['currentSelectedTaxClassData'];

        $tax = ItemClass::findOrFail($itemClassData['id']);

        $tax->name = $itemClassData['name'];
        $tax->rate = $itemClassData['rate'];

        $tax->save();

        return back()->with('success', 'Tax class updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ItemClass $tax)
    {
        $this->authorize('delete', ItemClass::class);

        $validated = Validator::make($request->all(), [
            'currentSelectedTaxClassData.id' => ['required', 'integer', Rule::exists('mysql_waiter.item_classes', 'id')]
        ])->validate();

        $taxData = $validated['currentSelectedTaxClassData'];

        $tax = ItemClass::findOrFail($taxData['id']);
        $tax->delete();

        return back()->with('success', 'Tax class deleted.');
    }
}
