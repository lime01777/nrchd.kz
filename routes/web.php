<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\Admin\VacancyController as AdminVacancyController;
use App\Http\Controllers\ConferenceRegistrationController;
use App\Http\Controllers\Admin\GlossaryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Middleware\LanguageMiddleware;
use App\Models\News;

// Подключаем локализованные маршруты
// Подключаем локализованные маршруты (перенесено внутрь группы middleware)


// API маршруты для файлового менеджера изображений (должны быть доступны без аутентификации)
Route::get('/api/admin/images', [\App\Http\Controllers\Api\ImageController::class, 'getImages']);
Route::post('/api/admin/images/upload', [\App\Http\Controllers\Api\ImageController::class, 'uploadImage']);
Route::delete('/api/admin/images/delete', [\App\Http\Controllers\Api\ImageController::class, 'deleteImage']);



// Маршруты для обслуживания изображений
Route::get('/images/{path}', [\App\Http\Controllers\ImageController::class, 'serve'])->where('path', '.*');
Route::get('/news-images/{filename}', [\App\Http\Controllers\ImageController::class, 'serveNewsImage']);

// Применяем мидлвар языка ко всем маршрутам
Route::middleware([LanguageMiddleware::class])->group(function () {
    // Подключаем локализованные маршруты
    require __DIR__.'/localized.php';

    require __DIR__.'/conference.php';

    // Маршруты основного сайта
    Route::get('/', function () {
        return Inertia::render('Home', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'locale' => app()->getLocale(),
        ]);
    })->name('home');

    // Публичные маршруты для новостей
    Route::get('/news', [App\Http\Controllers\NewsPublicController::class, 'index'])->name('news.index');
    Route::get('/news/media', [App\Http\Controllers\NewsPublicController::class, 'media'])->name('news.media');
    Route::get('/news/{news:slug}', [App\Http\Controllers\NewsPublicController::class, 'show'])->name('news.show');

    // Публичные маршруты для комментариев
    Route::get('/comments/captcha', [App\Http\Controllers\CommentController::class, 'getCaptcha'])->name('comments.captcha');
    Route::post('/news/{news:slug}/comment', [App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
// Конец мидлвара языка (был здесь, перенесен вниз)

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
    $registryData = \App\Models\HealthTechnology::all(); // Или фильтр по активным
    $aiServices = \App\Models\AiService::all();
    return Inertia::render('Direction/ElectronicHealth', [
        'registryData' => $registryData,
        'aiServices' => $aiServices
    ]);
})->name('electronic.health');

Route::get('/electronic-health/registry', function () {
    $registryData = \App\Models\HealthTechnology::all();
    return Inertia::render('Direction/Registry', [
        'registryData' => $registryData
    ]);
})->name('electronic.health.registry');

Route::get('/electronic-health/mkb11', function () {
    return Inertia::render('Direction/ElectronicHealth/Mkb11');
})->name('electronic.health.mkb11');

Route::get('/electronic-health/regulations', function () {
    return Inertia::render('Direction/ElectronicHealth/Regulations');
})->name('electronic.health.regulations');

Route::get('/electronic-health/standards', function () {
    return Inertia::render('Direction/ElectronicHealth/Standards');
})->name('electronic.health.standards');


Route::get('/electronic-health/service/{slug}', function ($slug) {
    $service = \App\Models\AiService::where('slug', $slug)->firstOrFail();
    return Inertia::render('Direction/AIServiceDetail', [
        'service' => $service,
        'slug' => $slug,
    ]);
})->name('ai.service.detail');

Route::get('/electronic-health/{id}', function ($id) {
    if (!is_numeric($id)) abort(404);
    $item = \App\Models\HealthTechnology::findOrFail($id);
    return Inertia::render('Direction/RegistryDetail', [
        'item' => $item
    ]);
})->where('id', '[0-9]+')->name('electronic.health.registry.detail');

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
Route::get('/tech', function () {
    $medTechController = new \App\Http\Controllers\Api\MedTechController();
    $medTechData = $medTechController->getPlatformData();
    
    return Inertia::render('Direction/TechCompetence', [
        'medTechData' => $medTechData,
    ]);
})->name('direction.tech.competence');

// Маршруты для медицинского туризма
Route::get('/medical-tourism', function () {
    // Показываем все клиники с флагом is_medical_tourism=true
    // Фильтруем только по is_medical_tourism, без проверки is_published и publish_at
    // чтобы все добавленные через админку "Клиники Казахстана" отображались
    $clinics = \App\Models\Clinic::where('is_medical_tourism', true)
        ->orderBy('name_ru')
        ->get()
        ->map(function ($clinic) {
            try {
                $heroUrl = $clinic->hero_url;
                $logoUrl = $clinic->logo_url;
            } catch (\Exception $e) {
                $heroUrl = null;
                $logoUrl = null;
            }
            
            return [
                'id' => $clinic->id,
                'slug' => $clinic->slug,
                'name' => $clinic->name,
                'short_desc' => $clinic->short_desc,
                'address' => $clinic->address,
                'phone' => $clinic->phone,
                'website' => $clinic->website,
                'specialties' => $clinic->specialties ?: [],
                'logo_url' => $logoUrl,
                'hero_url' => $heroUrl,
                // Для карточек используем hero_url (главное изображение), если есть, иначе logo_url, иначе дефолтное
                'image' => $heroUrl ?: ($logoUrl ?: '/img/clinics/clinic.jpg'),
            ];
        });
    
    return Inertia::render('Direction/MedicalTourism', [
        'clinics' => $clinics,
    ]);
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

}); // Конец мидлвара языка

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
                    // Передаем все медиа (изображения и видео) для правильной обработки
                    $allMedia = collect($media)->map(function ($item) {
                        return [
                            'type' => $item['type'] ?? 'image',
                            'url' => $item['url'] ?? $item['path'] ?? null,
                            'path' => $item['path'] ?? null,
                            'embed_url' => $item['embed_url'] ?? null,
                            'is_external' => $item['is_external'] ?? false,
                            'is_embed' => $item['is_embed'] ?? false,
                            'thumbnail' => $item['thumbnail'] ?? null,
                        ];
                    })->filter(function ($item) {
                        return !empty($item['url']) || !empty($item['path']);
                    })->values()->all();

                    return [
                        'id' => $news->id,
                        'title' => $news->title,
                        'slug' => $news->slug,
                        'excerpt' => $news->excerpt,
                        'image' => $news->cover_thumb_url ?? $news->cover_url,
                        'images' => $allMedia, // Передаем все медиа, включая видео
                        'publish_date' => optional($news->published_at ?? $news->publish_date)->toDateTimeString(),
                        'external_url' => $news->external_url,
                        'type' => $news->type,
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

require __DIR__.'/admin.php';

require __DIR__.'/branches.php';

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

// Маршрут для подачи технологии MedTech
Route::post('/medtech/submit', [App\Http\Controllers\MedTechSubmissionController::class, 'submit'])->name('medtech.submit');

// Маршруты для админ-панели вакансий (требуют авторизации)
require __DIR__.'/auth.php';
