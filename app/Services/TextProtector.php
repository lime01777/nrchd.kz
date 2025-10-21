<?php

namespace App\Services;

use App\Models\GlossaryTerm;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Сервис для защиты имен собственных и терминов от перевода
 * 
 * Перед переводом заменяет защищенные термины на плейсхолдеры,
 * после перевода восстанавливает оригиналы
 */
class TextProtector
{
    protected array $protectedTerms = [];
    protected array $placeholderMap = [];
    protected int $placeholderCounter = 0;

    /**
     * Защитить текст перед переводом
     * 
     * @param string $text Исходный текст
     * @param string $locale Язык текста
     * @return array [$protectedText, $map] где $map - карта для восстановления
     */
    public function protect(string $text, string $locale = 'ru'): array
    {
        $this->placeholderMap = [];
        $this->placeholderCounter = 0;

        // Загружаем активные термины из БД или кеша
        $terms = $this->getActiveTerms($locale);
        
        $protectedText = $text;

        // Защищаем каждый термин
        foreach ($terms as $term) {
            $pattern = $this->buildPattern($term->term, $term->case_sensitive);
            $placeholder = $this->generatePlaceholder();
            
            // Заменяем все вхождения термина на плейсхолдер
            $protectedText = preg_replace(
                $pattern,
                $placeholder,
                $protectedText,
                -1,
                $count
            );
            
            if ($count > 0) {
                $this->placeholderMap[$placeholder] = $term->term;
            }
        }

        // Защищаем email-адреса
        $protectedText = $this->protectEmails($protectedText);
        
        // Защищаем телефоны
        $protectedText = $this->protectPhones($protectedText);
        
        // Защищаем даты
        $protectedText = $this->protectDates($protectedText);
        
        // Защищаем числа с единицами измерения
        $protectedText = $this->protectMeasurements($protectedText);

        return [$protectedText, $this->placeholderMap];
    }

    /**
     * Восстановить защищенные термины после перевода
     * 
     * @param string $translatedText Переведенный текст с плейсхолдерами
     * @param array $map Карта плейсхолдеров
     * @return string Текст с восстановленными терминами
     */
    public function restore(string $translatedText, array $map): string
    {
        return strtr($translatedText, $map);
    }

    /**
     * Получить активные термины глоссария для языка
     */
    protected function getActiveTerms(string $locale): array
    {
        $cacheKey = "glossary_terms:{$locale}";
        
        return Cache::remember($cacheKey, 3600, function () use ($locale) {
            return GlossaryTerm::where('locale', $locale)
                ->where('active', true)
                ->orderBy('term', 'desc') // Длинные термины первыми
                ->get()
                ->toArray();
        });
    }

    /**
     * Построить regex паттерн для поиска термина
     */
    protected function buildPattern(string $term, bool $caseSensitive): string
    {
        $escaped = preg_quote($term, '/');
        $flags = $caseSensitive ? 'u' : 'ui';
        
        // Используем word boundaries для точного совпадения
        return '/\b' . $escaped . '\b/' . $flags;
    }

    /**
     * Генерировать уникальный плейсхолдер
     */
    protected function generatePlaceholder(): string
    {
        return '__TERM_' . $this->placeholderCounter++ . '__';
    }

    /**
     * Защитить email-адреса
     */
    protected function protectEmails(string $text): string
    {
        return preg_replace_callback(
            '/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/',
            function ($matches) {
                $placeholder = $this->generatePlaceholder();
                $this->placeholderMap[$placeholder] = $matches[0];
                return $placeholder;
            },
            $text
        );
    }

    /**
     * Защитить телефонные номера
     */
    protected function protectPhones(string $text): string
    {
        // Паттерн для телефонов: +7, 8, с разделителями
        return preg_replace_callback(
            '/(?:\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/',
            function ($matches) {
                $placeholder = $this->generatePlaceholder();
                $this->placeholderMap[$placeholder] = $matches[0];
                return $placeholder;
            },
            $text
        );
    }

    /**
     * Защитить даты
     */
    protected function protectDates(string $text): string
    {
        // Паттерн для дат: DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD
        $patterns = [
            '/\b\d{2}[.\/]\d{2}[.\/]\d{4}\b/',
            '/\b\d{4}-\d{2}-\d{2}\b/',
            '/\b\d{2}[.\/]\d{2}[.\/]\d{2}\b/',
        ];

        foreach ($patterns as $pattern) {
            $text = preg_replace_callback(
                $pattern,
                function ($matches) {
                    $placeholder = $this->generatePlaceholder();
                    $this->placeholderMap[$placeholder] = $matches[0];
                    return $placeholder;
                },
                $text
            );
        }

        return $text;
    }

    /**
     * Защитить числа с единицами измерения
     */
    protected function protectMeasurements(string $text): string
    {
        // Паттерн для чисел с единицами: 100 кг, 50 мл, 25%, $100
        return preg_replace_callback(
            '/\b\d+(?:[.,]\d+)?\s*(?:кг|г|мг|л|мл|м|см|мм|км|%|\$|€|₽|₸)\b/',
            function ($matches) {
                $placeholder = $this->generatePlaceholder();
                $this->placeholderMap[$placeholder] = $matches[0];
                return $placeholder;
            },
            $text
        );
    }

    /**
     * Очистить кеш терминов
     */
    public static function clearCache(): void
    {
        Cache::forget('glossary_terms:ru');
        Cache::forget('glossary_terms:kk');
        Cache::forget('glossary_terms:en');
    }

    /**
     * Массово защитить и восстановить текст (удобный метод)
     * 
     * @param string $text Исходный текст
     * @param string $locale Язык текста
     * @param callable $translator Функция перевода: function(string $protectedText): string
     * @return string Переведенный текст с восстановленными терминами
     */
    public function protectAndTranslate(string $text, string $locale, callable $translator): string
    {
        [$protectedText, $map] = $this->protect($text, $locale);
        $translatedText = $translator($protectedText);
        return $this->restore($translatedText, $map);
    }
}

