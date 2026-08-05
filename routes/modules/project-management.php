<?php

use App\Http\Controllers\Modules\ProjectController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:project-management,can_view')->group(function () {
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{id}', [ProjectController::class, 'show']);
    });

    Route::middleware('menu.access:project-management,can_create')->group(function () {
        Route::post('/projects', [ProjectController::class, 'store']);
    });

    Route::middleware('menu.access:project-management,can_edit')->group(function () {
        Route::put('/projects/{id}', [ProjectController::class, 'update']);
    });

    Route::middleware('menu.access:project-management,can_delete')->group(function () {
        Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    });
});