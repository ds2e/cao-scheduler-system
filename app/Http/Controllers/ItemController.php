<?php

namespace App\Http\Controllers;

use App\Enums\ItemTypes;
use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Category;
use App\Models\ItemClass;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Item::class);

        // $query = Item::with('itemClass');
        $query = Item::query();
        $allCats = Category::all();
        $allItemClasses = ItemClass::all();

        if ($request->input('search')) {
            $search = trim($request->input('search', ''));
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%");

            $items = $query->paginate(10)->withQueryString(); // keep query string when paginating

            return inertia('Menu/Items', [
                'items' => $items,
                'allCats' => $allCats,
                'allItemClasses' => $allItemClasses,
                'filters' => $request->only('search'),
            ]);
        }

        // $items = Item::with('itemClass')
        //     ->orderBy('name', 'asc')
        //     ->paginate(10);
        // $items = Item::orderBy('name', 'asc')->paginate(10);
        $items = Item::where('type', ItemTypes::Normal)
             ->orderBy('name', 'asc')
             ->paginate(10);

        return inertia('Menu/Items', [
            'items' => $items,
            'allCats' => $allCats,
            'allItemClasses' => $allItemClasses
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
    public function store(StoreItemRequest $request)
    {
        $this->authorize('create', Item::class);

        $validated = $request->validated();

        $itemData = $validated['currentSelectedItemData'];

        Item::create($itemData);

        return back()->with('success', 'Item created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        $this->authorize('update', Item::class);

        $validated = $request->validated();

        $itemData = $validated['currentSelectedItemData'];

        $item = Item::findOrFail($itemData['id']);

        $item->name = $itemData['name'];
        $item->code = $itemData['code'];
        $item->item_class = $itemData['item_class'];
        $item->price = $itemData['price'];
        $item->category_id = $itemData['category_id'];

        $item->save();

        return back()->with('success', 'Item updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Item $item)
    {
        $this->authorize('delete', Item::class);

        $validated = Validator::make($request->all(), [
            'currentSelectedItemData.id' => ['required', 'integer', Rule::exists('mysql_waiter.items', 'id')]
        ])->validate();

        $itemData = $validated['currentSelectedItemData'];

        $item = Item::findOrFail($itemData['id']);
        $item->delete();

        return back()->with('success', 'Item deleted.');
    }
}
