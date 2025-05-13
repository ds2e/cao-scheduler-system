<?php

namespace Database\Factories;

use App\Enums\UserRoles;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Role::class;

    public function definition(): array
    {
        $role = fake()->randomElement(UserRoles::cases());

        return [
            'name' => $role->value,
            'rank' => $role->rank(),
            'requires_confirmation' => $role->requiresConfirmation(),
        ];
    }
}
