<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Vacancy;

class VacancyController extends Controller
{
    /**
     * Отображение списка вакансий
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Получаем опубликованные вакансии, сортируя по дате публикации
        $vacancies = Vacancy::where('status', 'published')
                          ->orderBy('published_at', 'desc')
                          ->get();
        
        // Возвращаем Inertia-компонент со списком вакансий
        return Inertia::render('AboutCentre/Vacancies', [
            'vacancies' => $vacancies,
            'locale' => app()->getLocale(),
        ]);
    }

    /**
     * Отображение детальной страницы вакансии
     *
     * @param string $slug URL-идентификатор вакансии
     * @return \Inertia\Response
     */
    public function show($slug)
    {
        // Находим вакансию по slug или возвращаем 404
        $vacancy = Vacancy::where('slug', $slug)->firstOrFail();
        
        // Возвращаем Inertia-компонент с детальной информацией о вакансии
        return Inertia::render('AboutCentre/VacancyShow', [
            'vacancy' => $vacancy,
            'locale' => app()->getLocale(),
        ]);
    }
}
