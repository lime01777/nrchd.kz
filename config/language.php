<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Available Locales Configuration
    |--------------------------------------------------------------------------
    |
    | The list of available locales for the application.
    |
    */
    'locales' => [
        'ru' => [
            'name' => 'Русский',
            'native' => 'Русский',
            'flag' => '🇷🇺',
        ],
        'kz' => [
            'name' => 'Kazakh',
            'native' => 'Қазақша',
            'flag' => '🇰🇿',
        ],
        'en' => [
            'name' => 'English',
            'native' => 'English',
            'flag' => '🇬🇧',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    |
    | The default locale to use when no locale is specified.
    |
    */
    'default_locale' => 'kz',

    /*
    |--------------------------------------------------------------------------
    | Translation Settings
    |--------------------------------------------------------------------------
    |
    | Google Translate API отключен. Используется только база данных.
    |
    */
    'google_translate_api_key' => '', // Google Translate отключен

    /*
    |--------------------------------------------------------------------------
    | Cache Time
    |--------------------------------------------------------------------------
    |
    | The time in seconds for which translations should be cached.
    |
    */
    'cache_time' => 3600,

    /*
    |--------------------------------------------------------------------------
    | Auto-translate Missing Translations
    |--------------------------------------------------------------------------
    |
    | Whether missing translations should be automatically translated
    | at runtime if they don't exist in the database.
    |
    */
    'auto_translate_missing' => false,
];
