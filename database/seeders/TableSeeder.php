<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
        private $defaultTables = [
        ["id" => 1, "name" => 'Table 1', "type" => 1],
        ["id" => 2, "name" => 'Table 2', "type" => 1],
        ["id" => 3, "name" => 'Table 3', "type" => 1],
        ["id" => 4, "name" => 'Table 4', "type" => 1],
        ["id" => 5, "name" => 'Table 5', "type" => 1],
        ["id" => 6, "name" => 'Table 6', "type" => 1],
        ["id" => 7, "name" => 'Table 7', "type" => 1],
        ["id" => 8, "name" => 'Table 8', "type" => 1],
        ["id" => 9, "name" => 'Table 9', "type" => 1],
        ["id" => 10, "name" => 'Table 10', "type" => 1],
        ["id" => 11, "name" => 'Table 11', "type" => 2],
        ["id" => 12, "name" => 'Table 12', "type" => 2],
        ["id" => 13, "name" => 'Table 13', "type" => 2],
        ["id" => 14, "name" => 'Table 14', "type" => 2],
        ["id" => 15, "name" => 'Table 15', "type" => 2],
        ["id" => 16, "name" => 'Table 16', "type" => 2],
        ["id" => 17, "name" => 'Table 17', "type" => 2],
        ["id" => 18, "name" => 'Table 18', "type" => 2],
        ["id" => 19, "name" => 'Table 19', "type" => 2],
        ["id" => 20, "name" => 'Table 20', "type" => 2],
        ["id" => 21, "name" => 'Table 21', "type" => 3],
        ["id" => 22, "name" => 'Table 22', "type" => 3],
        ["id" => 23, "name" => 'Table 23', "type" => 3],
    ];

    public function run(): void
    {
        DB::connection('mysql_waiter')->table('tables')->insert($this->defaultTables);
    }
}
