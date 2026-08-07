<?php

use App\Http\Controllers\Modules\EvaluationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:evaluation,can_view')->group(function () {
        Route::get('/evaluation', [EvaluationController::class, 'index']);
        Route::get('/evaluation/options', [EvaluationController::class, 'options']);
        Route::get('/evaluation/{id}', [EvaluationController::class, 'show']);
    });

    Route::middleware('menu.access:evaluation,can_create')->group(function () {
        Route::post('/evaluation', [EvaluationController::class, 'store']);
    });

    Route::middleware('menu.access:evaluation,can_edit')->group(function () {
        Route::put('/evaluation/{id}', [EvaluationController::class, 'update']);
    });

    Route::middleware('menu.access:evaluation,can_delete')->group(function () {
        Route::delete('/evaluation/{id}', [EvaluationController::class, 'destroy']);
    });
});