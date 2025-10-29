<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YouthHealthCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class YouthHealthCenterController extends Controller
{
    /**
     * Отображение списка всех МЦЗ
     */
    public function index(Request $request)
    {
        $query = YouthHealthCenter::query();

        // Поиск
        if ($request->has('search') && !empty($request->search)) {
            $query->search($request->search);
        }

        // Фильтр по региону
        if ($request->has('region') && !empty($request->region)) {
            $query->byRegion($request->region);
        }

        // Сортировка
        $sortField = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $centers = $query->paginate(20)->appends($request->query());

        // Список всех регионов для фильтра
        $regions = YouthHealthCenter::distinct()
            ->pluck('region')
            ->sort()
            ->values();

        return Inertia::render('Admin/YouthHealthCenters/Index', [
            'centers' => $centers,
            'regions' => $regions,
            'filters' => [
                'search' => $request->search,
                'region' => $request->region,
                'sort_by' => $sortField,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Форма создания нового МЦЗ
     */
    public function create()
    {
        return Inertia::render('Admin/YouthHealthCenters/Create');
    }

    /**
     * Сохранение нового МЦЗ
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'address' => 'required|string',
            'region' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'is_active' => 'boolean',
        ]);

        YouthHealthCenter::create($validated);

        return redirect()->route('admin.youth-health-centers.index')
            ->with('success', 'Молодежный центр здоровья успешно создан');
    }

    /**
     * Форма редактирования МЦЗ
     */
    public function edit(YouthHealthCenter $youthHealthCenter)
    {
        return Inertia::render('Admin/YouthHealthCenters/Edit', [
            'center' => $youthHealthCenter,
        ]);
    }

    /**
     * Обновление МЦЗ
     */
    public function update(Request $request, YouthHealthCenter $youthHealthCenter)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'address' => 'required|string',
            'region' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'is_active' => 'boolean',
        ]);

        $youthHealthCenter->update($validated);

        return redirect()->route('admin.youth-health-centers.index')
            ->with('success', 'Молодежный центр здоровья успешно обновлен');
    }

    /**
     * Удаление МЦЗ
     */
    public function destroy(YouthHealthCenter $youthHealthCenter)
    {
        $youthHealthCenter->delete();

        return redirect()->route('admin.youth-health-centers.index')
            ->with('success', 'Молодежный центр здоровья успешно удален');
    }

    /**
     * Массовое удаление МЦЗ
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:youth_health_centers,id',
        ]);

        YouthHealthCenter::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('admin.youth-health-centers.index')
            ->with('success', 'Выбранные центры успешно удалены');
    }

    /**
     * Переключение активности МЦЗ
     */
    public function toggleActive(YouthHealthCenter $youthHealthCenter)
    {
        $youthHealthCenter->update([
            'is_active' => !$youthHealthCenter->is_active
        ]);

        return response()->json([
            'success' => true,
            'is_active' => $youthHealthCenter->is_active,
        ]);
    }
}

