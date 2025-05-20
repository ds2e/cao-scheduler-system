<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TodoController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $todos = Todo::all();

        return inertia('Todos/Todos', [
            'todos' => $todos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $user)
    {
        $this->authorize('create', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $user = Todo::create($validated);

        return back()->with('success', 'Todo created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo)
    {
        $this->authorize('view', $todo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'id' => ['required', 'integer', Rule::exists('todos', 'id')],
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string']
        ]);

        $todo = Todo::findOrFail($validated['id']);

        $todo->name = $validated['name'];
        $todo->description = $validated['description'];
        $todo->updated_at = now();

        $todo->save();

        return back()->with('success', 'Todo updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        $validated = $request->validate([
            'id' => ['required', 'integer', Rule::exists('todos', 'id')]
        ]);

        $todo = Todo::findOrFail($validated['id']);
        $todo->delete(); // ✅ This triggers model events

        return back()->with('success', 'Todo deleted.');
    }
}
