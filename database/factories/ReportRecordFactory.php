<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReportRecord>
 */
class ReportRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Define limits for generation
        $earliestStart = Carbon::createFromTime(7, 0);  // 07:00
        $latestStart = Carbon::createFromTime(23, 0);   // latest start possible
        $minDuration = 30;                              // in minutes
        $maxDuration = 2 * 24 * 60;                     // 2 days = 2880 minutes

        // Generate a random start datetime (between -3 and +5 days)
        $dateStart = fake()->dateTimeBetween('-3 days', '+5 days');
        $timeStart = Carbon::instance($dateStart)
            ->setTime(
                fake()->numberBetween($earliestStart->hour, $latestStart->hour),
                fake()->numberBetween(0, 59),
                0
            );

        // Generate duration between 30 minutes and 2 days
        $durationMinutes = fake()->numberBetween($minDuration, $maxDuration);

        // Compute end datetime
        $endDateTime = (clone $timeStart)->addMinutes($durationMinutes);

        return [
            'user_id' => User::factory(),
            'date_start' => $timeStart->format('Y-m-d'),
            'time_start' => $timeStart->format('H:i:s'),
            'date_end' => $endDateTime->format('Y-m-d'),
            'time_end' => $endDateTime->format('H:i:s'),
            'duration' => $durationMinutes * 60, // store duration in seconds
            'notice' => fake()->optional()->sentence(),
        ];
    }
}
