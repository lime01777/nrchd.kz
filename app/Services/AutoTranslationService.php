<?php

namespace App\Services;

use App\Models\Translation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AutoTranslationService
{
    protected $apiKey;
    protected $supportedLanguages = ['ru', 'en', 'kz'];
    protected $defaultLanguage = 'ru';

    public function __construct()
    {
        $this->apiKey = config('services.google_translate.api_key');
    }

    /**
     * Автоматически переводит текст на все поддерживаемые языки и сохраняет в базу данных
     *
     * @param string $text Текст для перевода
     * @param string $sourceLanguage Исходный язык текста
     * @param string $contentType Тип контента (например, 'news', 'page', 'title')
     * @param int|null $contentId ID связанного контента (для последующего поиска)
     * @return array Массив переводов ['en' => 'English text', 'kz' => 'Kazakh text', ...]
     */
    public function translateAndStore($text, $sourceLanguage = 'ru', $contentType = 'general', $contentId = null)
    {
        $translations = [];
        $sourceLang = strtolower($sourceLanguage);
        
        // Если текст пустой, возвращаем пустые переводы
        if (empty($text)) {
            foreach ($this->supportedLanguages as $lang) {
                if ($lang != $sourceLang) {
                    $translations[$lang] = '';
                } else {
                    $translations[$lang] = $text;
                }
            }
            return $translations;
        }

        // Добавляем исходный текст в результаты
        $translations[$sourceLang] = $text;
        
        try {
            foreach ($this->supportedLanguages as $targetLang) {
                // Пропускаем исходный язык
                if ($targetLang == $sourceLang) {
                    continue;
                }

                // Проверяем, есть ли уже перевод в базе
                $existingTranslation = Translation::where([
                    'original_text' => $text,
                    'source_language' => $sourceLang,
                    'target_language' => $targetLang
                ])->first();

                if ($existingTranslation) {
                    $translations[$targetLang] = $existingTranslation->translated_text;
                    continue;
                }

                // Если нет кэшированного перевода, переводим через API
                $translatedText = $this->translateText($text, $sourceLang, $targetLang);
                
                // Сохраняем перевод в базу
                $this->storeTranslation(
                    $text, 
                    $translatedText, 
                    $sourceLang, 
                    $targetLang, 
                    $contentType, 
                    $contentId
                );
                
                $translations[$targetLang] = $translatedText;
            }
        } catch (\Exception $e) {
            Log::error('AutoTranslationService error: ' . $e->getMessage());
            
            // В случае ошибки возвращаем хотя бы исходный текст для всех языков
            foreach ($this->supportedLanguages as $lang) {
                if (!isset($translations[$lang])) {
                    $translations[$lang] = $text;
                }
            }
        }

        return $translations;
    }

    /**
     * Переводит текст с помощью Google Translate API
     */
    protected function translateText($text, $sourceLang, $targetLang)
    {
        // Проверяем кэш перед обращением к API
        $cacheKey = 'translation_' . md5($text . $sourceLang . $targetLang);
        
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // Настраиваем параметры запроса к API Google Translate
        $response = Http::post('https://translation.googleapis.com/language/translate/v2', [
            'q' => $text,
            'source' => $sourceLang,
            'target' => $targetLang,
            'format' => 'text',
            'key' => $this->apiKey,
        ]);

        if ($response->successful() && isset($response['data']['translations'][0]['translatedText'])) {
            $translatedText = $response['data']['translations'][0]['translatedText'];
            
            // Кэшируем результат на 1 час
            Cache::put($cacheKey, $translatedText, 3600);
            
            return $translatedText;
        }

        // Если произошла ошибка, логируем ее
        $errorMessage = $response->json()['error']['message'] ?? 'Unknown error';
        Log::error("Google Translate API error: {$errorMessage}");
        
        // Возвращаем исходный текст в случае ошибки
        return $text;
    }

    /**
     * Сохраняет перевод в базу данных
     */
    public function storeTranslation($originalText, $translatedText, $sourceLanguage, $targetLanguage, $contentType = 'general', $contentId = null)
    {
        try {
            Translation::updateOrCreate(
                [
                    'original_text' => $originalText,
                    'source_language' => $sourceLanguage,
                    'target_language' => $targetLanguage,
                ],
                [
                    'translated_text' => $translatedText,
                    'content_type' => $contentType,
                    'content_id' => $contentId,
                    'updated_at' => now(),
                ]
            );
            
            return true;
        } catch (\Exception $e) {
            Log::error('Error storing translation: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Получает сохраненный перевод из базы данных
     */
    public function getStoredTranslation($originalText, $sourceLanguage, $targetLanguage)
    {
        $translation = Translation::where([
            'original_text' => $originalText,
            'source_language' => $sourceLanguage,
            'target_language' => $targetLanguage,
        ])->first();

        return $translation ? $translation->translated_text : null;
    }
    
    /**
     * Генерирует переводы для массива ключей и значений
     */
    public function translateArray(array $data, $sourceLanguage = 'ru', $contentType = 'general', $contentId = null)
    {
        $results = [];
        
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $translated = $this->translateAndStore($value, $sourceLanguage, $contentType, $contentId);
                $results[$key] = $translated;
            } elseif (is_array($value)) {
                $results[$key] = $this->translateArray($value, $sourceLanguage, $contentType, $contentId);
            } else {
                $results[$key] = $value;
            }
        }
        
        return $results;
    }
}
