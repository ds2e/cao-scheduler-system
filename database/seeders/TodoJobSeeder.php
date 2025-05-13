<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\TodoJob;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodoJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $todos = Todo::factory(10)->create();
        
        TodoJob::factory(25)->make()->each(function ($job) use ($todos) {
            $job->todo_id = $todos->random()->id;
            $job->save();
        });
    }
}
