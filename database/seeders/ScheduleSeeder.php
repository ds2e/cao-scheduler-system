<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\TaskCategory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = TaskCategory::all(); // Fetch the existing fixed ones

        // Create users
        $users = User::factory(3)->create();

        // Create tasks with random task_category_id
        $tasks = Task::factory(10)->make()->each(function ($task) use ($categories) {
            $task->task_category_id = $categories->random()->id;
            $task->save();
        });

        // Attach random users to each task
        $tasks->each(function ($task) use ($users) {
            $task->users()->attach(
                $users->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
    }
}
