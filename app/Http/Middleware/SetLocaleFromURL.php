<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleFromURL
{
    /**
     * List of supported locales
     *
     * @var array
     */
    protected $supportedLocales = ['ru', 'en', 'kz'];

    /**
     * Default locale
     *
     * @var string
     */
    protected $defaultLocale = 'kz';

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get locale from URL first segment
        $locale = $request->segment(1);

        // Check if it's a valid locale
        if (!in_array($locale, $this->supportedLocales)) {
            $locale = $this->defaultLocale;
            
            // If there's no locale in the URL, redirect to the default locale
            if ($request->path() !== '/') {
                return redirect($this->defaultLocale . '/' . $request->path());
            }
            
            return redirect($this->defaultLocale);
        }

        // Set the application locale
        App::setLocale($locale);
        
        // Store the current locale in the session
        session(['locale' => $locale]);
        
        return $next($request);
    }
}
