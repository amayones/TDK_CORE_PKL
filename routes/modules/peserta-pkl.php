<?php

use App\Http\Controllers\Modules\PesertaPklController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:peserta-pkl,can_view')->group(function () {
        Route::get('/peserta-pkl', [PesertaPklController::class, 'index']);
        Route::get('/peserta-pkl/user-options', [PesertaPklController::class, 'userOptions']);
        Route::get('/peserta-pkl/{id}', [PesertaPklController::class, 'show']);
    });

    Route::middleware('menu.access:peserta-pkl,can_create')->group(function () {
        Route::post('/peserta-pkl', [PesertaPklController::class, 'store']);
    });

    Route::middleware('menu.access:peserta-pkl,can_edit')->group(function () {
        Route::put('/peserta-pkl/{id}', [PesertaPklController::class, 'update']);
    });

    Route::middleware('menu.access:peserta-pkl,can_delete')->group(function () {
        Route::delete('/peserta-pkl/{id}', [PesertaPklController::class, 'destroy']);
    });
});