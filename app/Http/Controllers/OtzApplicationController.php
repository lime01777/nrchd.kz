<?php

namespace App\Http\Controllers;

use App\Models\OtzApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OtzApplicationController extends Controller
{
    /**
     * Отображает список заявок ОТЗ для публичной части
     */
    public function index(Request $request)
    {
        $query = OtzApplication::where('is_active', true);

        // Поиск по названию
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('application_id', 'like', '%' . $request->search . '%');
        }

        // Фильтрация по категории
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Фильтрация по этапу
        if ($request->filled('stage')) {
            $query->where('current_stage', $request->stage);
        }

        $applications = $query->orderBy('created_at', 'desc')
                             ->paginate(12)
                             ->withQueryString();

        return Inertia::render('Direction/HealthRate/OtzApplications', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'category', 'stage']),
            'categories' => OtzApplication::getCategories(),
            'stages' => OtzApplication::getStages(),
        ]);
    }

    /**
     * Отображает детальную информацию о заявке
     */
    public function show(OtzApplication $otzApplication)
    {
        if (!$otzApplication->is_active) {
            abort(404);
        }

        return Inertia::render('Direction/HealthRate/OtzApplicationDetail', [
            'application' => $otzApplication,
            'stages' => OtzApplication::getStages(),
        ]);
    }

    /**
     * Получает данные заявки для модального окна (AJAX)
     */
    public function getApplicationData(OtzApplication $otzApplication)
    {
        if (!$otzApplication->is_active) {
            return response()->json(['error' => 'Заявка не найдена'], 404);
        }

        return response()->json([
            'application' => $otzApplication,
            'stages' => OtzApplication::getStages(),
        ]);
    }
}
