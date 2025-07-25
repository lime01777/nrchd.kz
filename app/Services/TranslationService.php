<?php

namespace App\Services;

use App\Models\Translation;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Stichoza\GoogleTranslate\GoogleTranslate;

class TranslationService
{
    /**
     * Get translations for a specific page or component
     *
     * @param string $group The group/page name
     * @param string $locale The locale code (ru, en, kk)
     * @return array The translations
     */
    public static function getForPage(string $group, string $locale = 'ru'): array
    {
        return Translation::getGroupTranslations($group, $locale);
    }

    /**
     * Get a specific translation by key
     *
     * @param string $key The translation key
     * @param string $group The group/page name
     * @param string $locale The locale code (ru, en, kk)
     * @return string|null The translation or null if not found
     */
    public static function get(string $key, string $group, string $locale = 'ru'): ?string
    {
        return Translation::getTranslation($key, $group, $locale);
    }

    /**
     * Translate and save a single key
     *
     * @param string $key The translation key
     * @param string $group The group/page name
     * @param string $ruText The Russian text (source language)
     * @return bool Success status
     */
    public static function translateAndSaveKey(string $key, string $group, string $ruText): bool
    {
        try {
            $translation = Translation::firstOrNew([
                'key' => $key,
                'group' => $group
            ]);

            $translation->ru = $ruText;
            
            // Translate to other languages if not already translated
            if (!$translation->en) {
                $translation->en = self::translateText($ruText, 'ru', 'en');
            }
            
            if (!$translation->kk) {
                $translation->kk = self::translateText($ruText, 'ru', 'kk');
            }
            
            $translation->save();
            
            // Clear cache for this translation
            Translation::clearCache($key, $group);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error translating key: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Translate all content for a page or component
     *
     * @param array $items Array of key => text pairs
     * @param string $group The group/page name
     * @return bool Success status
     */
    public static function translatePage(array $items, string $group): bool
    {
        try {
            foreach ($items as $key => $text) {
                self::translateAndSaveKey($key, $group, $text);
            }
            
            // Clear the entire group cache
            Translation::clearCache(null, $group);
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error translating page: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update a translation manually
     *
     * @param string $key The translation key
     * @param string $group The group/page name
     * @param array $translations Array of locale => text pairs
     * @return bool Success status
     */
    public static function updateTranslation(string $key, string $group, array $translations): bool
    {
        try {
            $translation = Translation::firstOrNew([
                'key' => $key,
                'group' => $group
            ]);
            
            foreach ($translations as $locale => $text) {
                if (in_array($locale, ['ru', 'en', 'kk'])) {
                    $translation->{$locale} = $text;
                }
            }
            
            $translation->save();
            
            // Clear cache for this translation in all locales
            foreach (['ru', 'en', 'kk'] as $locale) {
                Translation::clearCache($key, $group, $locale);
            }
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error updating translation: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Use Google Translate to translate text
     *
     * @param string $text The text to translate
     * @param string $from Source language
     * @param string $to Target language
     * @return string The translated text
     */
    public static function translateText(string $text, string $from = 'ru', string $to = 'en'): string
    {
        try {
            $tr = new GoogleTranslate();
            $tr->setSource($from);
            $tr->setTarget($to);
            
            return $tr->translate($text);
        } catch (\Exception $e) {
            Log::error('Google Translate error: ' . $e->getMessage());
            return $text; // Return original text on error
        }
    }
}
