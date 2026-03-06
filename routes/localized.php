<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Localized Routes
|--------------------------------------------------------------------------
|
| Here is where you can register localized routes for your application.
| These routes will be loaded inside a route group with the locale prefix.
|
*/

// Home page
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'locale' => app()->getLocale(),
        'locales' => config('i18n.locales', ['ru', 'kk', 'en']),
    ]);
})->name('home');

// Route for switching languages (POST with JSON response for API)
Route::post('locale/{locale}', function ($locale) {
    if (!in_array($locale, ['ru', 'kz', 'en'])) {
        $locale = config('i18n.default_locale', 'ru');
    }
    
    // Сохраняем в сессии
    session(['locale' => $locale]);
    // Also set 'language' key for compatibility with LanguageMiddleware
    session(['language' => $locale]);
    
    // Устанавливаем локаль приложения
    app()->setLocale($locale);
    
    // Если это AJAX/Fetch запрос, возвращаем JSON
    if (request()->ajax() || request()->wantsJson() || request()->expectsJson()) {
        return response()->json([
            'success' => true,
            'language' => $locale,
            'message' => 'Language updated successfully'
        ]);
    }
    
    // Иначе редирект обратно (для обычных форм)
    return redirect()->back();
})->name('locale.set');

// Старый маршрут для совместимости (GET)
Route::get('change-language/{locale}', function ($locale) {
    if (!in_array($locale, ['ru', 'kz', 'en'])) {
        $locale = config('i18n.default_locale', 'ru');
    }
    
    session(['locale' => $locale]);
    session(['language' => $locale]);
    
    return redirect()->back();
})->name('change.language');


// Example routes - переводы обрабатываются на фронтенде через систему i18n
Route::get('/medical-education', function () {
    return Inertia::render('Direction/MedicalEducation', [
        'locale' => app()->getLocale(),
    ]);
})->name('medical.education');

Route::get('/news', function () {
    return Inertia::render('News', [
        'locale' => app()->getLocale(),
    ]);
})->name('news');

// Маршруты для Центральной комиссии по биоэтике
Route::get('/bioethics', function () {
    return Inertia::render('Direction/Bioethics', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics');

Route::get('/bioethics/expertise', function () {
    return Inertia::render('Direction/Bioethics/Expertise', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics.expertise');

Route::get('/bioethics/certification', function () {
    return Inertia::render('Direction/Bioethics/Certification', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics.certification');

Route::get('/bioethics/biobanks', function () {
    return Inertia::render('Direction/Bioethics/Biobanks', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics.biobanks');

Route::get('/bioethics/local-commissions', function () {
    return Inertia::render('Direction/Bioethics/LocalCommissions', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics.local_commissions');

Route::get('/bioethics/composition', function () {
    return Inertia::render('Direction/Bioethics/Composition', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics.composition');

Route::get('/bioethics/npa', function () {
    return Inertia::render('Direction/Bioethics/NPA', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics.npa');

Route::get('/bioethics/documents', function () {
    return Inertia::render('Direction/Bioethics/Documents', [
        'locale' => app()->getLocale(),
    ]);
})->name('bioethics.documents');

// Center Prevention Routes
Route::get('/direction/center-prevention', function () {
    return Inertia::render('Direction/CenterPrevention');
})->name('direction.center_prevention');

Route::get('/direction/center-prevention/prevention-programs', function () {
    return Inertia::render('Direction/CenterPrevention/PreventionPrograms');
})->name('direction.center_prevention.prevention_programs');

Route::get('/direction/center-prevention/healthy-lifestyle', function () {
    return Inertia::render('Direction/CenterPrevention/HealthyLifestyle');
})->name('direction.center_prevention.healthy_lifestyle');

Route::get('/direction/center-prevention/communications', function () {
    return Inertia::render('Direction/CenterPrevention/Communications');
})->name('direction.center_prevention.communications');

Route::get('/direction/center-prevention/infographics', function () {
    return Inertia::render('Direction/CenterPrevention/Infographics');
})->name('direction.center_prevention.infographics');

Route::get('/direction/center-prevention/videos', function () {
    return Inertia::render('Direction/CenterPrevention/Videos');
})->name('direction.center_prevention.videos');

// Маршруты для новых папок ЗОЖ: Законодательство, Подкасты, Инструменты
Route::get('/direction/center-prevention/legislation', function () {
    return Inertia::render('Direction/CenterPrevention/Legislation');
})->name('direction.center_prevention.legislation');

Route::get('/direction/center-prevention/podcasts', function () {
    return Inertia::render('Direction/CenterPrevention/Podcasts');
})->name('direction.center_prevention.podcasts');

Route::get('/direction/center-prevention/tools', function () {
    return Inertia::render('Direction/CenterPrevention/Tools');
})->name('direction.center_prevention.tools');

Route::get('/direction/center-prevention/zozh-reports', function () {
    return Inertia::render('Direction/CenterPrevention/ZozhReports');
})->name('direction.center_prevention.zozh_reports');

// Research Hub routes
Route::get('/research-hub', [\App\Http\Controllers\ResearchController::class, 'index'])->name('research_hub.index');
Route::get('/research-hub/{slug}', [\App\Http\Controllers\ResearchController::class, 'show'])->name('research_hub.show');

