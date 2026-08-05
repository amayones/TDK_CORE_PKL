<?php

use App\Http\Controllers\Modules\TesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:{{moduleKey}},can_view')->group(function () {
        Route::get('/{{moduleKey}}', [TesController::class, 'index']);
        Route::get('/{{moduleKey}}/{id}', [TesController::class, 'show']);
    });

    Route::middleware('menu.access:{{moduleKey}},can_create')->group(function () {
        Route::post('/{{moduleKey}}', [TesController::class, 'store']);
    });

    Route::middleware('menu.access:{{moduleKey}},can_edit')->group(function () {
        Route::put('/{{moduleKey}}/{id}', [TesController::class, 'update']);
    });

    Route::middleware('menu.access:{{moduleKey}},can_delete')->group(function () {
        Route::delete('/{{moduleKey}}/{id}', [TesController::class, 'destroy']);
    });
});