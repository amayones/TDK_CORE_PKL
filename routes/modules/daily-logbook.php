<?php

use App\Http\Controllers\Modules\DailyLogbookController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:daily-logbook,can_view')->group(function () {
        Route::get('/daily-logbook', [DailyLogbookController::class, 'index']);
        Route::get('/daily-logbook/{id}', [DailyLogbookController::class, 'show']);
    });

    Route::middleware('menu.access:daily-logbook,can_create')->group(function () {
        Route::post('/daily-logbook', [DailyLogbookController::class, 'store']);
    });

    Route::middleware('menu.access:daily-logbook,can_edit')->group(function () {
        Route::put('/daily-logbook/{id}', [DailyLogbookController::class, 'update']);
        Route::post('/daily-logbook/{id}/submit', [DailyLogbookController::class, 'submit']);
    });

    Route::middleware('menu.access:daily-logbook,can_delete')->group(function () {
        Route::delete('/daily-logbook/{id}', [DailyLogbookController::class, 'destroy']);
    });
});