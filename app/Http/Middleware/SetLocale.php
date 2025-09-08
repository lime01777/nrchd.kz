<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

/**
 * Выбирает локаль: ?lang → session → X-Locale → config('app.locale').
 * Разрешено: kk, ru, en. Дефолт: kk.
 */
class SetLocale {
    public function handle(Request $request, Closure $next) {
        $locale = strtolower($request->query('lang')
            ?: ($request->session()->get('lang') ?: ($request->header('X-Locale') ?: config('app.locale','kk'))));

        if (!in_array($locale, ['kk','ru','en'])) $locale = 'kk';

        App::setLocale($locale);
        $request->session()->put('lang', $locale);
        return $next($request);
    }
}
