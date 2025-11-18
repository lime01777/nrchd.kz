<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\Admin\VacancyController as AdminVacancyController;
use App\Http\Controllers\ConferenceRegistrationController;
use App\Http\Controllers\Admin\GlossaryController;
use App\Http\Controllers\Admin\TranslationManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Middleware\LanguageMiddleware;
use App\Models\News;

// Подключаем локализованные маршруты
require __DIR__.'/localized.php';

// API маршруты для файлового менеджера изображений (должны быть доступны без аутентификации)
Route::get('/api/admin/images', [\App\Http\Controllers\Api\ImageController::class, 'getImages']);
Route::post('/api/admin/images/upload', [\App\Http\Controllers\Api\ImageController::class, 'uploadImage']);
Route::delete('/api/admin/images/delete', [\App\Http\Controllers\Api\ImageController::class, 'deleteImage']);



// Маршруты для обслуживания изображений
Route::get('/images/{path}', [\App\Http\Controllers\ImageController::class, 'serve'])->where('path', '.*');
Route::get('/news-images/{filename}', [\App\Http\Controllers\ImageController::class, 'serveNewsImage']);

// Применяем мидлвар языка ко всем маршрутам
Route::middleware([LanguageMiddleware::class])->group(function () {
    // Маршруты для конференции (субдомен conference.nrchd.kz)
    Route::middleware(['conference.subdomain'])->group(function () {
        // Если запрос поступил на субдомен conference.nrchd.kz
        Route::get('/', function () {
            return Inertia::render('Conference/Home', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.home');
        
        Route::get('/about', function () {
            return Inertia::render('Conference/About', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.about');
        
        Route::get('/program', function () {
            return Inertia::render('Conference/Program', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.program');
        
        Route::get('/speakers', function () {
            return Inertia::render('Conference/Speakers', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.speakers');
        
        Route::get('/registration', function () {
            return Inertia::render('Conference/Registration', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.registration');
        
        // Обработка формы регистрации
        Route::post('/registration', [ConferenceRegistrationController::class, 'store'])->name('conference.registration.submit');
        
        // Страница успешной регистрации
        Route::get('/registration/success', function () {
            return Inertia::render('Conference/RegistrationSuccess', [
                'registrationType' => session('registrationType', 'participant'),
                'email' => session('registrationEmail', ''),
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.registration.success');
        
        // Новые страницы конференции
        Route::get('/organizers', function () {
            return Inertia::render('Conference/Organizers', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.organizers');
        
        Route::get('/co-organizers', function () {
            return Inertia::render('Conference/CoOrganizers', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.co-organizers');
        
        Route::get('/supporters', function () {
            return Inertia::render('Conference/Supporters', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.supporters');
        
        Route::get('/sponsors', function () {
            return Inertia::render('Conference/Sponsors', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.sponsors');
        
        Route::get('/partners', function () {
            return Inertia::render('Conference/Partners', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.partners');
        
        Route::get('/info-partners', function () {
            return Inertia::render('Conference/InfoPartners', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.info-partners');
        
        Route::get('/fees', function () {
            return Inertia::render('Conference/Fees', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.fees');
        
        Route::get('/sponsor-packages', function () {
            return Inertia::render('Conference/SponsorPackages', [
                'locale' => app()->getLocale(),
            ]);
        })->name('conference.sponsor-packages');
    });
    
    // Маршруты основного сайта
    Route::get('/', function () {
        return Inertia::render('Home', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'locale' => app()->getLocale(),
        ]);
    })->name('home');
}); // Конец мидлвара языка

Route::get('/medical-education', function () {
    return Inertia::render('Direction/MedicalEducation');
})->name('medical.education');

Route::get('/human-resources', function () {
    return Inertia::render('Direction/HumanResources');
})->name('human.resources');

Route::get('/human-resources/graduates', function () {
    return Inertia::render('Direction/HumanResources/Graduates');
})->name('human.resources.graduates');

Route::get('/human-resources/managers', function () {
    return Inertia::render('Direction/HumanResources/Managers');
})->name('human.resources.managers');

Route::get('/human-resources/medical-workers', function () {
    return Inertia::render('Direction/HumanResources/MedicalWorkers');
})->name('human.resources.medical.workers');

Route::get('/electronic-health', function () {
    return Inertia::render('Direction/ElectronicHealth');
})->name('electronic.health');

Route::get('/electronic-health/mkb11', function () {
    return Inertia::render('Direction/ElectronicHealth/Mkb11');
})->name('electronic.health.mkb11');

Route::get('/electronic-health/regulations', function () {
    return Inertia::render('Direction/ElectronicHealth/Regulations');
})->name('electronic.health.regulations');

Route::get('/electronic-health/standards', function () {
    return Inertia::render('Direction/ElectronicHealth/Standards');
})->name('electronic.health.standards');

Route::get('/strategic-initiatives', function () {
    return Inertia::render('Direction/StrategicInitiatives');
})->name('strategic.initiatives');

Route::get('/strategic-initiatives/initiatives', function () {
    return Inertia::render('Direction/StrategicInitiatives/Initiatives');
})->name('strategic.initiatives.initiatives');

Route::get('/strategic-initiatives/tourism', function () {
    return Inertia::render('Direction/StrategicInitiatives/Tourism');
})->name('strategic.initiatives.tourism');

Route::get('/strategic-initiatives/partnership', function () {
    return Inertia::render('Direction/StrategicInitiatives/Partnership');
})->name('strategic.initiatives.partnership');

Route::get('/strategic-initiatives/expert', function () {
    return Inertia::render('Direction/StrategicInitiatives/Expert');
})->name('strategic.initiatives.expert');

Route::get('/strategic-initiatives/coalition', function () {
    return Inertia::render('Direction/StrategicInitiatives/Coalition');
})->name('strategic.initiatives.coalition');

Route::get('/health-accounts', function () {
    return Inertia::render('Direction/HealthAccounts');
})->name('health.accounts');

Route::get('/health-accounts/documents', function () {
    return Inertia::render('Direction/HealthAccounts/Documents');
})->name('health.accounts.documents');

Route::get('/health-rate', function () {
    return Inertia::render('Direction/HealthRate');
})->name('health.rate');

// Центр профилактики и укрепления здоровья
Route::get('/center-prevention', function () {
    return Inertia::render('Direction/CenterPrevention');
})->name('center.prevention');

Route::get('/health-rate/otz-reports', [App\Http\Controllers\OtzReportsController::class, 'index'])->name('health.rate.otz.reports');

// Заявки ОТЗ
Route::get('/health-rate/otz-applications', [App\Http\Controllers\OtzApplicationController::class, 'index'])->name('health.rate.otz.applications');
Route::get('/health-rate/otz-applications/{otzApplication}', [App\Http\Controllers\OtzApplicationController::class, 'show'])->name('health.rate.otz.applications.show');
Route::get('/health-rate/otz-applications/{otzApplication}/data', [App\Http\Controllers\OtzApplicationController::class, 'getApplicationData'])->name('health.rate.otz.applications.data');

Route::get('/quality-commission', function () {
    return Inertia::render('Direction/QualityCommission');
})->name('quality.commission');

Route::get('/clinical-protocols', function () {
    return Inertia::render('Direction/ClinicalProtocols');
})->name('clinical.protocols');

Route::get('/clinical-protocols/catalog', function () {
    return Inertia::render('Direction/ClinicalProtocols/Catalog');
})->name('clinical.protocols.catalog');

Route::get('/clinical-protocols/monitoring', function () {
    return Inertia::render('Direction/ClinicalProtocols/Monitoring');
})->name('clinical.protocols.monitoring');

Route::get('/clinical-protocols/commission', function () {
    return Inertia::render('Direction/ClinicalProtocols/Commission');
})->name('clinical.protocols.commission');

Route::get('/medical-accreditation', function () {
    return Inertia::render('Direction/MedicalAccreditation');
})->name('medical.accreditation');

Route::get('/medical-science', function () {
    return Inertia::render('Direction/MedicalScience');
})->name('medical.science');

Route::get('/medical-science/research', function () {
    return Inertia::render('Direction/MedicalScience/Research');
})->name('medical.science.research');

Route::get('/medical-science/clinical', function () {
    return Inertia::render('Direction/MedicalScience/Clinical');
})->name('medical.science.clinical');

Route::get('/medical-science/tech', function () {
    return Inertia::render('Direction/MedicalScience/Tech');
})->name('medical.science.tech');

Route::get('/medical-science/council', function () {
    return Inertia::render('Direction/MedicalScience/Council');
})->name('medical.science.council');

Route::get('/drug-policy', function () {
    return Inertia::render('Direction/DrugPolicy');
})->name('drug.policy');

Route::get('/drug-policy/commission', function () {
    return Inertia::render('Direction/DrugPolicy/Commission');
})->name('drug.policy.commission');

Route::get('/drug-policy/regulations', function () {
    return Inertia::render('Direction/DrugPolicy/Regulations');
})->name('drug.policy.regulations');

Route::get('/salidat-kairbekova', function () {
    return Inertia::render('AboutCentre/SalidatKairbekova');
})->name('salidat.kairbekova');

Route::get('/about-centre', function () {
    return Inertia::render('AboutCentre/AboutCentre');
})->name('about.centre');

Route::get('/vacancy-jobs', function () {
    return Inertia::render('AboutCentre/Vacancy');
})->name('about.vacancy');

Route::get('/about-faq', function () {
    return Inertia::render('AboutCentre/FAQ');
})->name('about.faq');

Route::get('/about-contacts', function () {
    return Inertia::render('AboutCentre/Contacts');
})->name('about.contacts');

Route::get('/about-partners', function () {
    return Inertia::render('AboutCentre/Partners');
})->name('about.partners');

Route::get('/training', function () {
    return Inertia::render('Services/Training');
})->name('services.training');

Route::get('/ads-evaluation', function () {
    return Inertia::render('Services/AdsEvaluation');
})->name('services.adsEvaluation');

Route::get('/health-tech-assessment', function () {
    return Inertia::render('Services/HealthTechAssessment');
})->name('services.healthTechAssessment');

Route::get('/drug-expertise', function () {
    return Inertia::render('Services/DrugExpertise');
})->name('services.drugExpertise');

Route::get('/primary-healthcare', function () {
    return Inertia::render('Direction/PrimaryHealthCare');
})->name('primary.healthcare');

Route::get('/primary-healthcare/outpatient', function () {
    return Inertia::render('Direction/PrimaryHealthCare/Outpatient');
})->name('primary.healthcare.outpatient');

Route::get('/primary-healthcare/prevention', function () {
    return Inertia::render('Direction/PrimaryHealthCare/Prevention');
})->name('primary.healthcare.prevention');

Route::get('/medical-statistics', function () {
    return Inertia::render('Direction/MedicalStatistics');
})->name('medical.statistics');

Route::get('/medical-statistics/reports', function () {
    return Inertia::render('Direction/MedStats/Reports');
})->name('medical.statistics.reports');

Route::get('/medical-statistics/statdata', function () {
    return Inertia::render('Direction/MedStats/StatData');
})->name('medical.statistics.statdata');

Route::get('/medical-statistics/analytics', function () {
    return Inertia::render('Direction/MedStats/Analytics');
})->name('medical.statistics.analytics');

Route::get('/education-programs', function () {
    return Inertia::render('Services/EducationPrograms');
})->name('services.educationPrograms');

Route::get('/medical-expertise', function () {
    return Inertia::render('Services/MedicalExpertise');
})->name('services.medicalExpertise');

Route::get('/accreditation', function () {
    return Inertia::render('Services/Accreditation');
})->name('services.accreditation');

Route::get('/post-accreditation-monitoring', function () {
    return Inertia::render('Services/PostAccreditationMonitoring');
})->name('services.postAccreditationMonitoring');

Route::get('/medical-rating', function () {
    return Inertia::render('Direction/MedicalRating');
})->name('medical.rating');

Route::get('/medical-rating/regional', function () {
    return Inertia::render('Direction/MedicalRating/Regional');
})->name('medical.rating.regional');

Route::get('/medical-rating/quality', function () {
    return Inertia::render('Direction/MedicalRating/Quality');
})->name('medical.rating.quality');

// Маршруты для страниц аккредитации
Route::get('/accreditation/guides', function () {
    return Inertia::render('Direction/Accreditation/Guides');
})->name('accreditation.guides');

Route::get('/accreditation/experts', function () {
    return Inertia::render('Direction/Accreditation/Experts');
})->name('accreditation.experts');

Route::get('/accreditation/training-materials', function () {
    return Inertia::render('Direction/Accreditation/TrainingMaterials');
})->name('accreditation.training');

Route::get('/accreditation/active-standards', function () {
    return Inertia::render('Direction/Accreditation/ActiveStandards');
})->name('accreditation.standards');

Route::get('/accreditation/standards-archive', function () {
    return Inertia::render('Direction/Accreditation/StandardsArchive');
})->name('accreditation.archive');

Route::get('/accreditation/commission', function () {
    return Inertia::render('Direction/Accreditation/Commission');
})->name('accreditation.commission');

// Маршруты для медицинского образования
Route::get('/direction/medical-education', function () {
    return Inertia::render('Direction/MedicalEducation');
})->name('direction.medical.education');

Route::get('/direction/medical-education/documents', function () {
    return Inertia::render('Direction/MedEducation/Documents');
})->name('direction.medical.education.documents');

Route::get('/direction/medical-education/recommendations', function () {
    return Inertia::render('Direction/MedEducation/Recommendations');
})->name('direction.medical.education.recommendations');

// ГОСО и ТУП (Медицинское образование)
Route::get('/direction/medical-education/goso-tup', function () {
    return Inertia::render('Direction/MedEducation/GosoTup');
})->name('direction.medical.education.goso_tup');

Route::get('/direction/medical-education/rating', function () {
    return Inertia::render('Direction/MedEducation/Rating');
})->name('direction.medical.education.rating');

// Маршрут для Отраслевого центра технологических компетенций
Route::get('/direction/tech-competence', function () {
    return Inertia::render('Direction/TechCompetence');
})->name('direction.tech.competence');

// Маршруты для медицинского туризма
Route::get('/medical-tourism', function () {
    return Inertia::render('Direction/MedicalTourism');
})->name('medical.tourism');

Route::get('/medical-tourism/directions', function () {
    return Inertia::render('Direction/MedicalTourism/Directions');
})->name('medical.tourism.directions');

Route::get('/medical-tourism/certification', function () {
    return Inertia::render('Direction/MedicalTourism/Certification');
})->name('medical.tourism.certification');

Route::get('/medical-tourism/services', function () {
    return Inertia::render('Direction/MedicalTourism/Services');
})->name('medical.tourism.services');

Route::get('/medical-tourism/documents', function () {
    return Inertia::render('Direction/MedicalTourism/Documents');
})->name('medical.tourism.documents');

Route::get('/medical-tourism/contacts', function () {
    return Inertia::render('Direction/MedicalTourism/Contacts');
})->name('medical.tourism.contacts');

// Маршруты для Центральной комиссии по биоэтике перенесены в localized.php

// Публичные маршруты для новостей
Route::get('/news', [App\Http\Controllers\NewsPublicController::class, 'index'])->name('news.index');
Route::get('/news/media', [App\Http\Controllers\NewsPublicController::class, 'media'])->name('news.media');
Route::get('/news/{news:slug}', [App\Http\Controllers\NewsPublicController::class, 'show'])->name('news.show');

// Маршруты для клиник
Route::get('/clinics', [App\Http\Controllers\ClinicController::class, 'index'])->name('clinics');
Route::get('/clinics/{slug}', [App\Http\Controllers\ClinicController::class, 'show'])->name('clinics.show.public');

// Маршруты для страниц отдельных клиник медицинского туризма
Route::get('/clinics/show/{route}', [App\Http\Controllers\ClinicController::class, 'showByRoute'])->name('clinics.show.by.route');

// Скрытая страница конференции по медицинскому туризму (без публичных ссылок)
Route::get('/medical-tourism-conference', function () {
    return Inertia::render('Conference/MedicalTourism', [
        'locale' => app()->getLocale(),
    ]);
})->name('medical.tourism.conference');

// Демонстрационная страница слайдера новостей
Route::get('/news-slider-demo', function () {
    return Inertia::render('News/SliderDemo');
})->name('news.slider.demo');

// API маршруты
Route::prefix('api')->group(function () {
    Route::get('/news/{slug}', function ($slug) {
        $news = App\Models\News::where('slug', $slug)->first();
        if (!$news) {
            return response()->json(['error' => 'Новость не найдена'], 404);
        }
        
        // Увеличиваем счетчик просмотров
        $news->views = ($news->views ?? 0) + 1;
        $news->save();
        
        return response()->json($news);
    });
    
    // Получение последних новостей
    Route::get('/latest-news', function (Request $request) {
        try {
            $limit = (int) $request->get('limit', 10);
            $limit = $limit > 0 && $limit <= 50 ? $limit : 10;

            $mediaService = app(App\Services\MediaService::class);

            $latestNews = App\Models\News::query()
                ->whereIn('status', ['published', 'Опубликовано'])
                ->orderByDesc('published_at')
                ->limit($limit)
                ->get()
                ->map(function (App\Models\News $news) use ($mediaService) {
                    $media = $mediaService->normalizeMediaForFrontend($news->images ?? []);
                    $imagePaths = collect($media)
                        ->where('type', 'image')
                        ->pluck('url')
                        ->values()
                        ->all();

                    return [
                        'id' => $news->id,
                        'title' => $news->title,
                        'slug' => $news->slug,
                        'excerpt' => $news->excerpt,
                        'image' => $news->cover_thumb_url ?? $news->cover_url,
                        'images' => $imagePaths,
                        'publish_date' => optional($news->published_at ?? $news->publish_date)->toDateTimeString(),
                    ];
                });

            return response()->json($latestNews);
        } catch (\Throwable $e) {
            Log::error('Ошибка в API latest-news', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Ошибка сервера'], 500);
        }
    });
});

// Маршруты для админ-панели
Route::prefix('admin')->middleware(['auth', 'verified'])->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Управление новостями (с политикой доступа)
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
    
    // Управление медиа новостей
    Route::post('/news/upload-media', [App\Http\Controllers\Admin\NewsController::class, 'uploadMediaFiles'])->name('admin.news.upload-media');
    Route::post('/news/{newsId}/media', [App\Http\Controllers\Admin\NewsController::class, 'uploadMedia'])->name('admin.news.media.upload');
    Route::patch('/news/{newsId}/media/order', [App\Http\Controllers\Admin\NewsController::class, 'updateMediaOrder'])->name('admin.news.media.order');
    Route::delete('/news/{newsId}/media/{mediaId}', [App\Http\Controllers\Admin\NewsController::class, 'deleteMedia'])->name('admin.news.media.delete');
    Route::patch('/news/{newsId}/cover/{mediaId}', [App\Http\Controllers\Admin\NewsController::class, 'setCover'])->name('admin.news.cover.set');
    Route::delete('/news/media/temp', [App\Http\Controllers\Admin\NewsController::class, 'deleteTemporaryMedia'])->name('admin.news.media.temp-delete');

    // Управление заявками ОТЗ
    Route::resource('otz-applications', App\Http\Controllers\Admin\OtzApplicationController::class, [
        'names' => 'admin.otz-applications'
    ]);
    Route::post('/otz-applications/{otzApplication}/upload-documents', [App\Http\Controllers\Admin\OtzApplicationController::class, 'uploadDocuments'])->name('admin.otz-applications.upload-documents');
    Route::delete('/otz-applications/{otzApplication}/delete-document', [App\Http\Controllers\Admin\OtzApplicationController::class, 'deleteDocument'])->name('admin.otz-applications.delete-document');

    // Управление документами
    Route::get('/documents', [App\Http\Controllers\Admin\DocumentController::class, 'index'])->name('admin.documents');
    Route::get('/documents/create', [App\Http\Controllers\Admin\DocumentController::class, 'create'])->name('admin.documents.create');
    Route::post('/documents', [App\Http\Controllers\Admin\DocumentController::class, 'store'])->name('admin.documents.store');
    Route::get('/documents/{id}/edit', [App\Http\Controllers\Admin\DocumentController::class, 'edit'])->name('admin.documents.edit');
    Route::put('/documents/{id}', [App\Http\Controllers\Admin\DocumentController::class, 'update'])->name('admin.documents.update');
    Route::delete('/documents/{id}', [App\Http\Controllers\Admin\DocumentController::class, 'destroy'])->name('admin.documents.destroy');

    // Управление пользователями
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users');
    Route::get('/users/create', [App\Http\Controllers\Admin\UserController::class, 'create'])->name('admin.users.create');
    Route::post('/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::get('/users/{id}/edit', [App\Http\Controllers\Admin\UserController::class, 'edit'])->name('admin.users.edit');
    Route::put('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'update'])->name('admin.users.update');
    Route::patch('/users/{user}/role', [App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('admin.users.update-role');
    Route::delete('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

    // Настройки
    Route::get('/settings', [App\Http\Controllers\Admin\SettingController::class, 'index'])->name('admin.settings');
    Route::put('/settings', [App\Http\Controllers\Admin\SettingController::class, 'update'])->name('admin.settings.update');
    Route::post('/settings/backup', [App\Http\Controllers\Admin\SettingController::class, 'createBackup'])->name('admin.settings.backup');
    
    // Глоссарий
    Route::resource('glossary', GlossaryController::class)->names([
        'index' => 'admin.glossary.index',
        'create' => 'admin.glossary.create',
        'store' => 'admin.glossary.store',
        'show' => 'admin.glossary.show',
        'edit' => 'admin.glossary.edit',
        'update' => 'admin.glossary.update',
        'destroy' => 'admin.glossary.destroy',
    ]);
    Route::post('glossary/{term}/toggle', [GlossaryController::class, 'toggle'])->name('admin.glossary.toggle');
    Route::post('glossary/import-employees', [GlossaryController::class, 'importEmployees'])->name('admin.glossary.import-employees');
    
    // Управление переводами
    Route::get('translations', [TranslationManagementController::class, 'index'])->name('admin.translations');
    Route::post('translations/translate-all', [TranslationManagementController::class, 'translateAll'])->name('admin.translations.translate-all');
    Route::post('translations/translate-single', [TranslationManagementController::class, 'translateSingle'])->name('admin.translations.translate-single');
    Route::put('translations/{translation}', [TranslationManagementController::class, 'update'])->name('admin.translations.update');
    Route::post('translations/{translation}/retranslate', [TranslationManagementController::class, 'retranslate'])->name('admin.translations.retranslate');
    Route::post('translations/retranslate-scope', [TranslationManagementController::class, 'retranslateScope'])->name('admin.translations.retranslate-scope');
    Route::post('translations/clear-cache', [TranslationManagementController::class, 'clearCache'])->name('admin.translations.clear-cache');

    // Управление документами (для менеджеров документов)
    Route::middleware(['document.manager'])->group(function () {
        Route::get('/document-manager', [App\Http\Controllers\DocumentManagerController::class, 'index'])->name('admin.document-manager');
        Route::get('/document-manager/documents', [App\Http\Controllers\DocumentManagerController::class, 'getDocuments'])->name('admin.document-manager.documents');
        Route::post('/document-manager/rename', [App\Http\Controllers\DocumentManagerController::class, 'rename'])->name('admin.document-manager.rename');
        Route::post('/document-manager/move', [App\Http\Controllers\DocumentManagerController::class, 'move'])->name('admin.document-manager.move');
        Route::delete('/document-manager/delete', [App\Http\Controllers\DocumentManagerController::class, 'delete'])->name('admin.document-manager.delete');
    });
});

// API для просмотра и управления файлами в public/storage
Route::prefix('admin/storage')->middleware(['auth'])->group(function () {
    Route::get('list', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'list']);
    Route::delete('delete', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'delete']);
    Route::post('upload', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'upload']);
    Route::post('metadata', [\App\Http\Controllers\Admin\StorageBrowserController::class, 'updateMetadata']);
});

// API для библиотеки изображений
Route::prefix('admin/images')->middleware(['auth'])->group(function () {
    Route::get('news', [\App\Http\Controllers\Admin\ImageLibraryController::class, 'getNewsImages']);
});

// Отладочный маршрут для новостей
Route::post('admin/news/debug', [\App\Http\Controllers\Admin\NewsController::class, 'debug'])->middleware(['auth']);

// Тестовый маршрут для загрузки изображений
Route::get('admin/news/test-upload', function () {
    return Inertia::render('Admin/News/TestImageUpload');
})->middleware(['auth']);

Route::post('admin/news/test-upload', [\App\Http\Controllers\Admin\NewsController::class, 'testUpload'])->middleware(['auth']);

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

// Маршруты для филиалов
Route::get('/astana', function () {
    return Inertia::render('Branches/Astana');
})->name('branches.astana');

Route::get('/almaty', function () {
    return Inertia::render('Branches/Almaty');
})->name('branches.almaty');

Route::get('/akmola', function () {
    return Inertia::render('Branches/Akmola');
})->name('branches.akmola');

Route::get('/aktobe', function () {
    return Inertia::render('Branches/Aktobe');
})->name('branches.aktobe');
 
Route::get('/almaty_region', function () {
    return Inertia::render('Branches/AlmatyRegion');
})->name('branches.almatyregion');

Route::get('/atyrau', function () {
    return Inertia::render('Branches/Atyrau');
})->name('branches.atyrau');

Route::get('/east', function () {
    return Inertia::render('Branches/East');
})->name('branches.east');

Route::get('/zhambyl', function () {
    return Inertia::render('Branches/Zhambyl');
})->name('branches.zhambyl');

Route::get('/zhetisu', function () {
    return Inertia::render('Branches/Zhetisu');
})->name('branches.zhetisu');

Route::get('/west', function () {
    return Inertia::render('Branches/West');
})->name('branches.west');

Route::get('/karaganda', function () {
    return Inertia::render('Branches/Karaganda');
})->name('branches.karaganda');

Route::get('/kostanay', function () {
    return Inertia::render('Branches/Kostanay');
})->name('branches.kostanay');

Route::get('/kyzylorda', function () {
    return Inertia::render('Branches/Kyzylorda');
})->name('branches.kyzylorda');

Route::get('/mangistau', function () {
    return Inertia::render('Branches/Mangistau');
})->name('branches.mangistau');

Route::get('/pavlodar', function () {
    return Inertia::render('Branches/Pavlodar');
})->name('branches.pavlodar');

Route::get('/north', function () {
    return Inertia::render('Branches/North');
})->name('branches.north');

Route::get('/turkestan', function () {
    return Inertia::render('Branches/Turkestan');
})->name('branches.turkestan');

Route::get('/ulytau', function () {
    return Inertia::render('Branches/Ulytau');
})->name('branches.ulytau');

Route::get('/shymkent', function () {
    return Inertia::render('Branches/Shymkent');
})->name('branches.shymkent');

Route::get('/abay', function () {
    return Inertia::render('Branches/Abay');
})->name('branches.abay');

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Пример интеграции с Google Drive
    Route::get('/examples/google-drive', function () {
        return Inertia::render('Examples/GoogleDriveExample');
    })->name('examples.google-drive');
    
    // API для Google Drive
    Route::prefix('api/google-drive')->group(function () {
        Route::get('/files', [App\Http\Controllers\GoogleDriveController::class, 'getFiles']);
        Route::get('/file-metadata', [App\Http\Controllers\GoogleDriveController::class, 'getFileMetadata']);
    });
});

// Маршруты для публичной страницы вакансий
Route::get('/about-centre/vacancies', [VacancyController::class, 'index'])->name('vacancy.jobs');
Route::get('/about-centre/vacancies/{slug}', [VacancyController::class, 'show'])->name('vacancy.show');
Route::post('/about-centre/vacancies/{slug}/apply', [App\Http\Controllers\VacancyApplicationController::class, 'store'])->name('vacancy.apply');

// Маршруты для форм обратной связи (публичные)
Route::post('/contact/submit', [App\Http\Controllers\ContactApplicationController::class, 'store'])->name('contact.submit');

// Маршруты для админ-панели вакансий (требуют авторизации)
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::resource('vacancies', AdminVacancyController::class);
    
    // Заявки на вакансии
    Route::get('/vacancy-applications', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'index'])->name('admin.vacancy-applications.index');
    Route::get('/vacancy-applications/{id}', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'show'])->name('admin.vacancy-applications.show');
    Route::patch('/vacancy-applications/{id}/status', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'updateStatus'])->name('admin.vacancy-applications.update-status');
    Route::patch('/vacancy-applications/{id}/notes', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'updateNotes'])->name('admin.vacancy-applications.update-notes');
    Route::delete('/vacancy-applications/{id}', [\App\Http\Controllers\Admin\VacancyApplicationController::class, 'destroy'])->name('admin.vacancy-applications.destroy');
    
    // Заявки обратной связи
    Route::get('/contact-applications', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'index'])->name('admin.contact-applications.index');
    Route::get('/contact-applications/{id}', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'show'])->name('admin.contact-applications.show');
    Route::patch('/contact-applications/{id}/status', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'updateStatus'])->name('admin.contact-applications.update-status');
    Route::patch('/contact-applications/{id}/notes', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'updateNotes'])->name('admin.contact-applications.update-notes');
    Route::patch('/contact-applications/{id}/assign', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'assign'])->name('admin.contact-applications.assign');
    Route::delete('/contact-applications/{id}', [\App\Http\Controllers\Admin\ContactApplicationController::class, 'destroy'])->name('admin.contact-applications.destroy');
    
    // Управление клиниками
    Route::resource('clinics', \App\Http\Controllers\Admin\ClinicController::class, ['names' => 'admin.clinics']);
    Route::post('/clinics/{clinic}/images', [\App\Http\Controllers\Admin\ClinicController::class, 'uploadImages'])->name('admin.clinics.upload-images');
    Route::delete('/clinics/{clinic}/images', [\App\Http\Controllers\Admin\ClinicController::class, 'deleteImage'])->name('admin.clinics.delete-image');
    Route::put('/clinics/{clinic}/gallery/reorder', [\App\Http\Controllers\Admin\ClinicController::class, 'reorderGallery'])->name('admin.clinics.reorder-gallery');
    
    // Управление молодежными центрами здоровья (МЦЗ)
    Route::resource('youth-health-centers', \App\Http\Controllers\Admin\YouthHealthCenterController::class, ['names' => 'admin.youth-health-centers']);
    Route::post('/youth-health-centers/bulk-destroy', [\App\Http\Controllers\Admin\YouthHealthCenterController::class, 'bulkDestroy'])->name('admin.youth-health-centers.bulk-destroy');
    Route::post('/youth-health-centers/{youthHealthCenter}/toggle-active', [\App\Http\Controllers\Admin\YouthHealthCenterController::class, 'toggleActive'])->name('admin.youth-health-centers.toggle-active');
});

require __DIR__.'/auth.php';
