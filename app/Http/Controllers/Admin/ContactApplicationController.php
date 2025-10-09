<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ContactApplicationController extends Controller
{
    /**
     * Показать список всех заявок обратной связи
     */
    public function index(Request $request)
    {
        $query = ContactApplication::with('assignedUser')
            ->orderBy('created_at', 'desc');

        // Фильтр по статусу
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Фильтр по категории
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Фильтр по назначенному пользователю
        if ($request->has('assigned_to') && $request->assigned_to) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Поиск по имени, email, телефону или сообщению
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        $applications = $query->paginate(20)->through(function ($application) {
            return [
                'id' => $application->id,
                'category' => $application->category,
                'category_label' => $application->category_label,
                'name' => $application->name,
                'email' => $application->email,
                'phone' => $application->phone,
                'subject' => $application->subject,
                'message' => mb_substr($application->message, 0, 100) . (mb_strlen($application->message) > 100 ? '...' : ''),
                'status' => $application->status,
                'status_label' => $application->status_label,
                'status_color' => $application->status_color,
                'created_at' => $application->created_at->format('d.m.Y H:i'),
                'reviewed_at' => $application->reviewed_at ? $application->reviewed_at->format('d.m.Y H:i') : null,
                'assigned_user' => $application->assignedUser ? [
                    'id' => $application->assignedUser->id,
                    'name' => $application->assignedUser->name,
                ] : null,
            ];
        });

        // Получаем список пользователей для фильтра
        $users = User::select('id', 'name')
            ->orderBy('name')
            ->get();

        // Статистика
        $stats = [
            'total' => ContactApplication::count(),
            'new' => ContactApplication::where('status', 'new')->count(),
            'in_progress' => ContactApplication::where('status', 'in_progress')->count(),
            'resolved' => ContactApplication::where('status', 'resolved')->count(),
        ];

        // Статистика по категориям
        $categoryStats = [];
        foreach (ContactApplication::getCategories() as $key => $label) {
            $categoryStats[$key] = ContactApplication::where('category', $key)->count();
        }

        return Inertia::render('Admin/ContactApplications/Index', [
            'applications' => $applications,
            'users' => $users,
            'stats' => $stats,
            'categoryStats' => $categoryStats,
            'categories' => ContactApplication::getCategories(),
            'statuses' => ContactApplication::getStatuses(),
            'filters' => [
                'status' => $request->status ?? 'all',
                'category' => $request->category ?? 'all',
                'assigned_to' => $request->assigned_to ?? '',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Показать детали заявки
     */
    public function show($id)
    {
        $application = ContactApplication::with('assignedUser')->findOrFail($id);

        // Отмечаем как просмотренную, если статус "new"
        if ($application->status === 'new' && !$application->reviewed_at) {
            $application->update([
                'status' => 'in_progress',
                'reviewed_at' => now(),
            ]);
        }

        // Получаем список пользователей для назначения
        $users = User::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/ContactApplications/Show', [
            'application' => [
                'id' => $application->id,
                'category' => $application->category,
                'category_label' => $application->category_label,
                'name' => $application->name,
                'email' => $application->email,
                'phone' => $application->phone,
                'subject' => $application->subject,
                'message' => $application->message,
                'organization' => $application->organization,
                'project_name' => $application->project_name,
                'attachment_path' => $application->attachment_path,
                'attachment_url' => $application->attachment_path ? Storage::url($application->attachment_path) : null,
                'status' => $application->status,
                'status_label' => $application->status_label,
                'status_color' => $application->status_color,
                'admin_notes' => $application->admin_notes,
                'created_at' => $application->created_at->format('d.m.Y H:i'),
                'reviewed_at' => $application->reviewed_at ? $application->reviewed_at->format('d.m.Y H:i') : null,
                'assigned_user' => $application->assignedUser ? [
                    'id' => $application->assignedUser->id,
                    'name' => $application->assignedUser->name,
                ] : null,
            ],
            'users' => $users,
            'statuses' => ContactApplication::getStatuses(),
        ]);
    }

    /**
     * Обновить статус заявки
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', array_keys(ContactApplication::getStatuses())),
        ]);

        $application = ContactApplication::findOrFail($id);
        $application->update([
            'status' => $request->status,
            'reviewed_at' => $request->status !== 'new' && !$application->reviewed_at ? now() : $application->reviewed_at,
        ]);

        return back()->with('success', 'Статус заявки обновлен');
    }

    /**
     * Обновить заметки администратора
     */
    public function updateNotes(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        $application = ContactApplication::findOrFail($id);
        $application->update([
            'admin_notes' => $request->admin_notes,
        ]);

        return back()->with('success', 'Заметки обновлены');
    }

    /**
     * Назначить заявку пользователю
     */
    public function assign(Request $request, $id)
    {
        $request->validate([
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $application = ContactApplication::findOrFail($id);
        $application->update([
            'assigned_to' => $request->assigned_to,
        ]);

        return back()->with('success', 'Заявка назначена');
    }

    /**
     * Удалить заявку
     */
    public function destroy($id)
    {
        $application = ContactApplication::findOrFail($id);
        
        // Удаляем файл вложения, если он есть
        if ($application->attachment_path && Storage::disk('public')->exists($application->attachment_path)) {
            Storage::disk('public')->delete($application->attachment_path);
        }
        
        $application->delete();

        return redirect()->route('admin.contact-applications.index')
            ->with('success', 'Заявка удалена');
    }
}

