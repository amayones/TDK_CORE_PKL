<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\GroupManagementController;
use App\Http\Controllers\Admin\MenuAccessManagementController;
use App\Http\Controllers\Admin\MenuManagementController;
use App\Http\Controllers\Admin\SystemSettingController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Modules\DashboardController;
use App\Http\Controllers\Modules\MenuController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/menu/sidebar', [MenuController::class, 'mySidebar']);

    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    Route::middleware('menu.access:user-management,can_view')->group(function () {
        Route::get('/admin/users', [UserManagementController::class, 'index']);
        Route::get('/admin/users/groups', [UserManagementController::class, 'groups']);
        Route::get('/admin/users/{id}', [UserManagementController::class, 'show']);
    });
    Route::middleware('menu.access:user-management,can_create')->group(function () {
        Route::post('/admin/users', [UserManagementController::class, 'store']);
    });
    Route::middleware('menu.access:user-management,can_edit')->group(function () {
        Route::put('/admin/users/{id}', [UserManagementController::class, 'update']);
    });
    Route::middleware('menu.access:user-management,can_delete')->group(function () {
        Route::delete('/admin/users/{id}', [UserManagementController::class, 'destroy']);
    });

    Route::middleware('menu.access:group-management,can_view')->group(function () {
        Route::get('/admin/groups', [GroupManagementController::class, 'index']);
        Route::get('/admin/groups/{id}', [GroupManagementController::class, 'show']);
    });
    Route::middleware('menu.access:group-management,can_create')->group(function () {
        Route::post('/admin/groups', [GroupManagementController::class, 'store']);
    });
    Route::middleware('menu.access:group-management,can_edit')->group(function () {
        Route::put('/admin/groups/{id}', [GroupManagementController::class, 'update']);
    });
    Route::middleware('menu.access:group-management,can_delete')->group(function () {
        Route::delete('/admin/groups/{id}', [GroupManagementController::class, 'destroy']);
    });

    Route::middleware('menu.access:menu-management,can_view')->group(function () {
        Route::get('/admin/menus', [MenuManagementController::class, 'index']);
        Route::get('/admin/menus/top-level', [MenuManagementController::class, 'topLevelOptions']);
        Route::get('/admin/menus/{id}', [MenuManagementController::class, 'show']);
    });
    Route::middleware('menu.access:menu-management,can_create')->group(function () {
        Route::post('/admin/menus', [MenuManagementController::class, 'store']);
    });
    Route::middleware('menu.access:menu-management,can_edit')->group(function () {
        Route::put('/admin/menus/{id}', [MenuManagementController::class, 'update']);
    });
    Route::middleware('menu.access:menu-management,can_delete')->group(function () {
        Route::delete('/admin/menus/{id}', [MenuManagementController::class, 'destroy']);
    });

    Route::middleware('menu.access:menu-access-management,can_view')->group(function () {
        Route::get('/admin/menu-access/groups', [MenuAccessManagementController::class, 'groups']);
        Route::get('/admin/menu-access/{groupId}/matrix', [MenuAccessManagementController::class, 'matrix']);
    });
    Route::middleware('menu.access:menu-access-management,can_edit')->group(function () {
        Route::put('/admin/menu-access/{groupId}', [MenuAccessManagementController::class, 'save']);
    });

    Route::middleware('menu.access:system-setting,can_view')->group(function () {
        Route::get('/admin/settings', [SystemSettingController::class, 'index']);
    });
    Route::middleware('menu.access:system-setting,can_create')->group(function () {
        Route::post('/admin/settings', [SystemSettingController::class, 'store']);
    });
    Route::middleware('menu.access:system-setting,can_edit')->group(function () {
        Route::put('/admin/settings/{id}', [SystemSettingController::class, 'update']);
    });
    Route::middleware('menu.access:system-setting,can_delete')->group(function () {
        Route::delete('/admin/settings/{id}', [SystemSettingController::class, 'destroy']);
    });

    Route::middleware('menu.access:audit-log,can_view')->group(function () {
        Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/admin/audit-logs/filter-options', [AuditLogController::class, 'filterOptions']);
        Route::get('/admin/audit-logs/{id}', [AuditLogController::class, 'show']);
    });
});

// Auto-load semua route module dari routes/modules/*.php
foreach (glob(__DIR__ . '/modules/*.php') as $moduleRouteFile) {
    require $moduleRouteFile;
}