<?php

namespace App\Http\Controllers;

use App\Models\TodoJob;
use App\Http\Requests\StoreTodoJobRequest;
use App\Http\Requests\UpdateTodoJobRequest;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreTodoJobRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TodoJob $job)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TodoJob $job)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTodoJobRequest $request, TodoJob $job)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TodoJob $job)
    {
        //
    }
}
