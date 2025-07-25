<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Шарим текущую локаль для доступа на клиентской стороне
        // Это позволит нашему хелперу routeWithLocale всегда иметь актуальный locale
        Inertia::share('locale', fn () => app()->getLocale());
    }
}
