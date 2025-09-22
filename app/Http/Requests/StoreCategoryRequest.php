<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            'currentSelectedCategoryData.name' => ['required', 'string', 'max:255'],
            'currentSelectedCategoryData.priority' => ['nullable','integer', 'min:0'],
            'currentSelectedCategoryData.sub_category_from' => ['nullable', 'integer', Rule::exists('mysql_waiter.categories', 'id')],
        ];
    }
}
