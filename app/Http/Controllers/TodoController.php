<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
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
        $this->authorize('viewAny', Todo::class);

        $todos = Todo::all();

        return inertia('Todos/Todos', [
            'todos' => $todos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
        //
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
    public function update(Request $request, Todo $todo)
    {
        $this->authorize('update', $todo);

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
    public function destroy(Request $request, Todo $todo)
    {
        $this->authorize('delete', $todo);

        $validated = $request->validate([
            'id' => ['required', 'integer', Rule::exists('todos', 'id')]
        ]);

        $todo = Todo::findOrFail($validated['id']);
        $todo->delete(); // ✅ This triggers model events

        return back()->with('success', 'Todo deleted.');
    }
}
