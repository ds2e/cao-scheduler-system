<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Category::class);

        $allCats = Category::all();

        return inertia('Menu/Categories', [
            'allCats' => $allCats
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
    public function store(StoreCategoryRequest $request)
    {
        $this->authorize('create', Category::class);

        $validated = $request->validated();

        $categoryData = $validated['currentSelectedCategoryData'];

        Category::create($categoryData);

        return back()->with('success', 'Category created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('update', Category::class);

        $validated = $request->validated();

        $categoryData = $validated['currentSelectedCategoryData'];

        $category = Category::findOrFail($categoryData['id']);

        $category->name = $categoryData['name'];
        $category->priority = $categoryData['priority'];
        $category->sub_category_from = $categoryData['sub_category_from'];

        $category->save();

        return back()->with('success', 'Category updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category)
    {
        $this->authorize('delete', Category::class);

        $validated = Validator::make($request->all(), [
            'currentSelectedCategoryData.id' => ['required', 'integer', Rule::exists('mysql_waiter.categories', 'id')]
        ])->validate();

        $categoryData = $validated['currentSelectedCategoryData'];

        $category = Category::findOrFail($categoryData['id']);
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
