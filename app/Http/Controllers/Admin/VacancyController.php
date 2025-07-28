<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class VacancyController extends Controller
{
    /**
     * Отображение списка всех вакансий в админке
     */
    public function index()
    {
        // Получаем все вакансии, сортируя по дате создания
        $vacancies = Vacancy::orderBy('created_at', 'desc')->get();

        // Возвращаем Inertia-компонент со списком вакансий
        return Inertia::render('Admin/Vacancies/Index', [
            'vacancies' => $vacancies,
        ]);
    }

    /**
     * Форма для создания новой вакансии
     */
    public function create()
    {
        return Inertia::render('Admin/Vacancies/Create');
    }

    /**
     * Сохранение новой вакансии
     */
    public function store(Request $request)
    {
        // Валидация входящих данных
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:vacancies,slug',
            'excerpt' => 'nullable|string',
            'body' => 'required|array',
            'city' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'employment_type' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
        ]);

        // Если slug не указан, генерируем из заголовка
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Если статус "published", устанавливаем дату публикации
        if ($validated['status'] === 'published' && !$request->has('published_at')) {
            $validated['published_at'] = now();
        }

        // Создаем новую вакансию
        Vacancy::create($validated);

        // Редирект с сообщением
        return redirect()->route('vacancies.index')
                         ->with('message', 'Вакансия успешно создана');
    }

    /**
     * Отображение деталей вакансии (не используется в админке)
     */
    public function show(string $id)
    {
        return redirect()->route('vacancies.edit', $id);
    }

    /**
     * Форма для редактирования вакансии
     */
    public function edit(string $id)
    {
        $vacancy = Vacancy::findOrFail($id);

        return Inertia::render('Admin/Vacancies/Edit', [
            'vacancy' => $vacancy,
        ]);
    }

    /**
     * Обновление вакансии
     */
    public function update(Request $request, string $id)
    {
        $vacancy = Vacancy::findOrFail($id);

        // Валидация входящих данных
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:vacancies,slug,' . $id,
            'excerpt' => 'nullable|string',
            'body' => 'required|array',
            'city' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'employment_type' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
        ]);

        // Если slug не указан, генерируем из заголовка
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Если статус меняется на "published" и нет даты публикации
        if ($validated['status'] === 'published' && $vacancy->status !== 'published' && !$vacancy->published_at) {
            $validated['published_at'] = now();
        }

        // Обновляем вакансию
        $vacancy->update($validated);

        // Редирект с сообщением
        return redirect()->route('vacancies.index')
                         ->with('message', 'Вакансия успешно обновлена');
    }

    /**
     * Удаление вакансии
     */
    public function destroy(string $id)
    {
        $vacancy = Vacancy::findOrFail($id);
        $vacancy->delete();

        // Редирект с сообщением
        return redirect()->route('vacancies.index')
                         ->with('message', 'Вакансия успешно удалена');
    }
}
