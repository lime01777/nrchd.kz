<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ConferenceSubdomainMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Проверяем, запрос пришел на субдомен conference или нет
        $isConferenceSubdomain = strpos($request->getHost(), 'conference.') === 0;
        
        // Устанавливаем переменную, доступную в шаблонах
        view()->share('isConferenceSubdomain', $isConferenceSubdomain);
        
        return $next($request);
    }
}
