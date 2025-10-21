<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware для установки локали приложения
 * 
 * Порядок приоритета:
 * 1. Параметр ?lang в URL
 * 2. Сессия (locale)
 * 3. Заголовок X-Locale
 * 4. Дефолтная локаль из конфига
 */
class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLocales = config('i18n.locales', ['ru', 'kk', 'en']);
        $defaultLocale = config('i18n.default_locale', 'ru');

        // Получаем локаль из разных источников
        $locale = strtolower(
            $request->query('lang')
            ?? $request->session()->get('locale')
            ?? $request->header('X-Locale')
            ?? $defaultLocale
        );

        // Валидация локали
        if (!in_array($locale, $supportedLocales)) {
            $locale = $defaultLocale;
        }

        // Устанавливаем локаль
        App::setLocale($locale);
        
        // Сохраняем в сессии
        $request->session()->put('locale', $locale);

        return $next($request);
    }
}
