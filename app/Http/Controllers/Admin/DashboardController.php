<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Document;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $userCount = User::count();
        $documentCount = Document::count();
        $newsCount = News::count();

        // Получаем статистику посещений из Яндекс.Метрики (с кэшированием)
        $visitorsStats = $this->getVisitorsStats();

        // Последние новости
        $recentNews = News::orderBy('created_at', 'desc')
            ->take(4)
            ->get(['id', 'title', 'created_at', 'views']);

        // Последние действия (MVP: создание пользователей, новостей, документов)
        $userActions = User::orderBy('created_at', 'desc')->take(4)->get()->map(function($u) {
            return [
                'type' => 'user',
                'user' => $u->name,
                'action' => 'создал пользователя',
                'target' => $u->email,
                'time' => $u->created_at,
            ];
        });
        $newsActions = News::orderBy('created_at', 'desc')->take(4)->get()->map(function($n) {
            return [
                'type' => 'news',
                'user' => '—',
                'action' => 'создал новость',
                'target' => $n->title,
                'time' => $n->created_at,
            ];
        });
        $docActions = Document::orderBy('created_at', 'desc')->take(4)->get()->map(function($d) {
            return [
                'type' => 'document',
                'user' => '—',
                'action' => 'загрузил документ',
                'target' => $d->description,
                'time' => $d->created_at,
            ];
        });
        // Объединяем, сортируем по времени, берем 4 последних
        $recentActivities = collect()
            ->merge($userActions)
            ->merge($newsActions)
            ->merge($docActions)
            ->sortByDesc('time')
            ->take(4)
            ->map(function($a) {
                $a['time'] = $a['time']->diffForHumans();
                return $a;
            })
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $userCount,
                'documents' => $documentCount,
                'news' => $newsCount,
                'visitorsToday' => $visitorsStats['today'],
                'visitorsWeek' => $visitorsStats['week'],
                'visitorsMonth' => $visitorsStats['month'],
                'pageViewsToday' => $visitorsStats['pageViewsToday'],
                'avgSessionDuration' => $visitorsStats['avgSessionDuration'],
            ],
            'recentNews' => $recentNews,
            'recentActivities' => $recentActivities,
        ]);
    }

    /**
     * Получает статистику посещений из Яндекс.Метрики с кэшированием
     */
    private function getVisitorsStats()
    {
        // Кэшируем данные на 15 минут
        return Cache::remember('yandex_metrika_stats', 900, function () {
            $stats = [
                'today' => null,
                'week' => null,
                'month' => null,
                'pageViewsToday' => null,
                'avgSessionDuration' => null,
            ];

            try {
                $token = env('YANDEX_METRIKA_TOKEN');
                $counter = env('YANDEX_METRIKA_COUNTER');
                
                if (!$token || !$counter) {
                    Log::warning('Yandex Metrika credentials not configured');
                    return $stats;
                }

                $client = new Client(['timeout' => 10]);
                $today = now()->format('Y-m-d');
                $weekAgo = now()->subDays(7)->format('Y-m-d');
                $monthAgo = now()->subDays(30)->format('Y-m-d');

                // Получаем данные за сегодня
                $todayResponse = $client->get('https://api-metrika.yandex.net/stat/v1/data', [
                    'headers' => [
                        'Authorization' => 'OAuth ' . $token,
                    ],
                    'query' => [
                        'ids' => $counter,
                        'metrics' => 'ym:s:visitors,ym:s:pageviews,ym:s:avgSessionDuration',
                        'date1' => $today,
                        'date2' => $today,
                    ],
                ]);

                $todayData = json_decode($todayResponse->getBody(), true);
                if (isset($todayData['data'][0]['metrics'])) {
                    $metrics = $todayData['data'][0]['metrics'];
                    $stats['today'] = $metrics[0] ?? null;
                    $stats['pageViewsToday'] = $metrics[1] ?? null;
                    $stats['avgSessionDuration'] = $metrics[2] ?? null;
                }

                // Получаем данные за неделю
                $weekResponse = $client->get('https://api-metrika.yandex.net/stat/v1/data', [
                    'headers' => [
                        'Authorization' => 'OAuth ' . $token,
                    ],
                    'query' => [
                        'ids' => $counter,
                        'metrics' => 'ym:s:visitors',
                        'date1' => $weekAgo,
                        'date2' => $today,
                    ],
                ]);

                $weekData = json_decode($weekResponse->getBody(), true);
                if (isset($weekData['data'][0]['metrics'][0])) {
                    $stats['week'] = $weekData['data'][0]['metrics'][0];
                }

                // Получаем данные за месяц
                $monthResponse = $client->get('https://api-metrika.yandex.net/stat/v1/data', [
                    'headers' => [
                        'Authorization' => 'OAuth ' . $token,
                    ],
                    'query' => [
                        'ids' => $counter,
                        'metrics' => 'ym:s:visitors',
                        'date1' => $monthAgo,
                        'date2' => $today,
                    ],
                ]);

                $monthData = json_decode($monthResponse->getBody(), true);
                if (isset($monthData['data'][0]['metrics'][0])) {
                    $stats['month'] = $monthData['data'][0]['metrics'][0];
                }

                Log::info('Yandex Metrika data fetched successfully', $stats);

            } catch (\Exception $e) {
                Log::error('Error fetching Yandex Metrika data: ' . $e->getMessage());
            }

            return $stats;
        });
    }
}