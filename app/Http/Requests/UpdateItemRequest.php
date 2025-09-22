<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateItemRequest extends FormRequest
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
            'currentSelectedItemData.id' => ['required', 'integer', Rule::exists('mysql_waiter.items', 'id')],
            'currentSelectedItemData.code' => ['nullable','string', 'max:255'],
            'currentSelectedItemData.name' => ['required', 'string', 'max:255'],
            'currentSelectedItemData.class' => ['nullable','string', 'max:255'],
            'currentSelectedItemData.price' => ['required', 'decimal:0,2'],
            'currentSelectedItemData.category_id' => ['required', 'integer', Rule::exists('mysql_waiter.categories', 'id')],
        ];
    }
}
