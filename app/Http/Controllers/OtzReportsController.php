<?php

namespace App\Http\Controllers;

use App\Models\OtzApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OtzReportsController extends Controller
{
    /**
     * Отображает страницу отчетов ОТЗ с заявками
     */
    public function index(Request $request)
    {
        // Временные тестовые данные (пока база данных не подключена)
        $applications = collect([
            [
                'id' => 1,
                'application_id' => 'OT3-2025-0001',
                'title' => 'Тестовая заявка ОТЗ 1',
                'category' => 'Комплексная',
                'current_stage' => 'Подача заявки',
                'description' => 'Описание тестовой заявки 1',
                'responsible_person' => 'Иванов И.И.',
                'phone' => '+7 777 123 45 67',
                'email' => 'test1@example.com',
                'stage_start_date' => '2025-01-01',
                'stage_end_date' => '2025-01-31',
                'is_active' => true
            ],
            [
                'id' => 2,
                'application_id' => 'OT3-2025-0002',
                'title' => 'Тестовая заявка ОТЗ 2',
                'category' => 'Простая',
                'current_stage' => 'Проверка документов',
                'description' => 'Описание тестовой заявки 2',
                'responsible_person' => 'Петров П.П.',
                'phone' => '+7 777 234 56 78',
                'email' => 'test2@example.com',
                'stage_start_date' => '2025-02-01',
                'stage_end_date' => '2025-02-28',
                'is_active' => true
            ]
        ]);

        // Отладочная информация
        Log::info('OtzReportsController: Loading test applications', [
            'count' => $applications->count(),
            'applications' => $applications->toArray()
        ]);

        return Inertia::render('Direction/HealthRate/OtzReports', [
            'applications' => $applications,
            'categories' => OtzApplication::getCategories(),
            'stages' => OtzApplication::getStages(),
        ]);
    }
}
