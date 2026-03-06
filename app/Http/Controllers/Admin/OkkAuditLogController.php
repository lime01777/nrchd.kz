<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OkkAuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'user_name' => $log->user ? $log->user->name : 'Неизвестно',
                    'action' => $log->action,
                    'entity_path' => $log->entity_path,
                    'duration_seconds' => $log->duration_seconds,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Admin/OKK/AuditLogs', [
            'logs' => $logs
        ]);
    }
}
