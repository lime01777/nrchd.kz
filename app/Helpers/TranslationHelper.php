<?php

namespace App\Helpers;

use App\Models\Translation;
use Illuminate\Support\Facades\Log;

class TranslationHelper
{
    /**
     * Get a translation for a key in a specific group
     *
     * @param string $key Translation key
     * @param string $group Translation group (usually page name)
     * @param array $replace Parameters to replace in the translation
     * @param string|null $locale Locale to get translation for (defaults to current locale)
     * @return string
     */
    public static function trans($key, $group = 'common', $replace = [], $locale = null)
    {
        $locale = $locale ?: app()->getLocale();
        
        // Get the translation from the database
        $translation = Translation::getTranslation($key, $group, $locale);
        
        // If no translation found, return the key
        if (!$translation) {
            // Log missing translation for later addition
            Log::info("Missing translation: {$group}.{$key} for locale {$locale}");
            
            // If we're looking for a non-default locale, try getting the default one
            if ($locale !== config('language.default_locale')) {
                $translation = Translation::getTranslation($key, $group, config('language.default_locale'));
                if ($translation) {
                    return static::processReplacements($translation, $replace);
                }
            }
            
            return $key;
        }
        
        return static::processReplacements($translation, $replace);
    }
    
    /**
     * Process replacements in a translation string
     *
     * @param string $text Translation text
     * @param array $replace Parameters to replace
     * @return string
     */
    protected static function processReplacements($text, array $replace)
    {
        if (empty($replace)) {
            return $text;
        }
        
        return preg_replace_callback('/\:(\w+)/', function ($matches) use ($replace) {
            return $replace[$matches[1]] ?? $matches[0];
        }, $text);
    }
}
