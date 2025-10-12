<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
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
            'tableId' => [
                'required',
                'integer',
                Rule::exists('mysql_waiter.tables', 'id'),
            ],

            'itemsList' => ['nullable', 'array'],

            'itemsList.*.id' => [
                'required',
                function ($attribute, $value, $fail) {
                    if (!is_string($value) && !is_int($value)) {
                        $fail('The ' . $attribute . ' must be a string or integer.');
                    }

                    $index = explode('.', $attribute)[1];
                    $type = request("itemsList.$index.type");

                    if (
                        $type !== 'rogue' &&
                        !DB::connection('mysql_waiter')->table('items')->where('id', $value)->exists()
                    ) {
                        $fail("The selected item (id: $value) does not exist.");
                    }
                },
            ],

            'itemsList.*.amount' => ['nullable', 'integer', 'min:1'],
            'itemsList.*.notice' => ['nullable', 'string', 'max:255'],
            'itemsList.*.type' => ['required', 'string', Rule::in(['normal', 'rogue'])],

            // Rogue item-specific validations
            'itemsList.*.name' => [
                'required_if:itemsList.*.type,rogue',
                'string',
                'max:255',
            ],
            'itemsList.*.price' => [
                'required_if:itemsList.*.type,rogue',
                'numeric',
                'min:0',
            ],
        ];
    }
}
