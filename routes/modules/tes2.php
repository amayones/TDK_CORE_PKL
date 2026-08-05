<?php

use App\Http\Controllers\Modules\Tes2Controller;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:tes2,can_view')->group(function () {
        Route::get('/tes2', [Tes2Controller::class, 'index']);
        Route::get('/tes2/{id}', [Tes2Controller::class, 'show']);
    });

    Route::middleware('menu.access:tes2,can_create')->group(function () {
        Route::post('/tes2', [Tes2Controller::class, 'store']);
    });

    Route::middleware('menu.access:tes2,can_edit')->group(function () {
        Route::put('/tes2/{id}', [Tes2Controller::class, 'update']);
    });

    Route::middleware('menu.access:tes2,can_delete')->group(function () {
        Route::delete('/tes2/{id}', [Tes2Controller::class, 'destroy']);
    });
});