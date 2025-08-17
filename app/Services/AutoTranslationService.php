<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Models\StoredTranslation;
use App\Models\Translation;
use Exception;

class AutoTranslationService
{
    /**
     * Основной язык сайта (казахский)
     */
    protected $defaultLanguage = 'kz';
    
    /**
     * Поддерживаемые языки
     */
    protected $supportedLanguages = ['kz', 'ru', 'en'];
    
    /**
     * Google Translate API ключ
     */
    protected $apiKey;
    
    public function __construct()
    {
        $this->apiKey = config('services.google.translate_api_key');
    }
    
    /**
     * Автоматически переводит текст на указанный язык
     *
     * @param string $text Текст для перевода
     * @param string $targetLanguage Целевой язык
     * @param string $sourceLanguage Исходный язык (по умолчанию казахский)
     * @return string
     */
    public function translateText($text, $targetLanguage, $sourceLanguage = 'kz')
    {
        // Если целевой язык совпадает с исходным, возвращаем исходный текст
        if ($targetLanguage === $sourceLanguage) {
            return $text;
        }
        
        // Проверяем, есть ли уже перевод в базе данных
        $existingTranslation = $this->getStoredTranslation($text, $sourceLanguage, $targetLanguage);
        if ($existingTranslation) {
            return $existingTranslation;
        }
        
        // Если нет API ключа, возвращаем исходный текст
        if (!$this->apiKey) {
            Log::warning('Google Translate API key not configured');
            return $text;
        }
        
        try {
            // Выполняем перевод через Google Translate API
            $translatedText = $this->translateWithGoogleAPI($text, $sourceLanguage, $targetLanguage);
            
            if (!empty($translatedText) && $translatedText !== $text) {
                // Сохраняем перевод в базу данных
                $this->storeTranslation($text, $translatedText, $sourceLanguage, $targetLanguage);
                return $translatedText;
            }
        } catch (Exception $e) {
            Log::error('Translation error: ' . $e->getMessage(), [
                'text' => substr($text, 0, 50),
                'source' => $sourceLanguage,
                'target' => $targetLanguage
            ]);
        }
        
        // В случае ошибки возвращаем исходный текст
        return $text;
    }
    
    /**
     * Переводит текст через Google Translate API
     *
     * @param string $text
     * @param string $sourceLanguage
     * @param string $targetLanguage
     * @return string
     */
    protected function translateWithGoogleAPI($text, $sourceLanguage, $targetLanguage)
    {
        // Преобразуем коды языков для Google API
        $sourceCode = $this->convertLanguageCodeForGoogle($sourceLanguage);
        $targetCode = $this->convertLanguageCodeForGoogle($targetLanguage);
        
        $url = 'https://translation.googleapis.com/language/translate/v2';
        $data = [
            'q' => $text,
            'source' => $sourceCode,
            'target' => $targetCode,
            'key' => $this->apiKey
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Google Translate API returned HTTP code: $httpCode");
        }
        
        $result = json_decode($response, true);
        
        if (isset($result['data']['translations'][0]['translatedText'])) {
            return $result['data']['translations'][0]['translatedText'];
        }
        
        throw new Exception('Invalid response from Google Translate API');
    }
    
    /**
     * Преобразует коды языков для Google API
     *
     * @param string $languageCode
     * @return string
     */
    protected function convertLanguageCodeForGoogle($languageCode)
    {
        $conversions = [
            'kz' => 'kk', // Казахский
            'ru' => 'ru', // Русский
            'en' => 'en'  // Английский
        ];
        
        return $conversions[$languageCode] ?? $languageCode;
    }
    
