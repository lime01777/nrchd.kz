<?php

use App\Helpers\TranslationHelper;

if (!function_exists('t')) {
    /**
     * Get a translation for a key in a specific group
     *
     * @param string $key Translation key
     * @param string $group Translation group (usually page name)
     * @param array $replace Parameters to replace in the translation
     * @param string|null $locale Locale to get translation for (defaults to current locale)
     * @return string
     */
    function t($key, $group = 'common', $replace = [], $locale = null)
    {
        return TranslationHelper::trans($key, $group, $replace, $locale);
    }
}
