<?php

namespace App\Services;

use App\Models\StoredTranslation;
use App\Services\TranslationExceptionsService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Exception;

class TranslationService
{
    protected static $supportedLanguages = ['ru', 'en', 'kz'];
    protected static $sourceLanguage = 'kz';

    /**
     * Быстрый перевод текста с использованием БД кэша
     *
     * @param string $text Текст для перевода
     * @param string $targetLanguage Целевой язык
     * @param string $pageUrl URL страницы для контекста
     * @return string Переведенный текст
     */
    public static function translate(string $text, string $targetLanguage, string $pageUrl = null): string
    {
        // Если целевой язык русский или текст пустой, возвращаем как есть
        if ($targetLanguage === self::$sourceLanguage || empty(trim($text))) {
            return $text;
        }

        // Проверяем поддерживается ли язык
        if (!in_array($targetLanguage, self::$supportedLanguages)) {
            Log::warning("Неподдерживаемый язык: $targetLanguage");
            return $text;
        }

        // Проверяем исключения переводов
        $exceptionTranslation = TranslationExceptionsService::checkException($text, $targetLanguage);
        if ($exceptionTranslation !== null) {
            // Сохраняем исключение в БД для кэширования
            self::saveTranslation($text, $exceptionTranslation, $targetLanguage, $pageUrl);
            return $exceptionTranslation;
        }

        // Сначала проверяем БД
        $cachedTranslation = StoredTranslation::findTranslation($text, $targetLanguage);
        if ($cachedTranslation) {
            return $cachedTranslation;
        }

        // Если нет в БД, делаем новый перевод
        try {
            $translator = new GoogleTranslate();
            $googleLangCode = $targetLanguage === 'kz' ? 'kk' : $targetLanguage;
            
            $translatedText = $translator->setSource(self::$sourceLanguage)
                                        ->setTarget($googleLangCode)
                                        ->translate($text);

            // Сохраняем в БД
            self::saveTranslation($text, $translatedText, $targetLanguage, $pageUrl);

            return $translatedText;
        } catch (Exception $e) {
            Log::error('Ошибка Google Translate: ' . $e->getMessage(), [
                'text' => $text,
                'target_language' => $targetLanguage
            ]);
            return $text;
        }
    }

    /**
     * Сохранить перевод в БД
     *
     * @param string $originalText Оригинальный текст
     * @param string $translatedText Переведенный текст
     * @param string $targetLanguage Целевой язык
     * @param string|null $pageUrl URL страницы
     * @return bool Успех операции
     */
    public static function saveTranslation(
        string $originalText, 
        string $translatedText, 
        string $targetLanguage, 
        string $pageUrl = null
    ): bool {
        try {
            $hash = StoredTranslation::generateHash($originalText, $targetLanguage);
            
            StoredTranslation::updateOrCreate(
                [
                    'hash' => $hash,
                    'target_language' => $targetLanguage
                ],
                [
                    'original_text' => $originalText,
                    'translated_text' => $translatedText,
                    'page_url' => $pageUrl,
                    'is_verified' => false
                ]
            );

            return true;
        } catch (Exception $e) {
            Log::error('Ошибка сохранения перевода: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Получить все переводы для конкретной страницы
     *
     * @param string $pageUrl URL страницы
     * @param string $targetLanguage Целевой язык
     * @return array Массив переводов
     */
    public static function getPageTranslations(string $pageUrl, string $targetLanguage): array
    {
        return StoredTranslation::where('page_url', $pageUrl)
                                ->where('target_language', $targetLanguage)
                                ->pluck('translated_text', 'original_text')
                                ->toArray();
    }

    /**
     * Массовый перевод текстов
     *
     * @param array $texts Массив текстов для перевода
     * @param string $targetLanguage Целевой язык
     * @param string|null $pageUrl URL страницы
     * @return array Массив переводов [original => translated]
     */
    public static function translateBatch(array $texts, string $targetLanguage, string $pageUrl = null): array
    {
        $translations = [];
        $textsToTranslate = [];

        // Сначала проверяем что есть в БД
        foreach ($texts as $text) {
            $cached = StoredTranslation::findTranslation($text, $targetLanguage);
            if ($cached) {
                $translations[$text] = $cached;
            } else {
                $textsToTranslate[] = $text;
            }
        }

        // Переводим оставшиеся тексты
        foreach ($textsToTranslate as $text) {
            $translated = self::translate($text, $targetLanguage, $pageUrl);
            $translations[$text] = $translated;
        }

        return $translations;
    }

    /**
     * Получить статистику переводов
     *
     * @return array Статистика по языкам
     */
    public static function getTranslationStats(): array
    {
        $stats = [];
        foreach (self::$supportedLanguages as $language) {
            if ($language === self::$sourceLanguage) continue;
            
            $stats[$language] = [
                'total' => StoredTranslation::where('target_language', $language)->count(),
                'verified' => StoredTranslation::where('target_language', $language)
                                             ->where('is_verified', true)
                                             ->count()
            ];
        }
        return $stats;
    }

    /**
     * Сканировать контент сайта и найти новые тексты для перевода
     *
     * @param string $targetLanguage Целевой язык
     * @return array Массив новых текстов
     */
    public static function scanForNewContent(string $targetLanguage): array
    {
        // Здесь будет логика сканирования контента
        // Пока возвращаем пустой массив, реализуем позже
        return [];
    }

    /**
     * Проверить является ли текст переведенным
     *
     * @param string $text Текст для проверки
     * @param string $targetLanguage Целевой язык
     * @return bool
     */
    public static function hasTranslation(string $text, string $targetLanguage): bool
    {
        return StoredTranslation::findTranslation($text, $targetLanguage) !== null;
    }

    /**
     * Получить переводы для конкретной страницы
     * Этот метод используется в маршрутах для передачи переводов в React компоненты
     *
     * @param string $pageName Название страницы
     * @param string $locale Локаль
     * @return array Массив переводов
     */
    public static function getForPage(string $pageName, string $locale): array
    {
        // Всегда возвращаем переводы, независимо от исходного языка
        // Это нужно для React компонентов, которые должны получать переводы

        // Загружаем переводы из файлов Laravel
        $translations = [];
        
        try {
            // Загружаем общие переводы
            $commonTranslations = trans('common', [], $locale);
            if (is_array($commonTranslations)) {
                $translations = array_merge($translations, $commonTranslations);
            }

            // Загружаем переводы для конкретной страницы, если они есть
            $pageTranslations = trans($pageName, [], $locale);
            if (is_array($pageTranslations)) {
                $translations = array_merge($translations, $pageTranslations);
            }

            // Загружаем сообщения
            $messagesTranslations = trans('messages', [], $locale);
            if (is_array($messagesTranslations)) {
                $translations = array_merge($translations, $messagesTranslations);
            }

            // Загружаем локализацию
            $localizationTranslations = trans('localization', [], $locale);
            if (is_array($localizationTranslations)) {
                $translations = array_merge($translations, $localizationTranslations);
            }
            
            // Загружаем переводы из базы данных
            $dbTranslations = \App\Services\DatabaseTranslationService::getAllTranslations($locale);
            if (is_array($dbTranslations)) {
                $translations = array_merge($translations, $dbTranslations);
            }

        } catch (\Exception $e) {
            Log::error('Error loading translations for page: ' . $e->getMessage(), [
                'page' => $pageName,
                'locale' => $locale
            ]);
        }

        return $translations;
    }
}
