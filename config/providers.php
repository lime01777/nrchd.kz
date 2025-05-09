<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Application Service Providers
    |--------------------------------------------------------------------------
    |
    | Service providers listed here will be automatically loaded on application
    | bootstrap. Add your custom service providers to this array.
    |
    */
    'providers' => [
        // Other Service Providers...
        Barryvdh\TranslationManager\ManagerServiceProvider::class,
        App\Providers\GoogleTranslateServiceProvider::class,
    ],
];
