<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VacancyApplication;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class VacancyApplicationController extends Controller
{
    /**
     * Показать список всех заявок на вакансии
     */
    public function index(Request $request)
    {
        $query = VacancyApplication::with('vacancy')
            ->orderBy('created_at', 'desc');

        // Фильтр по статусу
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Фильтр по вакансии
        if ($request->has('vacancy_id') && $request->vacancy_id) {
            $query->where('vacancy_id', $request->vacancy_id);
        }

        // Поиск по имени или email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $applications = $query->paginate(20)->through(function ($application) {
            return [
                'id' => $application->id,
                'name' => $application->name,
                'email' => $application->email,
                'phone' => $application->phone,
                'status' => $application->status,
                'status_label' => $application->status_label,
                'status_color' => $application->status_color,
                'created_at' => $application->created_at->format('d.m.Y H:i'),
                'reviewed_at' => $application->reviewed_at ? $application->reviewed_at->format('d.m.Y H:i') : null,
                'vacancy' => [
                    'id' => $application->vacancy->id,
                    'title' => $application->vacancy->title,
                    'slug' => $application->vacancy->slug,
                ],
            ];
        });

        // Получаем список вакансий для фильтра
        $vacancies = Vacancy::select('id', 'title')
            ->where('status', 'published')
            ->orderBy('title')
            ->get();

        // Статистика
        $stats = [
            'total' => VacancyApplication::count(),
            'new' => VacancyApplication::where('status', 'new')->count(),
            'reviewed' => VacancyApplication::where('status', 'reviewed')->count(),
            'contacted' => VacancyApplication::where('status', 'contacted')->count(),
            'hired' => VacancyApplication::where('status', 'hired')->count(),
        ];

        return Inertia::render('Admin/VacancyApplications/Index', [
            'applications' => $applications,
            'vacancies' => $vacancies,
            'stats' => $stats,
            'filters' => [
                'status' => $request->status ?? 'all',
                'vacancy_id' => $request->vacancy_id ?? '',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Показать детали заявки
     */
    public function show($id)
    {
        $application = VacancyApplication::with('vacancy')->findOrFail($id);

        // Отмечаем как просмотренную, если статус "new"
        if ($application->status === 'new') {
            $application->update([
                'status' => 'reviewed',
                'reviewed_at' => now(),
            ]);
        }

        return Inertia::render('Admin/VacancyApplications/Show', [
            'application' => [
                'id' => $application->id,
                'name' => $application->name,
                'email' => $application->email,
                'phone' => $application->phone,
                'cover_letter' => $application->cover_letter,
                'resume_path' => $application->resume_path,
                'resume_url' => Storage::url($application->resume_path),
                'status' => $application->status,
                'status_label' => $application->status_label,
                'status_color' => $application->status_color,
                'notes' => $application->notes,
                'created_at' => $application->created_at->format('d.m.Y H:i'),
                'reviewed_at' => $application->reviewed_at ? $application->reviewed_at->format('d.m.Y H:i') : null,
                'vacancy' => [
                    'id' => $application->vacancy->id,
                    'title' => $application->vacancy->title,
                    'slug' => $application->vacancy->slug,
                    'department' => $application->vacancy->department,
                    'city' => $application->vacancy->city,
                ],
            ],
        ]);
    }

    /**
     * Обновить статус заявки
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:new,reviewed,contacted,rejected,hired',
        ]);

        $application = VacancyApplication::findOrFail($id);
        $application->update([
            'status' => $request->status,
            'reviewed_at' => $request->status !== 'new' && !$application->reviewed_at ? now() : $application->reviewed_at,
        ]);

        return back()->with('success', 'Статус заявки обновлен');
    }

    /**
     * Обновить заметки HR
     */
    public function updateNotes(Request $request, $id)
    {
        $request->validate([
            'notes' => 'nullable|string|max:2000',
        ]);

        $application = VacancyApplication::findOrFail($id);
        $application->update([
            'notes' => $request->notes,
        ]);

        return back()->with('success', 'Заметки обновлены');
    }

    /**
     * Удалить заявку
     */
    public function destroy($id)
    {
        $application = VacancyApplication::findOrFail($id);
        
        // Удаляем файл резюме
        if ($application->resume_path && Storage::disk('public')->exists($application->resume_path)) {
            Storage::disk('public')->delete($application->resume_path);
        }
        
        $application->delete();

        return redirect()->route('admin.vacancy-applications.index')
            ->with('success', 'Заявка удалена');
    }
}


