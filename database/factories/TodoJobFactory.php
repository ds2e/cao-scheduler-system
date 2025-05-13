<?php

namespace Database\Factories;

use App\Models\Todo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TodoJob>
 */
class TodoJobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = fake()->dateTimeBetween('-3 days', '+5 days');

        return [
            'date' => $date->format('Y-m-d'),
            'todo_id' => Todo::factory(),
            'notice' => fake()->paragraphs(1, true),
        ];
    }
}
