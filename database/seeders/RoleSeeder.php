<?php

namespace Database\Seeders;

use App\Enums\UserRoles;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (UserRoles::cases() as $role) {
            Role::firstOrCreate(['name' => $role->value]);
        }
    }  
}
