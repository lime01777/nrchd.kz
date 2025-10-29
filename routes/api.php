<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\I18nController;
use App\Http\Controllers\FileController;

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

// Новые API маршруты для переводов (i18n система)
Route::prefix('i18n')->group(function () {
    Route::get('/', [I18nController::class, 'getDictionary']);
    Route::post('/ensure', [I18nController::class, 'ensureTranslations']);
    Route::get('/stats', [I18nController::class, 'getStats']);
});

// API маршруты для управления локалью
Route::post('/locale', [I18nController::class, 'setLocale']);
Route::get('/locale', [I18nController::class, 'getLocale']);

// API маршруты для переводов страниц
Route::get('/page-translations', [I18nController::class, 'getPageTranslations']);
Route::post('/page-translations', [I18nController::class, 'updatePageTranslations']);

// API маршруты для файлов
Route::get('/files', [FileController::class, 'getFiles']);
Route::get('/clinical-protocols', [FileController::class, 'getClinicalProtocols']);

// Маршруты для контактных форм
Route::post('/contact/tech-competence', [\App\Http\Controllers\ContactController::class, 'sendTechCompetenceForm']);

// API маршруты для молодежных центров здоровья (МЦЗ)
Route::prefix('youth-health-centers')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\YouthHealthCenterApiController::class, 'index']);
    Route::get('/regions', [\App\Http\Controllers\Api\YouthHealthCenterApiController::class, 'regions']);
});
