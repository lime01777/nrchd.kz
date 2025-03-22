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
