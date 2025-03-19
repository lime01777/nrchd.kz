<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        // Здесь будет логика получения данных для дашборда
        // Пока возвращаем тестовые данные
        $stats = [
            'newsCount' => 15,
            'documentsCount' => 42,
            'usersCount' => 8,
            'viewsCount' => 1250,
        ];

        $recentNews = [
            [
                'id' => 1,
                'title' => 'Новые методы лечения в кардиологии',
                'created_at' => '2024-03-15',
                'views' => 120
            ],
            [
                'id' => 2,
                'title' => 'Конференция по инновациям в здравоохранении',
                'created_at' => '2024-03-10',
                'views' => 85
            ],
            [
                'id' => 3,
                'title' => 'Новое оборудование для диагностики',
                'created_at' => '2024-03-05',
                'views' => 65
            ],
        ];

        $recentDocuments = [
            [
                'id' => 1,
                'title' => 'Стратегия развития здравоохранения',
                'created_at' => '2024-03-15',
                'downloads' => 45
            ],
            [
                'id' => 2,
                'title' => 'Отчет о медицинских исследованиях',
                'created_at' => '2024-03-10',
                'downloads' => 32
            ],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentNews' => $recentNews,
            'recentDocuments' => $recentDocuments,
        ]);
    }
}
