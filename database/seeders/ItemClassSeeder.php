<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    private $defaultItemClasses = [
        [
            "id" => 1,
            "name" => "A",
            "rate" => 7,
        ],
        [
            "id" => 2,
            "name" => "B",
            "rate" => 19,
        ],
        [
            "id" => 3,
            "name" => "C",
            "rate" => 0,
        ],
    ];
    public function run(): void
    {
        DB::connection('mysql_waiter')->table('item_classes')->insert($this->defaultItemClasses);
    }
}
