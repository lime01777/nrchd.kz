<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
