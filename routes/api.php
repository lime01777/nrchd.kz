<?php

use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\DocumentApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

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

// Маршрут для получения клинических протоколов из JSON-файла
Route::get('/clinical-protocols', [\App\Http\Controllers\FileController::class, 'getClinicalProtocols']);

// Маршрут для получения аккордеонов по маршруту страницы
Route::get('/accordions-for-page', [\App\Http\Controllers\FileController::class, 'getAccordionsForPage']);

// Маршрут для перевода текста через Google Translate API
Route::post('/translate', [\App\Http\Controllers\FixedTranslationController::class, 'translate']);

// Маршрут для быстрых переводов из БД
Route::post('/translate-batch', [\App\Http\Controllers\TranslationController::class, 'translateBatch']);

// Маршруты для файлового менеджера
Route::post('/file-manager/browse', [\App\Http\Controllers\FileManagerController::class, 'browse']);
Route::post('/file-manager/upload', [\App\Http\Controllers\FileManagerController::class, 'upload']);
Route::post('/file-manager/create-folder', [\App\Http\Controllers\FileManagerController::class, 'createFolder']);
Route::delete('/file-manager/delete', [\App\Http\Controllers\FileManagerController::class, 'delete']);

// Test endpoint for the translation API
Route::post('/test-translation', [\App\Http\Controllers\FixedTranslationController::class, 'testTranslation']);

// Маршрут для сохранения коллекции переводов
Route::post('/save-translations', [\App\Http\Controllers\FixedTranslationController::class, 'saveTranslations']);

// Маршруты для управления языком сайта
Route::post('/set-language', [\App\Http\Controllers\LanguageController::class, 'setLanguage']);
Route::post('/page-translations', [\App\Http\Controllers\LanguageController::class, 'getPageTranslations']);

// Маршрут для получения документов в табличном формате (для TabDocuments)
Route::get('/tabdocuments', [\App\Http\Controllers\FileController::class, 'getTabDocuments']);

// Маршруты для системы автоматического перевода
Route::post('/auto-translate', [\App\Http\Controllers\AutoTranslationController::class, 'translate']);
Route::post('/auto-translate/bulk', [\App\Http\Controllers\AutoTranslationController::class, 'bulkTranslate']);
Route::post('/auto-translate/update', [\App\Http\Controllers\AutoTranslationController::class, 'updateTranslation']);

// Новые маршруты для улучшенной системы перевода
Route::post('/v2/translate', [\App\Http\Controllers\API\TranslationAPIController::class, 'translate']);
Route::post('/v2/set-language', [\App\Http\Controllers\API\TranslationAPIController::class, 'setLanguage']);
Route::post('/v2/get-translations', [\App\Http\Controllers\API\TranslationAPIController::class, 'getTranslations']);

// Маршруты API для админки переводов
Route::group(['prefix' => 'admin/translations', 'middleware' => ['auth']], function () {
    Route::get('/stats', [\App\Http\Controllers\Admin\TranslationManagerController::class, 'getStats']);
    Route::get('/site-urls', [\App\Http\Controllers\Admin\TranslationManagerController::class, 'getSiteUrls']);
    Route::post('/translate-page', [\App\Http\Controllers\Admin\TranslationManagerController::class, 'translatePage']);
    Route::post('/clear', [\App\Http\Controllers\Admin\TranslationManagerController::class, 'clearTranslations']);
});
Route::post('/auto-translate/delete', [\App\Http\Controllers\AutoTranslationController::class, 'deleteTranslation']);
Route::get('/auto-translate', [\App\Http\Controllers\AutoTranslationController::class, 'getTranslation']);
Route::get('/auto-translate/content', [\App\Http\Controllers\AutoTranslationController::class, 'getContentTranslations']);

// Маршруты для обработки форм
Route::post('/forms/submit', [\App\Http\Controllers\FormController::class, 'submitForm']);
Route::post('/forms/contact', [\App\Http\Controllers\FormController::class, 'contactForm']);
Route::post('/forms/accreditation', [\App\Http\Controllers\FormController::class, 'accreditationForm']);
Route::post('/forms/service', [\App\Http\Controllers\FormController::class, 'serviceRequestForm']);

// Маршрут для получения последних новостей
Route::get('/latest-news', [\App\Http\Controllers\NewsController::class, 'getLatestNews']);

// Маршрут для получения изображений из библиотеки
Route::get('/library-images', [\App\Http\Controllers\ImageLibraryController::class, 'getImages']);

Route::post('/editor-upload', function (Request $request) {
    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $path = $file->store('editorjs', 'public');
        $url = Storage::url($path);
        return response()->json([
            'success' => 1,
            'file' => [
                'url' => $url
            ]
        ]);
    }
    return response()->json(['success' => 0, 'message' => 'No file uploaded'], 400);
});

// API для файлового менеджера изображений
Route::get('/admin/images', function () {
    $imagesPath = public_path('storage/news');
    $images = [];
    
    if (is_dir($imagesPath)) {
        $files = scandir($imagesPath);
        
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $filePath = $imagesPath . '/' . $file;
                
                // Проверяем, что это изображение
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
                
                if (in_array($extension, $imageExtensions) && is_file($filePath)) {
                    $images[] = [
                        'name' => $file,
                        'path' => '/storage/news/' . $file,
                        'size' => filesize($filePath),
                        'modified' => filemtime($filePath)
                    ];
                }
            }
        }
        
        // Сортируем по дате изменения (новые сначала)
        usort($images, function($a, $b) {
            return $b['modified'] - $a['modified'];
        });
    }
    
    return response()->json([
        'success' => true,
        'images' => $images
    ]);
})->middleware('auth');
