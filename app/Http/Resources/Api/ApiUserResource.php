<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApiUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $hasTaskToday = $this->tasks && $this->tasks->isNotEmpty();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'PIN' => $this->PIN,
            'email' => $this->email,
            'status' => $hasTaskToday ? 'Inactive' : 'Disabled',
        ];
    }
}
