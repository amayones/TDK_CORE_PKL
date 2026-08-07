<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMenuAccess
{
    /**
     * Menu admin yang selalu terlindungi — GROUP_ADMIN selalu punya akses penuh.
     * Menu ini tidak bisa dikuburui karena penting untuk keamanan & manajemen sistem.
     */
    protected const PROTECTED_ADMIN_MENUS = [
        'dashboard',
        'user-management',
        'group-management',
        'menu-management',
        'menu-access-management',
        'system-setting',
        'audit-log',
    ];

    /**
     * Contoh penggunaan di route:
     * ->middleware('menu.access:user-management,can_view')
     */
    public function handle(Request $request, Closure $next, string $moduleKey, string $permission = 'can_view'): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        // GROUP_ADMIN selalu punya akses penuh ke menu admin yang terlindungi
        if ($user->isAdmin() && in_array($moduleKey, self::PROTECTED_ADMIN_MENUS)) {
            return $next($request);
        }

        // Untuk semua user (termasuk admin untuk menu non-protected),
        // cek berdasarkan record menu_access yang ada
        if (!$user->hasMenuAccess($moduleKey, $permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke modul ini.',
            ], 403);
        }

        return $next($request);
    }
}
