<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RestaurantMenuController extends Controller
{
    use AuthorizesRequests;

    public function showItemManageMenu()
    {
        $this->authorize('viewAny', Item::class);

        $items = Item::paginate(10);

        $allCats = Category::with('subCategories')->get();

        return inertia('Menu/Items', [
            'items' => $items,
            'allCats' => $allCats
        ]);
    }

    public function showCategoryManageMenu()
    {
        $this->authorize('viewAny', Category::class);

        $allCats = Category::with('subCategories')->get();

        return inertia('Menu/Categories', [
            'allCats' => $allCats
        ]);
    }
}
