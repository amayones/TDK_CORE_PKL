<?php

use App\Http\Controllers\Modules\MyProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:my-profile,can_view')->group(function () {
        Route::get('/my-profile', [MyProfileController::class, 'index']);
        Route::get('/my-profile/{id}', [MyProfileController::class, 'show']);
    });

    Route::middleware('menu.access:my-profile,can_create')->group(function () {
        Route::post('/my-profile', [MyProfileController::class, 'store']);
    });

    Route::middleware('menu.access:my-profile,can_edit')->group(function () {
        Route::put('/my-profile/{id}', [MyProfileController::class, 'update']);
        Route::post('/my-profile/{id}/activate', [MyProfileController::class, 'activate']);
    });

    Route::middleware('menu.access:my-profile,can_delete')->group(function () {
        Route::delete('/my-profile/{id}', [MyProfileController::class, 'destroy']);
    });
});