    /**
     * Сохраняет перевод в базу данных
     */
    public function storeTranslation($originalText, $translatedText, $sourceLanguage, $targetLanguage, $contentType = 'general', $contentId = null)
    {
        try {
            StoredTranslation::updateOrCreate(
                [
                    'original_text' => $originalText,
                    'target_language' => $targetLanguage,
                ],
                [
                    'translated_text' => $translatedText,
                    'hash' => StoredTranslation::generateHash($originalText, $targetLanguage),
                    'page_url' => request()->header('Referer') ?? null,
                    'is_verified' => false,
                ]
            );
            
            return true;
        } catch (Exception $e) {
            Log::error('Error storing translation: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Получает сохраненный перевод из базы данных
     * Сначала проверяет в таблице translations, затем в stored_translations
     */
    public function getStoredTranslation($originalText, $sourceLanguage, $targetLanguage)
    {
        // Сначала проверяем в таблице translations
        $translation = Translation::findTranslation($originalText, $sourceLanguage, $targetLanguage);
        if ($translation) {
            return $translation;
        }
        
        // Если не найден, проверяем в stored_translations
        return StoredTranslation::findTranslation($originalText, $targetLanguage);
    }
    
    /**
     * Генерирует переводы для массива ключей и значений
     */
    public function translateArray(array $data, $sourceLanguage = 'kz', $contentType = 'general', $contentId = null)
    {
        $results = [];
        
        foreach ($data as $key => $value) {
            if (is_string($value) && !empty(trim($value))) {
                $results[$key] = $this->translateText($value, $sourceLanguage);
            } else {
                $results[$key] = $value;
            }
        }
        
        return $results;
    }
    
    /**
     * Переводит все недостающие тексты на указанный язык
     *
     * @param string $targetLanguage
     * @param string $sourceLanguage
     * @return array
     */
    public function translateMissingTexts($targetLanguage, $sourceLanguage = 'kz')
    {
        $results = [
            'translated' => 0,
            'errors' => 0,
            'skipped' => 0
        ];
        
        // Получаем все казахские переводы из языковых файлов
        $kazakhTranslations = $this->getLanguageFileTranslations($sourceLanguage);
        
        foreach ($kazakhTranslations as $key => $kazakhText) {
            // Проверяем, есть ли уже перевод на целевой язык
            $existingTranslation = $this->getStoredTranslation($kazakhText, $sourceLanguage, $targetLanguage);
            
            if ($existingTranslation) {
                $results['skipped']++;
                continue;
            }
            
            try {
                $translatedText = $this->translateText($kazakhText, $targetLanguage, $sourceLanguage);
                
                if ($translatedText !== $kazakhText) {
                    $results['translated']++;
                    Log::info("Translated: $kazakhText -> $translatedText");
                } else {
                    $results['skipped']++;
                }
            } catch (Exception $e) {
                $results['errors']++;
                Log::error("Translation error for key '$key': " . $e->getMessage());
            }
        }
        
        return $results;
    }
    
    /**
     * Получает переводы из языковых файлов
     *
     * @param string $language
     * @return array
     */
    public function getLanguageFileTranslations($language)
    {
        $translations = [];
        
        $languagePath = resource_path("lang/$language");
        
        if (!is_dir($languagePath)) {
            return $translations;
        }
        
        $files = glob($languagePath . '/*.php');
        
        foreach ($files as $file) {
            $fileName = basename($file, '.php');
            $fileTranslations = include $file;
            
            if (is_array($fileTranslations)) {
                foreach ($fileTranslations as $key => $value) {
                    if (is_string($value)) {
                        $translations["$fileName.$key"] = $value;
                    }
                }
            }
        }
        
        return $translations;
    }
    
    /**
     * Синхронизирует переводы между языками
     *
     * @param string $fromLanguage
     * @param string $toLanguage
     * @return array
     */
    public function syncTranslations($fromLanguage, $toLanguage)
    {
        $results = [
            'synced' => 0,
            'errors' => 0,
            'skipped' => 0
        ];
        
        $fromTranslations = $this->getLanguageFileTranslations($fromLanguage);
        $toTranslations = $this->getLanguageFileTranslations($toLanguage);
        
        foreach ($fromTranslations as $key => $fromText) {
            // Если перевод уже существует в целевом языке, пропускаем
            if (isset($toTranslations[$key])) {
                $results['skipped']++;
                continue;
            }
            
            try {
                $translatedText = $this->translateText($fromText, $toLanguage, $fromLanguage);
                
                if ($translatedText !== $fromText) {
                    $this->storeTranslation($fromText, $translatedText, $fromLanguage, $toLanguage);
                    $results['synced']++;
                } else {
                    $results['skipped']++;
                }
            } catch (Exception $e) {
                $results['errors']++;
                Log::error("Sync error for key '$key': " . $e->getMessage());
            }
        }
        
        return $results;
    }

    /**
     * Переводит текст на все поддерживаемые языки и сохраняет в базу данных
     *
     * @param string $text Текст для перевода
     * @param string $sourceLanguage Исходный язык
     * @param string $contentType Тип контента
     * @param int|null $contentId ID контента
     * @return array Массив переводов для всех языков
     */
    public function translateAndStore($text, $sourceLanguage = 'kz', $contentType = 'general', $contentId = null)
    {
        $translations = [];
        
        // Добавляем исходный текст
        $translations[$sourceLanguage] = $text;
        
        // Переводим на все поддерживаемые языки
        foreach ($this->supportedLanguages as $targetLanguage) {
            if ($targetLanguage === $sourceLanguage) {
                continue; // Пропускаем исходный язык
            }
            
            try {
                // Переводим текст
                $translatedText = $this->translateText($text, $targetLanguage, $sourceLanguage);
                
                // Сохраняем перевод в базу данных с дополнительными параметрами
                $this->storeTranslationWithContent($text, $translatedText, $sourceLanguage, $targetLanguage, $contentType, $contentId);
                
                $translations[$targetLanguage] = $translatedText;
                
            } catch (Exception $e) {
                Log::error("Error translating to $targetLanguage: " . $e->getMessage());
                $translations[$targetLanguage] = $text; // Возвращаем исходный текст в случае ошибки
            }
        }
        
        return $translations;
    }
    
    /**
     * Сохраняет перевод в базу данных с информацией о контенте
     *
     * @param string $originalText
     * @param string $translatedText
     * @param string $sourceLanguage
     * @param string $targetLanguage
     * @param string $contentType
     * @param int|null $contentId
     * @return bool
     */
    protected function storeTranslationWithContent($originalText, $translatedText, $sourceLanguage, $targetLanguage, $contentType, $contentId)
    {
        try {
            // Используем модель Translation вместо StoredTranslation для совместимости с контроллером
            $translation = Translation::updateOrCreate(
                [
                    'original_text' => $originalText,
                    'source_language' => $sourceLanguage,
                    'target_language' => $targetLanguage,
                    'content_type' => $contentType,
                    'content_id' => $contentId,
                ],
                [
                    'translated_text' => $translatedText,
                ]
            );
            
            return true;
        } catch (Exception $e) {
            Log::error('Error storing translation with content: ' . $e->getMessage());
            return false;
        }
    }
}
