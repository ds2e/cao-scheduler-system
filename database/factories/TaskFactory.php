<?php

namespace Database\Factories;

use App\Models\TaskCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'time' => fake()->dateTimeBetween('-3 days', '+5 days')->format('Y-m-d'),
            'task_category_id' => TaskCategory::where('name', 'Bar')->first()->id,
            'description' => fake()->paragraphs(3, true),
        ];
    }
}
