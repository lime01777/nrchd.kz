<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class LanguageMiddleware
{
    /**
     * Доступные языки на сайте
     */
    protected $availableLanguages = ['ru', 'kk', 'en'];
    
    /**
     * Язык по умолчанию
     */
    protected $defaultLanguage = 'ru';
    
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Проверяем, если в URL есть параметр lang
        if ($request->has('lang')) {
            $requestedLang = $request->get('lang');
            
            // Проверяем, что такой язык поддерживается
            if (in_array($requestedLang, $this->availableLanguages)) {
                // Запоминаем выбранный язык в сессии
                Session::put('language', $requestedLang);
            }
        }
        
        // Используем язык из сессии или язык по умолчанию
        $language = Session::get('language', $this->defaultLanguage);
        
        // Устанавливаем язык приложения (для перевода через Laravel)
        App::setLocale($language);
        
        // Добавляем текущий язык в заголовки, чтобы фронтенд мог его получить
        $response = $next($request);
        
        if ($response instanceof \Illuminate\Http\Response) {
            $response->header('X-App-Locale', $language);
        }
        
        return $response;
    }
}
