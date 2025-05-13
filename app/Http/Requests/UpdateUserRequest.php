<?php

namespace App\Http\Requests;

use App\Enums\UserRoles;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    // public function authorize(): bool
    // {
    //     return false;
    // }


    public function rules(): array
    {
        return [
            'currentSelectedUserData.id' => ['required', 'integer', Rule::exists('users', 'id')],
            'currentSelectedUserData.name' => ['required', 'string', 'max:255'],
            'currentSelectedUserData.email' => ['required', 'email', 'max:255'],
            'currentSelectedUserData.PIN' => ['required', 'digits:4'],
            'currentSelectedUserData.role_id' => ['required', 'integer', Rule::exists('roles', 'id')],
            'authorData.id' => ['required', 'integer', Rule::exists('users', 'id')],
            // 'authorData.password' => ['required', 'string', 'min:8'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->sometimes('authorData.password', [
            'required',
            'string',
            'min:8',
            function ($attribute, $value, $fail) {
                $data = request()->all();
                $authorID = $data['authorData']['id'];
                $author = User::find($authorID);

                if (!$author || !Hash::check($value, $author->password)) {
                    $fail('Incorrect Credential!');
                }
            }
        ], function ($input) {
            $user = User::find($input->currentSelectedUserData['id']); // load user from DB

            if (!$user) {
                return false; // Let the 'id' rule handle this
            }

            $newRoleId = (int) $input->currentSelectedUserData['role_id'];
            $oldRoleId = (int) $user->role_id;

            $newRole = UserRoles::fromId($newRoleId);
            // $oldRole = UserRoles::fromId($oldRoleId);

            $isPromotion = $newRoleId > $oldRoleId;
            $isElevated = in_array($newRole, [UserRoles::Admin, UserRoles::SuperAdmin], true);

            return $isPromotion && $isElevated;
        });
    }

    public function messages(): array
    {
        return [
            'authorData.password.required' => 'Additional confirmation needed.',
        ];
    }
}
