<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Document;
use App\Models\News;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        $documentCount = Document::count();
        $newsCount = News::count();
        $commentCount = Comment::count();

        // Среднее количество просмотров новостей
        $averageViews = round(News::avg('views') ?? 0);

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
                'averageViews' => $averageViews,
            ],
            'recentNews' => $recentNews,
            'recentComments' => $recentComments,
        ]);
    }


}