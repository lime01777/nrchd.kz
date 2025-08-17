<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TranslationAPIController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API маршруты для переводов
Route::prefix('translations')->group(function () {
    Route::get('/{language}', [TranslationAPIController::class, 'getTranslations']);
    Route::post('/translate', [TranslationAPIController::class, 'translate']);
    Route::post('/save', [TranslationAPIController::class, 'saveTranslations']);
});

// API маршруты для управления языками
Route::prefix('language')->group(function () {
    Route::post('/set', [TranslationAPIController::class, 'setLanguage']);
    Route::get('/current', [TranslationAPIController::class, 'getCurrentLanguage']);
});
