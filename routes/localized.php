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
    if (!in_array($locale, ['ru', 'kk', 'en'])) {
        $locale = config('i18n.default_locale', 'ru');
    }
    
    // Сохраняем в сессии
    session(['locale' => $locale]);
    
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
    if (!in_array($locale, ['ru', 'kk', 'en'])) {
        $locale = config('i18n.default_locale', 'ru');
    }
    
    session(['locale' => $locale]);
    
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

// Add other routes here with the same translation pattern
