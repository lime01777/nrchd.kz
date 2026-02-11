<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ConferenceRegistrationController;

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
