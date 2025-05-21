<?php

namespace Database\Factories;

use App\Enums\TaskCategories;
use App\Models\TaskCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaskCategory>
 */
class TaskCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category = fake()->randomElement(TaskCategories::cases());

        return [
            'name' => $category->value,
            'color' => $category->color(),
        ];
    }
}
