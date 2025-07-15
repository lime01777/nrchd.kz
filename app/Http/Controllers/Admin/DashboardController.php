<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Document;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use GuzzleHttp\Client;

class DashboardController extends Controller
{
    public function index()
    {
        $userCount = User::count();
        $documentCount = Document::count();
        $newsCount = News::count();

        // Получаем число посетителей за сегодня через API Яндекс.Метрики
        $visitorsToday = null;
        try {
            $token = env('YANDEX_METRIKA_TOKEN');
            $counter = env('YANDEX_METRIKA_COUNTER');
            if ($token && $counter) {
                $client = new Client();
                $date = now()->format('Y-m-d');
                $response = $client->get('https://api-metrika.yandex.net/stat/v1/data', [
                    'headers' => [
                        'Authorization' => 'OAuth ' . $token,
                    ],
                    'query' => [
                        'ids' => $counter,
                        'metrics' => 'ym:s:visitors',
                        'date1' => $date,
                        'date2' => $date,
                    ],
                    'timeout' => 5,
                ]);
                $data = json_decode($response->getBody(), true);
                if (isset($data['data'][0]['metrics'][0])) {
                    $visitorsToday = $data['data'][0]['metrics'][0];
                }
            }
        } catch (\Exception $e) {
            // Можно залогировать ошибку, если нужно
            $visitorsToday = null;
        }

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
                'visitorsToday' => $visitorsToday,
            ],
            'recentNews' => $recentNews,
            'recentActivities' => $recentActivities,
        ]);
    }
} 