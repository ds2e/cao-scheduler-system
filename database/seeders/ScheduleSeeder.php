<?php

namespace Database\Seeders;

use App\Models\ReportRecord;
use App\Models\Task;
use App\Models\TaskCategory;
use App\Models\User;
use Carbon\Carbon;
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

        $assignedUsers = $users->random(rand(1, 3));

        // Attach random users to each task
        $tasks->each(function ($task) use ($assignedUsers) {

            $task->users()->attach($assignedUsers->pluck('id')->toArray());

            foreach ($assignedUsers as $user) {
                $date = fake()->dateTimeBetween('-3 days', '+5 days')->format('Y-m-d');

                // Generate valid time_start and time_end
                $earliestStart = Carbon::createFromTime(7, 0);
                $latestStart = Carbon::createFromTime(15, 0);

                $timeStart = Carbon::createFromTime(
                    fake()->numberBetween($earliestStart->hour, $latestStart->hour),
                    fake()->numberBetween(0, 59)
                );

                $maxEndTime = Carbon::createFromTime(23, 0);
                $maxDuration = min(480, $maxEndTime->diffInMinutes($timeStart, true));
                $durationMinutes = fake()->numberBetween(60, $maxDuration);
                $timeEnd = (clone $timeStart)->addMinutes($durationMinutes);

                // Convert to actual duration in seconds
                $diffInSeconds = $timeStart->diffInSeconds($timeEnd, true);
                $duration = fake()->numberBetween(0, $diffInSeconds);

                // -------------------------------------------------------
                // ✅ NEW: Calculate date_end using date_start + time_start + duration
                // -------------------------------------------------------

                // Combine date_start + time_start into a single Carbon instance
                $dateStartCarbon = Carbon::parse($date . ' ' . $timeStart->format('H:i:s'));

                // Apply duration to get the exact end datetime
                $dateEndCarbon = $dateStartCarbon->copy()->addSeconds($duration);

                // Split out the resulting date_end
                $dateEnd = $dateEndCarbon->format('Y-m-d');

                // -------------------------------------------------------

                ReportRecord::create([
                    'user_id' => $user->id,
                    'date_start' => $date,
                    'time_start' => $timeStart->format('H:i:s'),
                    'time_end' => $timeEnd->format('H:i:s'),
                    'duration' => $duration,
                    'date_end' => $dateEnd,
                    'notice' => "Task ID {$task->id} - " . fake()->optional()->sentence(),
                ]);
            }
        });
    }
}
