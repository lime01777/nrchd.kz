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

Route::get('/electronic-health', function () {
    return Inertia::render('Direction/ElectronicHealth');
})->name('electronic.health');

Route::get('/health-rate', function () {
    return Inertia::render('Direction/HealthRate');
})->name('health.rate');

Route::get('/clinical-protocols', function () {
    return Inertia::render('Direction/ClinicalProtocols');
})->name('clinical.protocols');

Route::get('/medical-accreditation', function () {
    return Inertia::render('Direction/MedicalAccreditation');
})->name('medical.accreditation');

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

Route::get('/education-programs', function () {
    return Inertia::render('Services/EducationPrograms');
})->name('services.educationPrograms');

Route::get('/medical-expertise', function () {
    return Inertia::render('Services/MedicalExpertise');
})->name('services.medicalExpertise');

Route::get('/accreditation', function () {
    return Inertia::render('Services/Accreditation');
})->name('services.accreditation');

// Маршруты для филиалов
Route::get('/branches/astana', function () {
    return Inertia::render('Branches/Astana');
})->name('branches.astana');

Route::get('/branches/almaty', function () {
    return Inertia::render('Branches/Almaty');
})->name('branches.almaty');

Route::get('/branches/akmola', function () {
    return Inertia::render('Branches/Akmola');
})->name('branches.akmola');

Route::get('/branches/aktobe', function () {
    return Inertia::render('Branches/Aktobe');
})->name('branches.aktobe');

Route::get('/branches/almatyregion', function () {
    return Inertia::render('Branches/AlmatyRegion');
})->name('branches.almatyregion');

Route::get('/branches/atyrau', function () {
    return Inertia::render('Branches/Atyrau');
})->name('branches.atyrau');

Route::get('/branches/east', function () {
    return Inertia::render('Branches/East');
})->name('branches.east');

Route::get('/branches/zhambyl', function () {
    return Inertia::render('Branches/Zhambyl');
})->name('branches.zhambyl');

Route::get('/branches/zhetisu', function () {
    return Inertia::render('Branches/Zhetisu');
})->name('branches.zhetisu');

Route::get('/branches/west', function () {
    return Inertia::render('Branches/West');
})->name('branches.west');

Route::get('/branches/karaganda', function () {
    return Inertia::render('Branches/Karaganda');
})->name('branches.karaganda');

Route::get('/branches/kostanay', function () {
    return Inertia::render('Branches/Kostanay');
})->name('branches.kostanay');

Route::get('/branches/kyzylorda', function () {
    return Inertia::render('Branches/Kyzylorda');
})->name('branches.kyzylorda');

Route::get('/branches/mangistau', function () {
    return Inertia::render('Branches/Mangistau');
})->name('branches.mangistau');

Route::get('/branches/pavlodar', function () {
    return Inertia::render('Branches/Pavlodar');
})->name('branches.pavlodar');

Route::get('/branches/north', function () {
    return Inertia::render('Branches/North');
})->name('branches.north');

Route::get('/branches/turkestan', function () {
    return Inertia::render('Branches/Turkestan');
})->name('branches.turkestan');

Route::get('/branches/ulytau', function () {
    return Inertia::render('Branches/Ulytau');
})->name('branches.ulytau');

Route::get('/branches/shymkent', function () {
    return Inertia::render('Branches/Shymkent');
})->name('branches.shymkent');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
