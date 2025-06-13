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
        // Generate a date within a reasonable range
        $date = fake()->dateTimeBetween('-3 days', '+5 days')->format('Y-m-d');

        // Define boundaries
        $earliestStart = Carbon::createFromTime(7, 0);  // 07:00
        $latestStart = Carbon::createFromTime(15, 0);   // 15:00 (so 8h doesn't go past 23:00)

        // Random time_start between 07:00 and 15:00
        $timeStart = Carbon::createFromTime(
            fake()->numberBetween($earliestStart->hour, $latestStart->hour),
            fake()->numberBetween(0, 59),
            0
        );

        // Calculate maximum duration to not exceed 23:00
        $maxEndTime = Carbon::createFromTime(23, 0);
        $maxDurationMinutes = $maxEndTime->diffInMinutes($timeStart, true);

        // Constrain duration between 30 minutes and max allowed (480 = 8h)
        $minDuration = 60;
        $maxDuration = min(480, $maxDurationMinutes);

        // Generate duration
        $durationMinutes = fake()->numberBetween($minDuration, $maxDuration);

        // Set time_end
        $timeEnd = (clone $timeStart)->addMinutes($durationMinutes);

        // Compute duration in seconds
        $diffInSeconds = $timeStart->diffInSeconds($timeEnd, true);
        $duration = fake()->numberBetween(0, $diffInSeconds);

        return [
            'user_id' => User::factory(), // Will create a user if one isn't passed
            'date' => $date,
            'time_start' => $timeStart->format('H:i:s'),
            'time_end' => $timeEnd->format('H:i:s'),
            'duration' => $duration,
            'notice' => fake()->optional()->sentence(),
        ];
    }
}
