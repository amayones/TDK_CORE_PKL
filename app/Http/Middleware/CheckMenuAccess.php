<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMenuAccess
{
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

        if ($user->isAdmin()) {
            return $next($request);
        }

        if (!$user->hasMenuAccess($moduleKey, $permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke modul ini.',
            ], 403);
        }

        return $next($request);
    }
}