<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider;
use App\Models\News;
use App\Policies\NewsPolicy;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Регистрируем провайдер переводов
        $this->app->singleton(\App\Contracts\TranslateProvider::class, function ($app) {
            $provider = config('i18n.provider', 'null');
            
            return match($provider) {
                'google' => new \App\Services\Providers\GoogleTranslateProvider(
                    config('i18n.google.api_key')
                ),
                default => new \App\Services\Providers\NullTranslateProvider(),
            };
        });

        // Регистрируем TextProtector
        $this->app->singleton(\App\Services\TextProtector::class, function ($app) {
            return new \App\Services\TextProtector();
        });

        // Регистрируем основной сервис Translator
        $this->app->singleton(\App\Services\Translator::class, function ($app) {
            return new \App\Services\Translator(
                $app->make(\App\Contracts\TranslateProvider::class),
                $app->make(\App\Services\TextProtector::class),
                config('i18n.cache_ttl', 86400),
                config('i18n.default_locale', 'ru'),
                config('i18n.locales', ['ru', 'kk', 'en'])
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Регистрируем политики
        Gate::policy(News::class, NewsPolicy::class);
    }
}
