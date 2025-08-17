<?php

namespace App\Services;

use App\Models\Translation;
use App\Models\StoredTranslation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class DatabaseTranslationService
{
    /**
     * Получить перевод из базы данных
     *
     * @param string $text Оригинальный текст
     * @param string $targetLanguage Целевой язык
     * @param string $sourceLanguage Исходный язык (по умолчанию 'ru')
     * @return string|null
     */
    public static function getTranslation(string $text, string $targetLanguage, string $sourceLanguage = 'ru'): ?string
    {
        // Если целевой язык совпадает с исходным, возвращаем оригинальный текст
        if ($targetLanguage === $sourceLanguage) {
            return $text;
        }

        // Сначала ищем в кэше
        $cacheKey = "translation_{$sourceLanguage}_{$targetLanguage}_" . md5($text);
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            // Ищем в таблице translations
            $translation = Translation::where([
                'original_text' => $text,
                'source_language' => $sourceLanguage,
                'target_language' => $targetLanguage
            ])->first();

            if ($translation) {
                Cache::put($cacheKey, $translation->translated_text, 3600); // кэшируем на час
                return $translation->translated_text;
            }

            // Ищем в таблице stored_translations
            $storedTranslation = StoredTranslation::findTranslation($text, $targetLanguage);
            if ($storedTranslation) {
                Cache::put($cacheKey, $storedTranslation, 3600);
                return $storedTranslation;
            }

            // Если перевод не найден, возвращаем оригинальный текст
            return $text;

        } catch (\Exception $e) {
            Log::error('Error getting translation from database: ' . $e->getMessage());
            return $text;
        }
    }

    /**
     * Получить переводы для страницы
     *
     * @param string $pageUrl URL страницы
     * @param string $targetLanguage Целевой язык
     * @return array
     */
    public static function getPageTranslations(string $pageUrl, string $targetLanguage): array
    {
        $cacheKey = "page_translations_{$pageUrl}_{$targetLanguage}";
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $translations = StoredTranslation::where('page_url', $pageUrl)
                ->where('target_language', $targetLanguage)
                ->get()
                ->pluck('translated_text', 'original_text')
                ->toArray();

            Cache::put($cacheKey, $translations, 3600);
            return $translations;

        } catch (\Exception $e) {
            Log::error('Error getting page translations: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Сохранить перевод в базу данных
     *
     * @param string $originalText Оригинальный текст
     * @param string $translatedText Переведенный текст
     * @param string $targetLanguage Целевой язык
     * @param string $sourceLanguage Исходный язык
     * @param string|null $contentType Тип контента
     * @param int|null $contentId ID контента
     * @return bool
     */
    public static function saveTranslation(
        string $originalText,
        string $translatedText,
        string $targetLanguage,
        string $sourceLanguage = 'ru',
        ?string $contentType = null,
        ?int $contentId = null
    ): bool {
        try {
            // Сохраняем в таблицу translations
            Translation::updateOrCreate([
                'original_text' => $originalText,
                'source_language' => $sourceLanguage,
                'target_language' => $targetLanguage,
            ], [
                'translated_text' => $translatedText,
                'content_type' => $contentType,
                'content_id' => $contentId,
            ]);

            // Сохраняем в таблицу stored_translations
            $hash = StoredTranslation::generateHash($originalText, $targetLanguage);
            StoredTranslation::updateOrCreate([
                'hash' => $hash,
            ], [
                'original_text' => $originalText,
                'translated_text' => $translatedText,
                'target_language' => $targetLanguage,
            ]);

            // Очищаем кэш
            $cacheKey = "translation_{$sourceLanguage}_{$targetLanguage}_" . md5($originalText);
            Cache::forget($cacheKey);

            return true;

        } catch (\Exception $e) {
            Log::error('Error saving translation: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Получить все переводы для языка
     *
     * @param string $targetLanguage Целевой язык
     * @return array
     */
    public static function getAllTranslations(string $targetLanguage): array
    {
        $cacheKey = "all_translations_{$targetLanguage}";
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        try {
            $translations = Translation::where('target_language', $targetLanguage)
                ->pluck('translated_text', 'original_text')
                ->toArray();

            Cache::put($cacheKey, $translations, 3600);
            return $translations;

        } catch (\Exception $e) {
            Log::error('Error getting all translations: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Очистить кэш переводов
     *
     * @param string|null $targetLanguage Конкретный язык (если null, очищает все)
     * @return void
     */
    public static function clearCache(?string $targetLanguage = null): void
    {
        if ($targetLanguage) {
            Cache::forget("all_translations_{$targetLanguage}");
        } else {
            // Очищаем все кэши переводов
            Cache::flush();
        }
    }
}
