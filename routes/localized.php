<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Services\TranslationService;

/*
|--------------------------------------------------------------------------
| Localized Routes
|--------------------------------------------------------------------------
|
| Here is where you can register localized routes for your application.
| These routes will be loaded inside a route group with the locale prefix.
|
*/

// Home page with translations
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'locale' => app()->getLocale(),
        'translations' => TranslationService::getForPage('home', app()->getLocale()),
    ]);
})->name('home');

// Route for switching languages
Route::get('change-language/{locale}', function ($locale) {
    if (!in_array($locale, ['ru', 'en', 'kz'])) {
        $locale = 'ru';
    }
    
    $currentUrl = url()->previous();
    $segments = explode('/', parse_url($currentUrl, PHP_URL_PATH));
    
    // Remove first empty segment
    array_shift($segments);
    
    // Replace language segment or add it if it doesn't exist
    if (count($segments) > 0 && in_array($segments[0], ['ru', 'en', 'kz'])) {
        $segments[0] = $locale;
    } else {
        array_unshift($segments, $locale);
    }
    
    // Reconstruct the URL
    $redirectPath = '/' . implode('/', $segments);
    
    return redirect($redirectPath);
})->name('change.language');

// Example routes - each needs to pass translations
Route::get('/medical-education', function () {
    return Inertia::render('Direction/MedicalEducation', [
        'locale' => app()->getLocale(),
        'translations' => TranslationService::getForPage('medical_education', app()->getLocale()),
    ]);
})->name('medical.education');

Route::get('/news', function () {
    return Inertia::render('News', [
        'locale' => app()->getLocale(),
        'translations' => TranslationService::getForPage('news', app()->getLocale()),
    ]);
})->name('news');

// Add other routes here with the same translation pattern
