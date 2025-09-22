<?php

namespace App\Http\Controllers;

use App\Models\Table;
use App\Http\Requests\StoreTableRequest;
use App\Http\Requests\UpdateTableRequest;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TableController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Table::class);

        $tables = Table::all();

        return inertia('Menu/Tables', [
            'tables' => $tables
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
    public function store(StoreTableRequest $request)
    {
        $this->authorize('create', Table::class);

        $validated = $request->validated();

        $tableData = $validated['currentSelectedTableData'];

        Table::create($tableData);

        return back()->with('success', 'Table created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Table $table)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Table $table)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTableRequest $request, Table $table)
    {
        $this->authorize('update', Table::class);

        $validated = $request->validated();

        $tableData = $validated['currentSelectedTableData'];

        $table = Table::findOrFail($tableData['id']);

        $table->name = $tableData['name'];
        $table->type = $tableData['type'];

        $table->save();

        return back()->with('success', 'Table updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Table $table)
    {
        $this->authorize('delete', Table::class);

        $validated = Validator::make($request->all(), [
            'currentSelectedTableData.id' => ['required', 'integer', Rule::exists('mysql_waiter.tables', 'id')]
        ])->validate();

        $tableData = $validated['currentSelectedTableData'];

        $table = Table::findOrFail($tableData['id']);
        $table->delete();

        return back()->with('success', 'Table deleted.');
    }
}
