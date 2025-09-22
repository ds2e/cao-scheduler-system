<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Item;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ApiRestaurantController extends Controller
{
    public function index(Request $request)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !Str::startsWith($authHeader, 'Bearer ') || Str::after($authHeader, 'Bearer ') !== base64_encode(config('app.work_api_key'))) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $items = Item::all();
        $categories = Category::all();
        $tables = Table::all();

        return response()->json([
            'items' => $items,
            'categories' => $categories,
            'tables' => $tables
        ]);
    }
}
