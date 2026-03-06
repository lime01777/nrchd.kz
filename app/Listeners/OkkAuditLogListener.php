<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Request;

class OkkAuditLogListener
{
    public function handleLogin(Login $event)
    {
        $user = $event->user;
        if ($user && method_exists($user, 'hasPermission') && $user->hasPermission('okk_committee')) {
            $log = AuditLog::create([
                'user_id' => $user->id,
                'action' => 'login',
                'ip_address' => Request::ip()
            ]);
            Session::put('okk_audit_log_id', $log->id);
            Session::put('okk_login_time', now()->timestamp);
        }
    }

    public function handleLogout(Logout $event)
    {
        $user = $event->user;
        if ($user && method_exists($user, 'hasPermission') && $user->hasPermission('okk_committee')) {
            $loginTime = Session::get('okk_login_time');
            $duration = $loginTime ? now()->timestamp - $loginTime : null;
            
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'logout',
                'duration_seconds' => $duration,
                'ip_address' => Request::ip()
            ]);

            Session::forget(['okk_audit_log_id', 'okk_login_time']);
        }
    }
}
