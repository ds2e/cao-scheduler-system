<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Master>
 */
class MasterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected static ?string $password;

    public function definition(): array
    {
        return [
            // 'password' => static::$password ??= Hash::make('D0nn3rB@lk3n')
            'password' => static::$password ??= Crypt::encryptString('D0nn3rB@lk3n')
        ];
    }
}
