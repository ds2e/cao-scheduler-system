<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBillRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    // public function authorize(): bool
    // {
    //     return false;
    // }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tableId' => ['required', 'integer', Rule::exists('mysql_waiter.tables', 'id')],
            'orderId' => ['required', 'integer', Rule::exists('mysql_waiter.orders', 'id')],
            'itemsList' => ['required', 'array'], // ensure it's an array
            'itemsList.*.id' => ['required', 'integer', Rule::exists('mysql_waiter.items', 'id')],
            'itemsList.*.amount' => ['required', 'integer', 'min:1'],
            'itemsList.*.notice' => ['nullable', 'string', 'max:255'],
            'itemsList.*.type' => ['nullable', 'string', 'max:255'],
        ];
    }
}
