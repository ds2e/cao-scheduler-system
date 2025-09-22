<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    private $defaultCategories = [
        // Level 1
        ["id" => 1, "name" => 'Speisen', "priority" => 1, "sub_category_from" => null],
        ["id" => 2, "name" => 'Getränke', "priority" => 2, "sub_category_from" => null],
        ["id" => 3, "name" => 'Sonstiges', "priority" => 3, "sub_category_from" => null],
        // Level 2
        // Getränke
        ["id" => 4, "name" => 'Cocktail', "priority" => 1, "sub_category_from" => 2],
        ["id" => 5, "name" => 'Wasser', "priority" => 5, "sub_category_from" => 2],
        ["id" => 6, "name" => 'Hausgemachte Getränke', "priority" => 3, "sub_category_from" => 2],
        ["id" => 7, "name" => 'Softdrink', "priority" => 7, "sub_category_from" => 2],
        ["id" => 8, "name" => 'Mocktail', "priority" => 6, "sub_category_from" => 2],
        ["id" => 9, "name" => 'Säfte & Necktare', "priority" => 8, "sub_category_from" => 2],
        ["id" => 10, "name" => 'Heiße Getränke', "priority" => 2, "sub_category_from" => 2],
        ["id" => 11, "name" => 'Bier', "priority" => 4, "sub_category_from" => 2],
        ["id" => 12, "name" => 'Wein', "priority" => 9, "sub_category_from" => 2],
        ["id" => 13, "name" => 'Prosecco', "priority" => 10, "sub_category_from" => 2],
        // Speisen
        ["id" => 14, "name" => 'Salate', "priority" => 6, "sub_category_from" => 1],
        ["id" => 15, "name" => 'Süppchen', "priority" => 5, "sub_category_from" => 1],
        ["id" => 16, "name" => 'Tapas', "priority" => 3, "sub_category_from" => 1],
        ["id" => 17, "name" => 'Bao Buns', "priority" => 1, "sub_category_from" => 1],
        ["id" => 18, "name" => 'Reis - Nudeln', "priority" => 2, "sub_category_from" => 1],
        ["id" => 19, "name" => 'Suppen', "priority" => 4, "sub_category_from" => 1],
        ["id" => 20, "name" => 'Süßes', "priority" => 7, "sub_category_from" => 1],
        // Sonstiges
        ["id" => 31, "name" => 'Snacks', "priority" => 1, "sub_category_from" => 3],
        // Level 3
        // Cocktail (id: 4)
        ["id" => 21, "name" => 'Flight Cocktails (Set)', "priority" => 5, "sub_category_from" => 4],
        ["id" => 22, "name" => 'Spritz / Spizz', "priority" => 2, "sub_category_from" => 4],
        ["id" => 23, "name" => 'Negroni', "priority" => 3, "sub_category_from" => 4],
        ["id" => 24, "name" => 'alte & neue Klassiker', "priority" => 4, "sub_category_from" => 4],
        ["id" => 25, "name" => 'SIGNATURE', "priority" => 1, "sub_category_from" => 4],
        // Hausgemachte Getränke
        ["id" => 26, "name" => 'Limo', "priority" => 1, "sub_category_from" => 6],
        ["id" => 27, "name" => 'Eistee', "priority" => 2, "sub_category_from" => 6],
        // Heiße Getränke
        ["id" => 28, "name" => 'Kaffee', "priority" => 3, "sub_category_from" => 10],
        ["id" => 29, "name" => 'Tee', "priority" => 1, "sub_category_from" => 10],
        ["id" => 30, "name" => 'Auf Güsse', "priority" => 2, "sub_category_from" => 10],
    ];

    public function run(): void
    {
        DB::connection('mysql_waiter')->table('categories')->insert($this->defaultCategories);
    }
}
