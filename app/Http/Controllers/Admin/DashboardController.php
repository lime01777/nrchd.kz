<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Document;
use App\Models\News;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $documentCount = Document::count();
        $newsCount = News::count();
        $commentCount = Comment::count();

        // Получаем статистику посещений из Яндекс.Метрики (с кэшированием)
        $visitorsStats = $this->getVisitorsStats();

        // Последние новости
        $recentNews = News::orderBy('created_at', 'desc')
            ->take(4)
            ->get(['id', 'title', 'created_at', 'views']);

        // Последние комментарии
        $recentComments = Comment::with('news:id,title')
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function($c) {
                return [
                    'id' => $c->id,
                    'user' => $c->name,
                    'action' => 'прокомментировал',
                    'target' => $c->news?->title ?? 'удаленную новость',
                    'time' => $c->created_at->diffForHumans(),
                    'content' => $c->content,
                    'is_approved' => $c->is_approved,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'documents' => $documentCount,
                'news' => $newsCount,
                'comments' => $commentCount,
                'visitorsWeek' => $visitorsStats['week'],
            ],
            'recentNews' => $recentNews,
            'recentComments' => $recentComments,
        ]);
    }

    /**
     * Получает статистику посещений из Яндекс.Метрики с кэшированием
     */
    private function getVisitorsStats()
    {
        // Кэшируем данные на 15 минут
        return Cache::remember('yandex_metrika_stats_limited', 900, function () {
            $stats = [
                'week' => null,
            ];

            try {
                $token = env('YANDEX_METRIKA_TOKEN');
                $counter = env('YANDEX_METRIKA_COUNTER');
                
                if (!$token || !$counter) {
                    return $stats;
                }

                $client = new Client(['timeout' => 10]);
                $today = now()->format('Y-m-d');
                $weekAgo = now()->subDays(7)->format('Y-m-d');

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

            } catch (\Exception $e) {
                Log::error('Error fetching Yandex Metrika data: ' . $e->getMessage());
            }

            return $stats;
        });
    }
}