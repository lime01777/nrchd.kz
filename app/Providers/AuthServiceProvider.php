<?php

namespace App\Providers;

use App\Models\News;
use App\Policies\NewsPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Сопоставляем модели и политики доступа.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        News::class => NewsPolicy::class,
    ];

    /**
     * Регистрируем политики. Здесь же можно подключать кастомные Gate при необходимости.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
