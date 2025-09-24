<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    { 
        $this->call([
            ItemClassSeeder::class,
            TableSeeder::class,
            CategorySeeder::class,
            ItemSeeder::class
        ]);
    }
}
