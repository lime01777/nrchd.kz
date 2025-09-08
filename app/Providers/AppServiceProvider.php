<?php

namespace App\Providers;

use App\Services\Translation\DeepLClient;
use App\Services\Translation\TranslationService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(DeepLClient::class, function ($app) {
            $cfg = $app['config']->get('services.deepl');
            return new DeepLClient($cfg['key'] ?? '', $cfg['base'] ?? 'https://api-free.deepl.com');
        });
        
        $this->app->singleton(TranslationService::class, function ($app) {
            return new TranslationService($app->make(DeepLClient::class), config('app.locale','kk'));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
