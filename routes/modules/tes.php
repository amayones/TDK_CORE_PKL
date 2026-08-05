<?php

use App\Http\Controllers\Modules\TesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:tes,can_view')->group(function () {
        Route::get('/tes', [TesController::class, 'index']);
        Route::get('/tes/{id}', [TesController::class, 'show']);
    });

    Route::middleware('menu.access:tes,can_create')->group(function () {
        Route::post('/tes', [TesController::class, 'store']);
    });

    Route::middleware('menu.access:tes,can_edit')->group(function () {
        Route::put('/tes/{id}', [TesController::class, 'update']);
    });

    Route::middleware('menu.access:tes,can_delete')->group(function () {
        Route::delete('/tes/{id}', [TesController::class, 'destroy']);
    });
});