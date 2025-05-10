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
        $startDateTime = fake()->dateTimeBetween('-3 days', '+5 days');
        $maxEndDateTime = (clone $startDateTime)->modify('+8 hours');
        $endDateTime = fake()->dateTimeBetween($startDateTime, $maxEndDateTime);

        return [
            'date_start' => $startDateTime->format('Y-m-d'),
            'time_start' => $startDateTime->format('H:i:s'),
            'date_end' => $endDateTime->format('Y-m-d'),
            'time_end' => $endDateTime->format('H:i:s'),
            'task_category_id' => TaskCategory::where('name', 'Bar')->first()->id,
            'description' => fake()->paragraphs(1, true),
        ];
    }
}
