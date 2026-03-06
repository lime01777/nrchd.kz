<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use App\Models\User;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $userId = $request->input('user_id', '');
        
        $query = Activity::with('causer')->latest();
        
        if ($search) {
            $query->where('description', 'like', "%{$search}%")
                  ->orWhere('properties->path', 'like', "%{$search}%")
                  ->orWhere('properties->ip', 'like', "%{$search}%");
        }
        
        if ($userId) {
            $query->where('causer_id', $userId)
                  ->where('causer_type', User::class);
        }
        
        $logs = $query->paginate(20)->withQueryString()->through(function($log) {
            return [
                'id' => $log->id,
                'description' => $log->description,
                'path' => $log->properties['path'] ?? null,
                'method' => $log->properties['method'] ?? null,
                'ip' => $log->properties['ip'] ?? null,
                'params' => $log->properties['params'] ?? null,
                'user' => $log->causer ? $log->causer->name : 'Система',
                'created_at' => $log->created_at->timezone('Asia/Almaty')->format('d.m.Y H:i:s'),
                'created_at_diff' => $log->created_at->timezone('Asia/Almaty')->diffForHumans(),
            ];
        });

        $users = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs,
            'filters' => [
                'search' => $search,
                'user_id' => $userId,
            ],
            'users' => $users,
        ]);
    }
}
