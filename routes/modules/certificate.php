<?php

use App\Http\Controllers\Modules\CertificateController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::middleware('menu.access:certificate,can_view')->group(function () {
        Route::get('/certificate', [CertificateController::class, 'index']);
        Route::get('/certificate/options', [CertificateController::class, 'options']);
        Route::get('/certificate/{id}', [CertificateController::class, 'show']);
    });

    Route::middleware('menu.access:certificate,can_create')->group(function () {
        Route::post('/certificate', [CertificateController::class, 'store']);
    });

    Route::middleware('menu.access:certificate,can_edit')->group(function () {
        Route::put('/certificate/{id}', [CertificateController::class, 'update']);
        Route::post('/certificate/{id}/issue', [CertificateController::class, 'issue']);
    });

    Route::middleware('menu.access:certificate,can_delete')->group(function () {
        Route::delete('/certificate/{id}', [CertificateController::class, 'destroy']);
    });
});