<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SimpleLanguageMiddleware
{
    /**
     * Доступные языки
     */
    protected $availableLanguages = ['kz', 'ru', 'en'];
    
    /**
     * Язык по умолчанию (казахский)
     */
    protected $defaultLanguage = 'kz';
    
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->detectLanguage($request);
        
        // Устанавливаем язык приложения
        App::setLocale($locale);
        
        // Сохраняем в сессии
        Session::put('locale', $locale);
        
        // Добавляем информацию о языке в заголовки для фронтенда
        $response = $next($request);
        
        if ($response instanceof \Illuminate\Http\Response) {
            $response->header('X-App-Locale', $locale);
        }
        
        return $response;
    }
    
    /**
     * Определяем язык из различных источников
     */
    protected function detectLanguage(Request $request): string
    {
        // 1. Проверяем URL сегмент (например, /ru/, /en/, /kz/)
        $path = $request->path();
        $segments = explode('/', $path);
        
        if (!empty($segments[0]) && in_array($segments[0], $this->availableLanguages)) {
            return $segments[0];
        }
        
        // 2. Проверяем параметр lang в URL
        if ($request->has('lang') && in_array($request->get('lang'), $this->availableLanguages)) {
            return $request->get('lang');
        }
        
        // 3. Проверяем сессию
        if (Session::has('locale') && in_array(Session::get('locale'), $this->availableLanguages)) {
            return Session::get('locale');
        }
        
        // 4. Проверяем Accept-Language заголовок
        $acceptLanguage = $request->header('Accept-Language');
        if ($acceptLanguage) {
            $languages = explode(',', $acceptLanguage);
            foreach ($languages as $lang) {
                $lang = trim(explode(';', $lang)[0]);
                $lang = substr($lang, 0, 2); // Берем только первые 2 символа
                
                if (in_array($lang, $this->availableLanguages)) {
                    return $lang;
                }
            }
        }
        
        // 5. Возвращаем язык по умолчанию (казахский)
        return $this->defaultLanguage;
    }
}
