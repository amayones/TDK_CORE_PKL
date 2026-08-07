<?php

use App\Http\Controllers\Modules\MyTaskController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:my-task,can_view')->group(function () {
        Route::get('/my-task', [MyTaskController::class, 'index']);
        Route::get('/my-task/{id}', [MyTaskController::class, 'show']);
    });

    Route::middleware('menu.access:my-task,can_create')->group(function () {
        Route::post('/my-task', [MyTaskController::class, 'store']);
    });

    Route::middleware('menu.access:my-task,can_edit')->group(function () {
        Route::put('/my-task/{id}', [MyTaskController::class, 'update']);
        Route::post('/my-task/{id}/complete', [MyTaskController::class, 'complete']);
    });

    Route::middleware('menu.access:my-task,can_delete')->group(function () {
        Route::delete('/my-task/{id}', [MyTaskController::class, 'destroy']);
    });
});