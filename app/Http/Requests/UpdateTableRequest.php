<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTableRequest extends FormRequest
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
            'currentSelectedTableData.id' => ['required', 'integer', Rule::exists('mysql_waiter.tables', 'id')],
            'currentSelectedTableData.name' => ['required', 'string', 'max:255'],
            'currentSelectedTableData.type' => ['nullable','integer', 'min:0']
        ];
    }
}
