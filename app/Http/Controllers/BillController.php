<?php

namespace App\Http\Controllers;

use App\Enums\ItemTypes;
use App\Enums\OrderStatuses;
use App\Models\Bill;
use App\Http\Requests\StoreBillRequest;
use App\Http\Requests\UpdateBillRequest;
use App\Models\Item;
use App\Models\ItemClass;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class BillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {}

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
    public function store(StoreBillRequest $request)
    {
        $validated = $request->validated();

        $tableId = $validated['tableId'];
        $orderId = $validated['orderId'];
        $itemsList = $validated['itemsList'];

        DB::beginTransaction();

        try {
            // 1. Verify the order exists
            $order = Order::with('orderItems')->findOrFail($orderId);

            // 2. Create the bill
            $bill = Bill::create([
                'order_id' => $orderId,
                // 'table_id' => $tableId,
                // include other fields like total, created_by, etc. if applicable
            ]);

            // 3. Process each paid item
            foreach ($itemsList as $item) {
                $itemId = $item['id'];
                $paidAmount = $item['amount'];
                // $notice = $item['notice'];

                // Find matching order item
                $orderItem = $order->orderItems->firstWhere('item_id', $itemId);

                if (!$orderItem) {
                    throw new \Exception("Item ID {$itemId} not found in the order.");
                }

                // 3a. Check if enough amount is available to pay
                if ($paidAmount > $orderItem->amount) {
                    throw new \Exception("Cannot pay more than ordered for item ID {$itemId}.");
                }

                // 3b. Record in bill_items pivot
                $bill->billItems()->create([
                    'item_id' => $itemId,
                    'amount' => $paidAmount,
                ]);

                // 3c. Update order_items (reduce remaining amount)
                $remaining = $orderItem->amount - $paidAmount;

                if ($remaining > 0) {
                    $orderItem->update(['amount' => $remaining]);
                } else {
                    // Fully paid — delete or mark as paid
                    $orderItem->delete();
                }
            }

            // 4. If no more order items remain, mark order as 'Paid'
            $remainingItems = OrderItem::where('order_id', $orderId)->count();

            if ($remainingItems === 0) {
                $order->update(['status' => OrderStatuses::Paid]);
            }

            DB::commit();

            return back()->with('success', 'Bill is successfully stored.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('fail', 'Bill is fail to store.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Bill $bill)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bill $bill)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBillRequest $request, Bill $bill)
    {
        $validated = $request->validated();

        $tableId = $validated['tableId'];
        $orderId = $validated['orderId'];
        $itemsList = $validated['itemsList'];

        DB::beginTransaction();

        try {
            // 1. Verify the order exists
            $order = Order::with('orderItems')->findOrFail($orderId);

            // 3. Process each paid item
            foreach ($itemsList as $item) {
                $itemId = $item['id'];
                $paidAmount = $item['amount'];

                // Find matching order item
                $orderItem = $order->orderItems->firstWhere('item_id', $itemId);

                if (!$orderItem) {
                    throw new \Exception("Item ID {$itemId} not found in the order.");
                }

                // 3a. Check if enough amount is available to pay
                if ($paidAmount > $orderItem->amount) {
                    throw new \Exception("Cannot pay more than ordered for item ID {$itemId}.");
                }

                // 3c. Update order_items (reduce remaining amount)
                $remaining = $orderItem->amount - $paidAmount;

                if ($remaining > 0) {
                    $orderItem->update(['amount' => $remaining]);
                } else {
                    // Fully paid — delete or mark as paid
                    $orderItem->delete();
                }
            }

            // 4. If no more order items remain, mark order as 'Paid'
            $remainingItems = OrderItem::where('order_id', $orderId)->count();

            if ($remainingItems === 0) {
                $order->update(['status' => OrderStatuses::Paid]);
            }

            DB::commit();

            return back()->with('success', 'Bill is discarded.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('fail', 'Fail to remove current order items.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Bill $bill)
    {
        $validated = Validator::make($request->all(), [
            'currentSelectedBillData.id' => ['required', 'integer', Rule::exists('mysql_waiter.bills', 'id')]
        ])->validate();

        $billData = $validated['currentSelectedBillData'];

        $bill = Bill::findOrFail($billData['id']);
        $order = $bill->order;

        if (!$order) {
            return back()->withErrors(['error' => 'This bill is not linked to any order.']);
        }

        if ($order->status !== OrderStatuses::Paid) {
            return back()->withErrors(['error' => 'Only orders with status "Paid" can be deleted.']);
        }

        // Count how many bills are linked to this order
        $billCount = $order->bills()->count();

        if ($billCount > 1) {
            // There are other bills → just delete the current bill
            $bill->delete();
        } else {
            // No other bills → delete the order (cascades to this bill automatically)
            $order->delete();
        }

        return back()->with('success', 'Bill deleted successfully.');
    }

    public function showHistory(Request $request)
    {
        $taxClasses = ItemClass::all();
        $tables = Table::with([
            'orders' => function ($q) {
                $q->where('status', OrderStatuses::Paid)
                    ->orderByDesc('created_at')
                    ->with([
                        'bills.billItems.item',
                    ]);
            },
        ])
            ->orderBy('name') // or id if you prefer
            ->get();

        return inertia('Order/Tabs/History/HistoryTab', [
            'tables' => $tables,
            'taxClasses' => $taxClasses
        ]);
    }

    public function deleteHistory()
    {
        Item::where('type', ItemTypes::Rogue)->delete();
        DB::transaction(function () {

            // 1️⃣ Get all Paid orders
            Order::where('status', OrderStatuses::Paid)->delete();
        });

        // 2️⃣ Check if orders table is empty
        $ordersEmpty = Order::count() === 0;

        if ($ordersEmpty) {
            $tablesToOptimize = [
                'orders',
                'order_items',  // make sure this is your table name for order items
                'bills',
                'bill_items'
            ];

            foreach ($tablesToOptimize as $table) {
                DB::statement("OPTIMIZE TABLE {$table}");
            }
        }

        return back()->with('success', 'Paid orders history deleted successfully and tables optimized.');
    }
}
