<?php

namespace Database\Seeders;

use App\Enums\TaskCategories;
use App\Models\TaskCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (TaskCategories::cases() as $task_cat) {
            TaskCategory::firstOrCreate(['name' => $task_cat->value]);
        }
    }
}
