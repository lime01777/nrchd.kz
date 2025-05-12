<?php

use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\DocumentApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

// Маршруты для документов
Route::get('/documents/by-accordion/{accordionId}', [DocumentApiController::class, 'getByAccordionId']);

// Маршрут для получения файлов из storage
Route::get('/files', [\App\Http\Controllers\FileController::class, 'getFiles']);

// Маршрут для получения аккордеонов по маршруту страницы
Route::get('/accordions-for-page', [\App\Http\Controllers\FileController::class, 'getAccordionsForPage']);

// Маршрут для перевода текста через Google Translate API
Route::post('/translate', [\App\Http\Controllers\FixedTranslationController::class, 'translate']);

// Test endpoint for the translation API
Route::post('/test-translation', [\App\Http\Controllers\FixedTranslationController::class, 'testTranslation']);

// Маршрут для сохранения коллекции переводов
Route::post('/save-translations', [\App\Http\Controllers\FixedTranslationController::class, 'saveTranslations']);

// Маршруты для управления языком сайта
Route::post('/set-language', [\App\Http\Controllers\LanguageController::class, 'setLanguage']);
Route::post('/page-translations', [\App\Http\Controllers\LanguageController::class, 'getPageTranslations']);

// Маршрут для получения документов в табличном формате (для TabDocuments)
Route::get('/tabdocuments', [\App\Http\Controllers\FileController::class, 'getTabDocuments']);
