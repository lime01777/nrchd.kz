<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

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

Route::get('/health-accounts', function () {
    return Inertia::render('Direction/HealthAccounts');
})->name('health.accounts');

Route::get('/health-rate', function () {
    return Inertia::render('Direction/HealthRate');
})->name('health.rate');

Route::get('/clinical-protocols', function () {
    return Inertia::render('Direction/ClinicalProtocols');
})->name('clinical.protocols');

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
})->name('vacancy.jobs');

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

Route::get('/education-programs', function () {
    return Inertia::render('Services/EducationPrograms');
})->name('services.educationPrograms');

Route::get('/medical-expertise', function () {
    return Inertia::render('Services/MedicalExpertise');
})->name('services.medicalExpertise');

Route::get('/accreditation', function () {
    return Inertia::render('Services/Accreditation');
})->name('services.accreditation');

Route::get('/medical-rating', function () {
    return Inertia::render('Direction/MedicalRating');
})->name('medical.rating');

Route::get('/medical-rating/regional', function () {
    return Inertia::render('Direction/MedicalRating/Regional');
})->name('medical.rating.regional');

Route::get('/medical-rating/quality', function () {
    return Inertia::render('Direction/MedicalRating/Quality');
})->name('medical.rating.quality');

// Маршруты для новостей
Route::get('/news', [App\Http\Controllers\NewsController::class, 'index'])->name('news');
Route::get('/news/{slug}', [App\Http\Controllers\NewsController::class, 'show'])->name('news.show');

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
    Route::get('/latest-news', function () {
        $latestNews = App\Models\News::where('status', 'Опубликовано')
            ->orderBy('publish_date', 'desc')
            ->limit(2)
            ->get();
        
        return response()->json($latestNews);
    });
});

// Маршруты для админ-панели
Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.dashboard');

    // Управление новостями
    Route::get('/news', [App\Http\Controllers\Admin\NewsController::class, 'index'])->name('admin.news');
    Route::get('/news/create', [App\Http\Controllers\Admin\NewsController::class, 'create'])->name('admin.news.create');
    Route::post('/news', [App\Http\Controllers\Admin\NewsController::class, 'store'])->name('admin.news.store');
    Route::get('/news/{id}/edit', [App\Http\Controllers\Admin\NewsController::class, 'edit'])->name('admin.news.edit');
    Route::put('/news/{id}', [App\Http\Controllers\Admin\NewsController::class, 'update'])->name('admin.news.update');
    Route::delete('/news/{id}', [App\Http\Controllers\Admin\NewsController::class, 'destroy'])->name('admin.news.destroy');

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
    Route::delete('/users/{id}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('admin.users.destroy');

    // Настройки
    Route::get('/settings', [App\Http\Controllers\Admin\SettingController::class, 'index'])->name('admin.settings');
    Route::put('/settings', [App\Http\Controllers\Admin\SettingController::class, 'update'])->name('admin.settings.update');
    Route::post('/settings/backup', [App\Http\Controllers\Admin\SettingController::class, 'createBackup'])->name('admin.settings.backup');

    // Маршруты для управления аккордеонами документов
    Route::resource('document-accordions', App\Http\Controllers\Admin\DocumentAccordionController::class, [
        'names' => 'admin.document-accordions'
    ]);
});

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
})->name('branches.almaty_region');

Route::get('/atyrau', function () {
    return Inertia::render('Branches/Atyrau');
})->name('branches.atyrau');

Route::get('/east', function () {
    return Inertia::render('Branches/East');
})->name('branches.east');

Route::get('/zhambyl', function () {
    return Inertia::render('Branches/Zhambyl');
})->name('branches.zhambyl');

Route::get('/zhetysu', function () {
    return Inertia::render('Branches/Zhetysu');
})->name('branches.zhetysu');

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

Route::get('/mangystau', function () {
    return Inertia::render('Branches/Mangystau');
})->name('branches.mangystau');

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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
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

require __DIR__.'/auth.php';
