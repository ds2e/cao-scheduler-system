<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a date within a reasonable range
        $date = fake()->dateTimeBetween('-3 days', '+5 days')->format('Y-m-d');

        // Generate time_start between 17:00 and 22:00
        $hour = fake()->numberBetween(17, 21); // 21:59 is the latest valid start for a 2-hour slot
        $minute = fake()->numberBetween(0, 59);
        $timeStart = Carbon::createFromTime($hour, $minute, 0);

        // Add 30 to 120 minutes to time_start for time_end
        $durationMinutes = fake()->numberBetween(30, 120);
        $timeEnd = (clone $timeStart)->addMinutes($durationMinutes);

        $guest_num = fake()->numberBetween(1, 20);

        return [
            'name'=> fake()->name(),
            'number'=> $guest_num,
            'date' => $date,
            'time_start' => $timeStart->format('H:i:s'),
            'time_end' => $timeEnd->format('H:i:s'),
            'notice' => fake()->paragraphs(1, true),
        ];
    }
}
