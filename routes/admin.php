<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\News;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\OtzApplicationController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\MedTechController;
use App\Http\Controllers\Admin\GlossaryController;
use App\Http\Controllers\DocumentManagerController;
use App\Http\Controllers\Admin\StorageBrowserController;
use App\Http\Controllers\Admin\ImageLibraryController;
use App\Http\Controllers\Admin\VacancyController as AdminVacancyController;
use App\Http\Controllers\Admin\VacancyApplicationController;
use App\Http\Controllers\Admin\ContactApplicationController;
use App\Http\Controllers\Admin\ClinicController;
use App\Http\Controllers\Admin\YouthHealthCenterController;

Route::prefix('admin')->middleware(['auth', 'verified'])->name('admin.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    })->name('index');

    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Управление комментариями
    Route::middleware('permission:comments')->group(function () {
        Route::get('/comments', [App\Http\Controllers\Admin\CommentController::class, 'index'])->name('comments.index');
        Route::post('/comments/{comment}/approve', [App\Http\Controllers\Admin\CommentController::class, 'approve'])->name('comments.approve');
        Route::post('/comments/{comment}/unapprove', [App\Http\Controllers\Admin\CommentController::class, 'unapprove'])->name('comments.unapprove');
        Route::delete('/comments/{comment}', [App\Http\Controllers\Admin\CommentController::class, 'destroy'])->name('comments.destroy');
    });

    // AI Ассистент
    Route::middleware('permission:assistant')->group(function () {
        Route::get('/assistant', [App\Http\Controllers\Admin\AssistantController::class, 'index'])->name('assistant.index');
        Route::post('/assistant/chat', [App\Http\Controllers\Admin\AssistantController::class, 'chat'])->name('assistant.chat');
        Route::post('/assistant/delete-doc/{techId}', [App\Http\Controllers\Admin\AssistantController::class, 'deleteDocument'])->name('assistant.delete-doc');
        Route::post('/assistant/upload-doc/{techId}', [App\Http\Controllers\Admin\AssistantController::class, 'uploadDocument'])->name('assistant.upload-doc');
    });

    // Реестр технологий здравоохранения (РТЗ)
    Route::prefix('registry')->name('registry.')->middleware('permission:registry')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\HealthTechnologyRecordController::class, 'dashboard'])->name('dashboard');
        Route::get('/export', [\App\Http\Controllers\Admin\HealthTechnologyRecordController::class, 'export'])->name('export');

        Route::get('/', [\App\Http\Controllers\Admin\HealthTechnologyRecordController::class, 'index'])->name('index');
        Route::post('/upload', [\App\Http\Controllers\Admin\HealthTechnologyRecordController::class, 'uploadFile'])->name('upload');
        Route::post('/', [\App\Http\Controllers\Admin\HealthTechnologyRecordController::class, 'store'])->name('store');
        Route::put('/{id}', [\App\Http\Controllers\Admin\HealthTechnologyRecordController::class, 'update'])->name('update');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\HealthTechnologyRecordController::class, 'destroy'])->name('destroy');
    });

    // Клинические протокола ИИ
    Route::middleware('permission:ai_protocols')->group(function () {
        Route::get('/ai-protocols', [App\Http\Controllers\Admin\AiProtocolAnalysisController::class, 'index'])->name('ai-protocols.index');
        Route::post('/ai-protocols', [App\Http\Controllers\Admin\AiProtocolAnalysisController::class, 'store'])->name('ai-protocols.store');
        Route::post('/ai-protocols/{id}/analyze', [App\Http\Controllers\Admin\AiProtocolAnalysisController::class, 'analyze'])->name('ai-protocols.analyze');
        Route::get('/ai-protocols/{id}/download/{type}', [App\Http\Controllers\Admin\AiProtocolAnalysisController::class, 'download'])->name('ai-protocols.download');
        Route::delete('/ai-protocols/{id}', [App\Http\Controllers\Admin\AiProtocolAnalysisController::class, 'destroy'])->name('ai-protocols.destroy');
    });
    
    // Управление новостями (с политикой доступа)
    Route::middleware('permission:news|media')->group(function () {
        Route::get('/news/{type?}', [App\Http\Controllers\Admin\NewsController::class, 'index'])
            ->where('type', implode('|', News::TYPES))
            ->name('news.index');
        Route::get('news/create/{section?}', [App\Http\Controllers\Admin\NewsController::class, 'create'])
            ->whereIn('section', ['news', 'media'])
            ->can('create', News::class)
            ->name('news.create');
        Route::post('/news', [App\Http\Controllers\Admin\NewsController::class, 'store'])
            ->can('create', News::class)
            ->name('news.store');
        Route::get('/news/export-views', [App\Http\Controllers\Admin\NewsController::class, 'exportViews'])
            ->name('news.export-views');
        Route::get('/news/{news}/edit', [App\Http\Controllers\Admin\NewsController::class, 'edit'])->name('news.edit');
        Route::put('/news/{news}', [App\Http\Controllers\Admin\NewsController::class, 'update'])->name('news.update');
        Route::delete('/news/{news}', [App\Http\Controllers\Admin\NewsController::class, 'destroy'])->name('news.destroy');
        Route::patch('/news/{news}/toggle-status', [App\Http\Controllers\Admin\NewsController::class, 'toggleStatus'])->name('news.toggle');
    });
    
    // Управление медиа новостей
    Route::post('/news/upload-media', [App\Http\Controllers\Admin\NewsController::class, 'uploadMediaFiles'])->name('news.upload-media');
    Route::post('/news/{newsId}/media', [App\Http\Controllers\Admin\NewsController::class, 'uploadMedia'])->name('news.media.upload');
    Route::patch('/news/{newsId}/media/order', [App\Http\Controllers\Admin\NewsController::class, 'updateMediaOrder'])->name('news.media.order');
    Route::delete('/news/{newsId}/media/{mediaId}', [App\Http\Controllers\Admin\NewsController::class, 'deleteMedia'])->name('news.media.delete');
    Route::patch('/news/{newsId}/cover/{mediaId}', [App\Http\Controllers\Admin\NewsController::class, 'setCover'])->name('news.cover.set');
    Route::delete('/news/media/temp', [App\Http\Controllers\Admin\NewsController::class, 'deleteTemporaryMedia'])->name('news.media.temp-delete');

    // Управление заявками ОТЗ
    Route::middleware('permission:otz_applications')->group(function () {
        Route::resource('otz-applications', App\Http\Controllers\Admin\OtzApplicationController::class, [
            'names' => 'otz-applications'
        ]);
        Route::post('/otz-applications/{otzApplication}/upload-documents', [App\Http\Controllers\Admin\OtzApplicationController::class, 'uploadDocuments'])->name('otz-applications.upload-documents');
        Route::delete('/otz-applications/{otzApplication}/delete-document', [App\Http\Controllers\Admin\OtzApplicationController::class, 'deleteDocument'])->name('otz-applications.delete-document');
    });

    // Управление документами
    Route::middleware('permission:documents')->group(function () {
        Route::get('/documents', [App\Http\Controllers\Admin\DocumentController::class, 'index'])->name('documents');
        Route::get('/documents/create', [App\Http\Controllers\Admin\DocumentController::class, 'create'])->name('documents.create');
        Route::post('/documents', [App\Http\Controllers\Admin\DocumentController::class, 'store'])->name('documents.store');
        Route::get('/documents/{id}/edit', [App\Http\Controllers\Admin\DocumentController::class, 'edit'])->name('documents.edit');
        Route::put('/documents/{id}', [App\Http\Controllers\Admin\DocumentController::class, 'update'])->name('documents.update');
        Route::delete('/documents/{id}', [App\Http\Controllers\Admin\DocumentController::class, 'destroy'])->name('documents.destroy');
    });

    // Управление пользователями
    Route::middleware('permission:users')->group(function () {
        Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users');
        Route::get('/users/create', [App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
        Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
        Route::get('/users/{id}/edit', [App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
        Route::patch('/users/{user}/role', [App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('users.update-role');
        Route::delete('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    });

    // Логи действий
    Route::middleware('permission:logs')->group(function () {
        Route::get('/logs', [App\Http\Controllers\Admin\LogController::class, 'index'])->name('logs.index');
    });

    // Настройки
    Route::middleware('permission:settings')->group(function () {
        Route::get('/settings', [App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings');
        Route::put('/settings', [App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
        Route::post('/settings/backup', [App\Http\Controllers\Admin\SettingController::class, 'createBackup'])->name('settings.backup');
    });
    
    // Платформа MedTech
    Route::prefix('medtech')->name('medtech.')->middleware('permission:medtech')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\MedTechController::class, 'index'])->name('index');
        
        // Документы
        Route::get('/documents', [App\Http\Controllers\Admin\MedTechController::class, 'documents'])->name('documents');
        Route::get('/documents/create', [App\Http\Controllers\Admin\MedTechController::class, 'createDocument'])->name('documents.create');
        Route::post('/documents', [App\Http\Controllers\Admin\MedTechController::class, 'storeDocument'])->name('documents.store');
        Route::get('/documents/{document}/edit', [App\Http\Controllers\Admin\MedTechController::class, 'editDocument'])->name('documents.edit');
        Route::put('/documents/{document}', [App\Http\Controllers\Admin\MedTechController::class, 'updateDocument'])->name('documents.update');
        Route::delete('/documents/{document}', [App\Http\Controllers\Admin\MedTechController::class, 'destroyDocument'])->name('documents.destroy');
        
        // Реестр технологий
        Route::get('/registry', [App\Http\Controllers\Admin\MedTechController::class, 'registry'])->name('registry');
        Route::get('/registry/create', [App\Http\Controllers\Admin\MedTechController::class, 'createRegistry'])->name('registry.create');
        Route::post('/registry', [App\Http\Controllers\Admin\MedTechController::class, 'storeRegistry'])->name('registry.store');
        Route::get('/registry/{registry}/edit', [App\Http\Controllers\Admin\MedTechController::class, 'editRegistry'])->name('registry.edit');
        Route::put('/registry/{registry}', [App\Http\Controllers\Admin\MedTechController::class, 'updateRegistry'])->name('registry.update');
        Route::delete('/registry/{registry}', [App\Http\Controllers\Admin\MedTechController::class, 'destroyRegistry'])->name('registry.destroy');
        
        // Пилотные площадки
        Route::get('/pilot-sites', [App\Http\Controllers\Admin\MedTechController::class, 'pilotSites'])->name('pilot-sites');
        Route::get('/pilot-sites/create', [App\Http\Controllers\Admin\MedTechController::class, 'createPilotSite'])->name('pilot-sites.create');
        Route::post('/pilot-sites', [App\Http\Controllers\Admin\MedTechController::class, 'storePilotSite'])->name('pilot-sites.store');
        Route::get('/pilot-sites/{pilotSite}/edit', [App\Http\Controllers\Admin\MedTechController::class, 'editPilotSite'])->name('pilot-sites.edit');
        Route::put('/pilot-sites/{pilotSite}', [App\Http\Controllers\Admin\MedTechController::class, 'updatePilotSite'])->name('pilot-sites.update');
        Route::delete('/pilot-sites/{pilotSite}', [App\Http\Controllers\Admin\MedTechController::class, 'destroyPilotSite'])->name('pilot-sites.destroy');
        
        // Заявки
        Route::get('/submissions', [App\Http\Controllers\Admin\MedTechController::class, 'submissions'])->name('submissions');
        Route::get('/submissions/{submission}', [App\Http\Controllers\Admin\MedTechController::class, 'showSubmission'])->name('submissions.show');
        Route::patch('/submissions/{submission}/status', [App\Http\Controllers\Admin\MedTechController::class, 'updateSubmissionStatus'])->name('submissions.update-status');
        
        // Контент (алгоритм)
        Route::get('/content', [App\Http\Controllers\Admin\MedTechController::class, 'content'])->name('content');
        Route::post('/content', [App\Http\Controllers\Admin\MedTechController::class, 'storeContent'])->name('content.store');
    });

    // Глоссарий
    Route::middleware('permission:glossary')->group(function () {
        Route::resource('glossary', GlossaryController::class)->names([
            'index' => 'glossary.index',
            'create' => 'glossary.create',
            'store' => 'glossary.store',
            'show' => 'glossary.show',
            'edit' => 'glossary.edit',
            'update' => 'glossary.update',
            'destroy' => 'glossary.destroy',
        ]);
        Route::post('glossary/{term}/toggle', [GlossaryController::class, 'toggle'])->name('glossary.toggle');
        Route::post('glossary/import-employees', [GlossaryController::class, 'importEmployees'])->name('glossary.import-employees');
    });

    // Управление документами (файловый менеджер)
    Route::middleware(['permission:documents'])->group(function () {
        Route::get('/document-manager', [App\Http\Controllers\DocumentManagerController::class, 'index'])->name('document-manager');
        Route::get('/document-manager/documents', [App\Http\Controllers\DocumentManagerController::class, 'getDocuments'])->name('document-manager.documents');
        Route::post('/document-manager/rename', [App\Http\Controllers\DocumentManagerController::class, 'rename'])->name('document-manager.rename');
        Route::post('/document-manager/move', [App\Http\Controllers\DocumentManagerController::class, 'move'])->name('document-manager.move');
        Route::delete('/document-manager/delete', [App\Http\Controllers\DocumentManagerController::class, 'delete'])->name('document-manager.delete');
    });
});

Route::prefix('admin/storage')->middleware(['auth', 'permission:documents|news'])->group(function () {
    Route::get('list', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'list']);
    Route::delete('delete', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'delete']);
    Route::post('upload', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'upload']);
    Route::post('metadata', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'updateMetadata']);
});

// API для библиотеки изображений
Route::prefix('admin/images')->middleware(['auth', 'permission:news|media'])->group(function () {
    Route::get('news', [\App\Http\Controllers\Admin\ImageLibraryController::class, 'getNewsImages']);
});

// Отладочный маршрут для новостей
Route::post('admin/news/debug', [\App\Http\Controllers\Admin\NewsController::class, 'debug'])->middleware(['auth']);

// Тестовый маршрут для загрузки изображений
Route::get('admin/news/test-upload', function () {
    return Inertia::render('Admin/News/TestImageUpload');
})->middleware(['auth']);

Route::post('admin/news/test-upload', [\App\Http\Controllers\Admin\NewsController::class, 'testUpload'])->middleware(['auth']);

// API для парсинга метаданных из URL (для материалов СМИ)
Route::post('admin/news/parse-url', [\App\Http\Controllers\Admin\NewsController::class, 'parseUrl'])->middleware(['auth']);

// Простой тестовый маршрут для проверки данных формы
Route::post('admin/news/test-form', function (Request $request) {
    Log::info('Тестовый запрос формы', [
        'all_data' => $request->all(),
        'has_image_files' => $request->hasFile('image_files'),
        'has_video_files' => $request->hasFile('video_files'),
        'images_input' => $request->input('images'),
        'files' => $request->allFiles(),
        'content_type' => $request->header('Content-Type')
    ]);
    
    return response()->json([
        'success' => true,
        'message' => 'Данные получены',
        'data' => $request->all(),
        'files_count' => count($request->allFiles())
    ]);
})->middleware(['auth']);

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::middleware('permission:vacancies')->group(function () {
        Route::resource('vacancies', AdminVacancyController::class);
    });
    
    // Заявки на вакансии
    Route::middleware('permission:vacancy_applications')->group(function () {
        Route::get('/vacancy-applications', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'index'])->name('admin.vacancy-applications.index');
        Route::get('/vacancy-applications/{id}', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'show'])->name('admin.vacancy-applications.show');
        Route::patch('/vacancy-applications/{id}/status', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'updateStatus'])->name('admin.vacancy-applications.update-status');
        Route::patch('/vacancy-applications/{id}/notes', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'updateNotes'])->name('admin.vacancy-applications.update-notes');
        Route::delete('/vacancy-applications/{id}', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'destroy'])->name('admin.vacancy-applications.destroy');
    });
    
    // Заявки обратной связи
    Route::middleware('permission:contact_applications')->group(function () {
        Route::get('/contact-applications', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'index'])->name('admin.contact-applications.index');
        Route::get('/contact-applications/{id}', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'show'])->name('admin.contact-applications.show');
        Route::patch('/contact-applications/{id}/status', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'updateStatus'])->name('admin.contact-applications.update-status');
        Route::patch('/contact-applications/{id}/notes', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'updateNotes'])->name('admin.contact-applications.update-notes');
        Route::patch('/contact-applications/{id}/assign', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'assign'])->name('admin.contact-applications.assign');
        Route::delete('/contact-applications/{id}', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'destroy'])->name('admin.contact-applications.destroy');
    });
    
    // Управление клиниками
    Route::middleware('permission:clinics')->group(function () {
        Route::resource('clinics', \App\Http\Controllers\Admin\ClinicController::class, ['names' => 'admin.clinics']);
        Route::post('/clinics/{clinic}/images', [\App\Http\Controllers\Admin\ClinicController::class, 'uploadImages'])->name('admin.clinics.upload-images');
        Route::delete('/clinics/{clinic}/images', [\App\Http\Controllers\Admin\ClinicController::class, 'deleteImage'])->name('admin.clinics.delete-image');
        Route::put('/clinics/{clinic}/gallery/reorder', [\App\Http\Controllers\Admin\ClinicController::class, 'reorderGallery'])->name('admin.clinics.reorder-gallery');
        Route::patch('/clinics/{clinic}/toggle-published', [\App\Http\Controllers\Admin\ClinicController::class, 'togglePublished'])->name('admin.clinics.toggle-published');
    });
    
    // Управление молодежными центрами здоровья (МЦЗ)
    Route::middleware('permission:youth_health_centers')->group(function () {
        Route::resource('youth-health-centers', \App\Http\Controllers\Admin\YouthHealthCenterController::class, ['names' => 'admin.youth-health-centers']);
        Route::post('/youth-health-centers/bulk-destroy', [\App\Http\Controllers\Admin\YouthHealthCenterController::class, 'bulkDestroy'])->name('admin.youth-health-centers.bulk-destroy');
        Route::post('/youth-health-centers/{youthHealthCenter}/toggle-active', [\App\Http\Controllers\Admin\YouthHealthCenterController::class, 'toggleActive'])->name('admin.youth-health-centers.toggle-active');
    });
});

