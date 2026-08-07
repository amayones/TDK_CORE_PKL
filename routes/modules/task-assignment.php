<?php

use App\Http\Controllers\Modules\TaskAssignmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:task-assignment,can_view')->group(function () {
        Route::get('/task-assignment', [TaskAssignmentController::class, 'index']);
        Route::get('/task-assignment/options', [TaskAssignmentController::class, 'options']);
        Route::get('/task-assignment/{id}', [TaskAssignmentController::class, 'show']);
    });

    Route::middleware('menu.access:task-assignment,can_create')->group(function () {
        Route::post('/task-assignment', [TaskAssignmentController::class, 'store']);
    });

    Route::middleware('menu.access:task-assignment,can_edit')->group(function () {
        Route::put('/task-assignment/{id}', [TaskAssignmentController::class, 'update']);
    });

    Route::middleware('menu.access:task-assignment,can_delete')->group(function () {
        Route::delete('/task-assignment/{id}', [TaskAssignmentController::class, 'destroy']);
    });
});