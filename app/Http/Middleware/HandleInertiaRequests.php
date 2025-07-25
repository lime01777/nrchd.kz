<?php

namespace App\Http\Middleware;

use App\Services\TranslationService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get the current route name to determine the page/group for translations
        $routeName = $request->route() ? $request->route()->getName() : 'common';
        $group = str_replace('.', '_', $routeName) ?: 'common';
        
        // Get current locale from app
        $locale = app()->getLocale();
        
        // Get translations for this page/group
        $translations = TranslationService::getForPage($group, $locale);
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // Add locale and translations data for frontend
            'locale' => $locale,
            'locales' => config('language.supported_locales'),
            'translations' => $translations,
        ];
    }
}
