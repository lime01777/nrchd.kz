<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GlossaryTerm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

/**
 * Контроллер для управления глоссарием (защищенные термины)
 */
class GlossaryController extends Controller
{
    /**
     * Показать список терминов глоссария
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $locale = $request->input('locale', 'ru');
        $perPage = $request->input('per_page', 20);

        $query = GlossaryTerm::where('locale', $locale);

        if ($search) {
            $query->where('term', 'like', "%{$search}%");
        }

        $terms = $query->orderBy('term')
            ->paginate($perPage)
            ->withQueryString();

        $stats = [
            'ru' => GlossaryTerm::where('locale', 'ru')->where('active', true)->count(),
            'kk' => GlossaryTerm::where('locale', 'kk')->where('active', true)->count(),
            'en' => GlossaryTerm::where('locale', 'en')->where('active', true)->count(),
        ];

        return Inertia::render('Admin/Glossary/Index', [
            'terms' => $terms,
            'filters' => [
                'search' => $search,
                'locale' => $locale,
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Создать новый термин
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'term' => 'required|string|max:255',
            'locale' => 'required|string|in:ru,kk,en',
            'case_sensitive' => 'boolean',
            'tags' => 'nullable|array',
            'active' => 'boolean',
        ]);

        $term = GlossaryTerm::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Термин добавлен успешно',
            'data' => $term,
        ]);
    }

    /**
     * Обновить термин
     */
    public function update(Request $request, GlossaryTerm $term): JsonResponse
    {
        $validated = $request->validate([
            'term' => 'sometimes|string|max:255',
            'locale' => 'sometimes|string|in:ru,kk,en',
            'case_sensitive' => 'sometimes|boolean',
            'tags' => 'sometimes|nullable|array',
            'active' => 'sometimes|boolean',
        ]);

        $term->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Термин обновлен успешно',
            'data' => $term,
        ]);
    }

    /**
     * Удалить термин
     */
    public function destroy(GlossaryTerm $term): JsonResponse
    {
        $term->delete();

        return response()->json([
            'success' => true,
            'message' => 'Термин удален успешно',
        ]);
    }

    /**
     * Переключить активность термина
     */
    public function toggle(GlossaryTerm $term): JsonResponse
    {
        $term->toggleActive();

        return response()->json([
            'success' => true,
            'message' => 'Статус термина изменен',
            'data' => $term,
        ]);
    }

    /**
     * Массовое добавление терминов
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'terms' => 'required|array|min:1',
            'terms.*.term' => 'required|string|max:255',
            'terms.*.locale' => 'required|string|in:ru,kk,en',
            'terms.*.case_sensitive' => 'boolean',
            'terms.*.tags' => 'nullable|array',
        ]);

        $created = 0;

        foreach ($validated['terms'] as $termData) {
            GlossaryTerm::create(array_merge($termData, ['active' => true]));
            $created++;
        }

        return response()->json([
            'success' => true,
            'message' => "Добавлено терминов: {$created}",
            'count' => $created,
        ]);
    }

    /**
     * Импортировать ФИО сотрудников
     */
    public function importEmployees(Request $request): JsonResponse
    {
        // Получаем сотрудников из таблицы employees (если есть)
        try {
            $employees = \DB::table('employees')
                ->whereNotNull('first_name')
                ->whereNotNull('last_name')
                ->select('first_name', 'last_name', 'middle_name')
                ->get()
                ->map(function ($emp) {
                    return [
                        'first_name' => $emp->first_name,
                        'last_name' => $emp->last_name,
                        'middle_name' => $emp->middle_name ?? null,
                    ];
                })
                ->toArray();

            if (empty($employees)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Сотрудники не найдены в базе данных',
                ], 404);
            }

            $count = GlossaryTerm::bulkAddNames($employees);

            return response()->json([
                'success' => true,
                'message' => "Импортировано ФИО сотрудников: {$count}",
                'count' => $count,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка импорта: ' . $e->getMessage(),
            ], 500);
        }
    }
}

