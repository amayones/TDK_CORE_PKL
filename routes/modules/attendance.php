<?php

use App\Http\Controllers\Modules\AttendanceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:attendance,can_view')->group(function () {
        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::get('/attendance/options', [AttendanceController::class, 'options']);
        Route::get('/attendance/{id}', [AttendanceController::class, 'show']);
    });

    Route::middleware('menu.access:attendance,can_create')->group(function () {
        Route::post('/attendance', [AttendanceController::class, 'store']);
    });

    Route::middleware('menu.access:attendance,can_edit')->group(function () {
        Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
        Route::post('/attendance/{id}/approve', [AttendanceController::class, 'approve']);
    });

    Route::middleware('menu.access:attendance,can_delete')->group(function () {
        Route::delete('/attendance/{id}', [AttendanceController::class, 'destroy']);
    });
});