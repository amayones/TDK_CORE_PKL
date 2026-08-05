<?php

use App\Http\Controllers\Modules\TestingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:testing,can_view')->group(function () {
        Route::get('/testing', [TestingController::class, 'index']);
        Route::get('/testing/{id}', [TestingController::class, 'show']);
    });

    Route::middleware('menu.access:testing,can_create')->group(function () {
        Route::post('/testing', [TestingController::class, 'store']);
    });

    Route::middleware('menu.access:testing,can_edit')->group(function () {
        Route::put('/testing/{id}', [TestingController::class, 'update']);
    });

    Route::middleware('menu.access:testing,can_delete')->group(function () {
        Route::delete('/testing/{id}', [TestingController::class, 'destroy']);
    });
});