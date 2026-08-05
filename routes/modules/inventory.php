<?php

use App\Http\Controllers\Modules\InventoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:inventory,can_view')->group(function () {
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::get('/inventory/{id}', [InventoryController::class, 'show']);
    });

    Route::middleware('menu.access:inventory,can_create')->group(function () {
        Route::post('/inventory', [InventoryController::class, 'store']);
    });

    Route::middleware('menu.access:inventory,can_edit')->group(function () {
        Route::put('/inventory/{id}', [InventoryController::class, 'update']);
    });

    Route::middleware('menu.access:inventory,can_delete')->group(function () {
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);
    });
});