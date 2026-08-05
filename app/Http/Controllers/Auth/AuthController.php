<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('username', $validated['username'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Username atau password salah.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'username' => ['Akun Anda tidak aktif. Hubungi administrator.'],
            ]);
        }

        $user->load('group');

        $token = $user->createToken('tdk-core-pkl-token')->plainTextToken;

        AuditLog::record(
            action: 'LOGIN',
            module: 'auth',
            description: "User {$user->username} berhasil login"
        );

        return $this->success([
            'user'  => [
                'id'       => $user->id,
                'username' => $user->username,
                'name'     => $user->name,
                'email'    => $user->email,
                'group'    => [
                    'id'   => $user->group->id ?? null,
                    'code' => $user->group->code ?? null,
                    'name' => $user->group->name ?? null,
                ],
            ],
            'token' => $token,
        ], 'Login berhasil');
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $request->user()->currentAccessToken()->delete();

        AuditLog::record(
            action: 'LOGOUT',
            module: 'auth',
            description: "User {$user->username} logout"
        );

        return $this->success(null, 'Logout berhasil');
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('group');

        return $this->success([
            'id'       => $user->id,
            'username' => $user->username,
            'name'     => $user->name,
            'email'    => $user->email,
            'group'    => [
                'id'   => $user->group->id ?? null,
                'code' => $user->group->code ?? null,
                'name' => $user->group->name ?? null,
            ],
        ]);
    }
}