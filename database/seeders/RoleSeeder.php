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
            Role::updateOrCreate(
                ['name' => $role->value],
                [
                    'rank' => $role->rank(),
                    'requires_confirmation' => $role->requiresConfirmation()
                ]
            );
        }
    }
}
