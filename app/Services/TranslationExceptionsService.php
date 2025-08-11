<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class TranslationExceptionsService
{
    /**
     * Кэш для исключений переводов
     */
    private static $cacheKey = 'translation_exceptions';
    private static $cacheDuration = 3600; // 1 час

    /**
     * Получить все исключения переводов
     *
     * @return array
     */
    public static function getExceptions(): array
    {
        return Cache::remember(self::$cacheKey, self::$cacheDuration, function () {
            return [
                // Имена собственные и специальные термины
                'names' => [
                    'ru' => [
                        'Салидат Каирбековой' => [
                            'kz' => 'Салидат Каирбекова',
                            'en' => 'Salidat Kairbekova'
                        ],
                        'Каирбекова' => [
                            'kz' => 'Каирбекова',
                            'en' => 'Kairbekova'
                        ],
                        'Салидат' => [
                            'kz' => 'Салидат',
                            'en' => 'Salidat'
                        ],
                        'Национальный центр экспертизы лекарственных средств' => [
                            'kz' => 'Дәрілік заттарды сараптау ұлттық орталығы',
                            'en' => 'National Center for Expertise of Medicines'
                        ],
                        'НЦЭЛС' => [
                            'kz' => 'ДСҰО',
                            'en' => 'NCEM'
                        ],
                        'Казахстан' => [
                            'kz' => 'Қазақстан',
                            'en' => 'Kazakhstan'
                        ],
                        'Астана' => [
                            'kz' => 'Астана',
                            'en' => 'Astana'
                        ],
                        'Алматы' => [
                            'kz' => 'Алматы',
                            'en' => 'Almaty'
                        ]
                    ]
                ],
                
                // Аббревиатуры и сокращения
                'abbreviations' => [
                    'ru' => [
                        'МЗ РК' => [
                            'kz' => 'РК ДСМ',
                            'en' => 'MOH RK'
                        ],
                        'ВОЗ' => [
                            'kz' => 'ДСҰ',
                            'en' => 'WHO'
                        ],
                        'ЕАЭС' => [
                            'kz' => 'ЕАО',
                            'en' => 'EAEU'
                        ],
                        'СНГ' => [
                            'kz' => 'ТМД',
                            'en' => 'CIS'
                        ]
                    ]
                ],
                
                // Технические термины
                'technical' => [
                    'ru' => [
                        'лекарственное средство' => [
                            'kz' => 'дәрілік зат',
                            'en' => 'medicinal product'
                        ],
                        'медицинское изделие' => [
                            'kz' => 'медициналық өнім',
                            'en' => 'medical device'
                        ],
                        'регистрационное удостоверение' => [
                            'kz' => 'тіркеу куәлігі',
                            'en' => 'registration certificate'
                        ],
                        'фармацевтическая экспертиза' => [
                            'kz' => 'фармацевтикалық сараптама',
                            'en' => 'pharmaceutical expertise'
                        ]
                    ]
                ],
                
                // Названия организаций
                'organizations' => [
                    'ru' => [
                        'Министерство здравоохранения Республики Казахстан' => [
                            'kz' => 'Қазақстан Республикасы Денсаулық сақтау министрлігі',
                            'en' => 'Ministry of Healthcare of the Republic of Kazakhstan'
                        ],
                        'Комитет медицинской и фармацевтической экспертизы' => [
                            'kz' => 'Медициналық және фармацевтикалық сараптама комитеті',
                            'en' => 'Committee for Medical and Pharmaceutical Expertise'
                        ]
                    ]
                ]
            ];
        });
    }

    /**
     * Проверить, есть ли исключение для данного текста
     *
     * @param string $text Оригинальный текст
     * @param string $targetLanguage Целевой язык
     * @return string|null Переведенный текст или null если исключения нет
     */
    public static function checkException(string $text, string $targetLanguage): ?string
    {
        $exceptions = self::getExceptions();
        
        // Проверяем точное совпадение
        foreach ($exceptions as $category) {
            if (isset($category['ru'][$text][$targetLanguage])) {
                return $category['ru'][$text][$targetLanguage];
            }
        }
        
        // Проверяем частичное совпадение (для случаев, когда текст содержит исключение)
        foreach ($exceptions as $category) {
            foreach ($category['ru'] as $original => $translations) {
                if (strpos($text, $original) !== false && isset($translations[$targetLanguage])) {
                    return str_replace($original, $translations[$targetLanguage], $text);
                }
            }
        }
        
        return null;
    }

    /**
     * Добавить новое исключение
     *
     * @param string $originalText Оригинальный текст
     * @param array $translations Переводы для разных языков
     * @param string $category Категория исключения
     * @return bool
     */
    public static function addException(string $originalText, array $translations, string $category = 'names'): bool
    {
        try {
            $exceptions = self::getExceptions();
            
            if (!isset($exceptions[$category]['ru'])) {
                $exceptions[$category]['ru'] = [];
            }
            
            $exceptions[$category]['ru'][$originalText] = $translations;
            
            // Сохраняем в кэш
            Cache::put(self::$cacheKey, $exceptions, self::$cacheDuration);
            
            return true;
        } catch (\Exception $e) {
            \Log::error('Ошибка добавления исключения перевода: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Удалить исключение
     *
     * @param string $originalText Оригинальный текст
     * @param string $category Категория исключения
     * @return bool
     */
    public static function removeException(string $originalText, string $category = 'names'): bool
    {
        try {
            $exceptions = self::getExceptions();
            
            if (isset($exceptions[$category]['ru'][$originalText])) {
                unset($exceptions[$category]['ru'][$originalText]);
                
                // Сохраняем в кэш
                Cache::put(self::$cacheKey, $exceptions, self::$cacheDuration);
                
                return true;
            }
            
            return false;
        } catch (\Exception $e) {
            \Log::error('Ошибка удаления исключения перевода: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Получить все исключения для конкретного языка
     *
     * @param string $targetLanguage Целевой язык
     * @return array
     */
    public static function getExceptionsForLanguage(string $targetLanguage): array
    {
        $exceptions = self::getExceptions();
        $result = [];
        
        foreach ($exceptions as $category => $categoryData) {
            if (isset($categoryData['ru'])) {
                foreach ($categoryData['ru'] as $original => $translations) {
                    if (isset($translations[$targetLanguage])) {
                        $result[] = [
                            'original' => $original,
                            'translated' => $translations[$targetLanguage],
                            'category' => $category
                        ];
                    }
                }
            }
        }
        
        return $result;
    }

    /**
     * Очистить кэш исключений
     *
     * @return bool
     */
    public static function clearCache(): bool
    {
        try {
            Cache::forget(self::$cacheKey);
            return true;
        } catch (\Exception $e) {
            \Log::error('Ошибка очистки кэша исключений: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Проверить, содержит ли текст исключения
     *
     * @param string $text Текст для проверки
     * @return array Массив найденных исключений
     */
    public static function findExceptionsInText(string $text): array
    {
        $exceptions = self::getExceptions();
        $found = [];
        
        foreach ($exceptions as $category => $categoryData) {
            if (isset($categoryData['ru'])) {
                foreach ($categoryData['ru'] as $original => $translations) {
                    if (strpos($text, $original) !== false) {
                        $found[] = [
                            'original' => $original,
                            'translations' => $translations,
                            'category' => $category
                        ];
                    }
                }
            }
        }
        
        return $found;
    }
}
