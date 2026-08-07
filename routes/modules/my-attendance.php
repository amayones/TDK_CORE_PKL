<?php

use App\Http\Controllers\Modules\MyAttendanceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:my-attendance,can_view')->group(function () {
        Route::get('/my-attendance', [MyAttendanceController::class, 'index']);
        Route::get('/my-attendance/{id}', [MyAttendanceController::class, 'show']);
    });

    Route::middleware('menu.access:my-attendance,can_create')->group(function () {
        Route::post('/my-attendance', [MyAttendanceController::class, 'store']);
    });

    Route::middleware('menu.access:my-attendance,can_edit')->group(function () {
        Route::put('/my-attendance/{id}', [MyAttendanceController::class, 'update']);
        Route::post('/my-attendance/{id}/approve', [MyAttendanceController::class, 'approve']);
    });

    Route::middleware('menu.access:my-attendance,can_delete')->group(function () {
        Route::delete('/my-attendance/{id}', [MyAttendanceController::class, 'destroy']);
    });
});