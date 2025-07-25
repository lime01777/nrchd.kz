<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class Translation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'ru',
        'kk',
        'en',
        'group',
    ];

    /**
     * Get a translation by key, group and locale
     *
     * @param string $key The translation key
     * @param string $group The group (usually page name)
     * @param string $locale The language code (ru, en, kk)
     * @return string|null The translated text or null if not found
     */
    public static function getTranslation(string $key, string $group, string $locale = 'ru')
    {
        $cacheKey = "translation:{$group}.{$key}.{$locale}";
        
        return Cache::remember($cacheKey, 3600, function () use ($key, $group, $locale) {
            try {
                $translation = self::where([
                    'key' => $key,
                    'group' => $group
                ])->first();
                
                return $translation ? $translation->{$locale} : null;
            } catch (\Exception $e) {
                Log::error('Error finding translation: ' . $e->getMessage());
                return null;
            }
        });
    }
    
    /**
     * Get all translations for a specific group and locale
     *
     * @param string $group The group (usually page name)
     * @param string $locale The language code (ru, en, kk)
     * @return array The translations as key-value pairs
     */
    public static function getGroupTranslations(string $group, string $locale = 'ru')
    {
        $cacheKey = "translations:{$group}.{$locale}";
        
        return Cache::remember($cacheKey, 3600, function () use ($group, $locale) {
            try {
                $translations = self::where('group', $group)->get();
                $result = [];
                
                foreach ($translations as $translation) {
                    $result[$translation->key] = $translation->{$locale};
                }
                
                return $result;
            } catch (\Exception $e) {
                Log::error('Error getting group translations: ' . $e->getMessage());
                return [];
            }
        });
    }
    
    /**
     * Clear the cache for a specific translation or group
     *
     * @param string|null $key The translation key
     * @param string|null $group The group (usually page name)
     * @param string|null $locale The language code (ru, en, kk)
     */
    public static function clearCache(?string $key = null, ?string $group = null, ?string $locale = null)
    {
        if ($key && $group && $locale) {
            Cache::forget("translation:{$group}.{$key}.{$locale}");
        } elseif ($group && $locale) {
            Cache::forget("translations:{$group}.{$locale}");
        } elseif ($group) {
            foreach (['ru', 'en', 'kk'] as $loc) {
                Cache::forget("translations:{$group}.{$loc}");
            }
        } else {
            // Clear all translation cache if no params provided
            $keys = Cache::get('translation_cache_keys', []);
            foreach ($keys as $cacheKey) {
                Cache::forget($cacheKey);
            }
            Cache::forget('translation_cache_keys');
        }
    }

    /**
     * Получить все переводы для конкретного контента
     *
     * @param string $contentType Тип контента
     * @param int $contentId ID контента
     * @return array Массив переводов
     */
    public static function getContentTranslations($contentType, $contentId)
    {
        $translations = self::where([
            'content_type' => $contentType,
            'content_id' => $contentId
        ])->get();

        $result = [];
        foreach ($translations as $translation) {
            if (!isset($result[$translation->original_text])) {
                $result[$translation->original_text] = [];
            }
            $result[$translation->original_text][$translation->target_language] = $translation->translated_text;
        }

        return $result;
    }
}
