<?php

namespace App\Http\Controllers;

use App\Enums\ItemTypes;
use App\Enums\OrderStatuses;
use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Category;
use App\Models\Item;
use App\Models\ItemClass;
use App\Models\OrderItem;
use App\Models\Table;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $taxClasses = ItemClass::all();
        $categories = Category::with(['subCategories' => fn($q) => $q->orderBy('priority'), 'items'])
            ->whereNull('sub_category_from')
            ->orderBy('priority')
            ->get();

        // $tables = Table::all();

        // Load tables with their current orders and order items
        $tables = Table::with([
            'orders' => fn($q) => $q->where('status', OrderStatuses::Preparing)->latest()->limit(1)->with('orderItems.item')
        ])->get();

        // Transform tables to include only the latest order items
        $tablesWithOrders = $tables->map(fn($table) => [
            'id' => $table->id,
            'name' => $table->name,
            'order_id' => $table->orders->first()?->id,
            'storedOrders' => $table->orders->first()?->orderItems->map(fn($orderItem) => [
                'id' => $orderItem->item_id,
                'code' => $orderItem->item?->code,
                'name' => $orderItem->item?->name,
                'price' => $orderItem->item?->price,
                'amount' => $orderItem->amount,
                'item_class' => $orderItem->item?->item_class,
                'notice' => $orderItem->notice,
                'type' => $orderItem->item?->type,
            ]) ?? [],
        ]);

        return inertia('Order/Waiter', [
            'taxClasses' => $taxClasses,
            'tables' => $tablesWithOrders,
            'categories' => $categories
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
    // public function store(StoreOrderRequest $request)
    // {
    //     $validated = $request->validated();

    //     $tableId = $validated['tableId'];
    //     $itemsList = $validated['itemsList'] ?? [];

    //     DB::transaction(function () use ($tableId, $itemsList) {
    //         // Find the last order for this table (by latest created_at)
    //         $order = Order::where('table_id', $tableId)
    //             ->latest('created_at')
    //             ->first();

    //         // If there's no order OR the last one is already paid → create new
    //         if (!$order || $order->status === OrderStatuses::Paid) {
    //             $order = Order::create([
    //                 'table_id' => $tableId,
    //                 'status' => OrderStatuses::Preparing
    //             ]);
    //         }

    //         // Get existing order items for this order
    //         $existingItems = $order->orderItems()->get()->keyBy('item_id');

    //         // Prepare a list of item_ids from the request
    //         $incomingItemIds = collect($itemsList)->pluck('id')->filter()->all();

    //         // Delete removed items
    //         $itemsToDelete = $existingItems->keys()->diff($incomingItemIds);
    //         if ($itemsToDelete->isNotEmpty()) {
    //             OrderItem::where('order_id', $order->id)
    //                 ->whereIn('item_id', $itemsToDelete)
    //                 ->delete();
    //         }

    //         // Update or create items
    //         foreach ($itemsList as $item) {
    //             if (empty($item['id'])) continue; // skip invalid

    //             OrderItem::updateOrCreate(
    //                 [
    //                     'order_id' => $order->id,
    //                     'item_id' => $item['id']
    //                 ],
    //                 [
    //                     'amount' => $item['amount'] ?? 1,
    //                     'notice' => $item['notice'] ?? '',
    //                     'type' => $item['type'] ?? null
    //                 ]
    //             );
    //         }
    //     });

    //     return back()->with('success', 'Stored orders updated.');
    // }

    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $tableId = $validated['tableId'];
        $itemsList = $validated['itemsList'] ?? [];

        DB::transaction(function () use ($tableId, $itemsList) {
            // Find last order for this table
            $order = Order::where('table_id', $tableId)
                ->latest('created_at')
                ->first();

            if (!$order || $order->status === OrderStatuses::Paid) {
                $order = Order::create([
                    'table_id' => $tableId,
                    'status' => OrderStatuses::Preparing,
                ]);
            }

            // Existing order items
            $existingItems = $order->orderItems()->get()->keyBy('item_id');

            // Collect IDs from incoming list
            $incomingItemIds = collect($itemsList)->pluck('id')->filter()->all();

            // Delete removed items
            $itemsToDelete = $existingItems->keys()->diff($incomingItemIds);
            if ($itemsToDelete->isNotEmpty()) {
                OrderItem::where('order_id', $order->id)
                    ->whereIn('item_id', $itemsToDelete)
                    ->delete();
            }

            // Process each item
            foreach ($itemsList as $item) {
                if (empty($item['id']) && $item['type'] !== ItemTypes::Rogue->value) {
                    continue; // skip invalid unless rogue
                }

                // ⚡ Handle rogue item: create it in the Items table
                if (($item['type'] ?? null) === ItemTypes::Rogue->value) {
                    // You can customize these fields depending on your Item schema
                    $newItem = Item::create([
                        'code' => $item['code'] ?? null,
                        'name' => $item['name'] ?? 'Unnamed Rogue Item',
                        'price' => $item['price'] ?? 0,
                        'category_id' => $item['category_id'] ?? null,
                        'item_class' => $item['item_class'] ?? null,
                        'type' => ItemTypes::Rogue,
                    ]);

                    // Replace temp id with real item ID
                    $item['id'] = $newItem->id;
                }

                // Create or update order item
                OrderItem::updateOrCreate(
                    [
                        'order_id' => $order->id,
                        'item_id' => $item['id'],
                    ],
                    [
                        'amount' => $item['amount'] ?? 1,
                        'notice' => $item['notice'] ?? '',
                        'type' => $item['type'] ?? null,
                    ]
                );
            }
        });

        return back()->with('success', 'Stored orders updated.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
