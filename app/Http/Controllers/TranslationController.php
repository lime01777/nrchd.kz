<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Log;
use Exception;

class TranslationController extends Controller
{
    /**
     * Translate text using Google Translate API
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function translate(Request $request)
    {
        // Validate with more flexible language codes (some can be 2-5 chars)
        $request->validate([
            'text' => 'required|string',
            'source' => 'required|string|min:2|max:5',
            'target' => 'required|string|min:2|max:5',
            'cache' => 'boolean'
        ]);
        
        // For empty text, return original
        if (empty(trim($request->text))) {
            return response()->json([
                'success' => true, 
                'translation' => $request->text
            ]);
        }
        
        // Всегда кешировать переводы, независимо от запроса
        $shouldCache = true;
        
        // First check if we already have this translation stored
        $targetLang = $request->target;
        if ($targetLang === 'kz') {
            // We use 'kz' in our system, but Google API uses 'kk'
            $googleLangCode = 'kk';
        } else {
            $googleLangCode = $targetLang;
        }

        // Check for existing translation in the database
        $existingTranslation = \App\Models\StoredTranslation::findTranslation($request->text, $targetLang);
        
        if ($existingTranslation) {
            // Translation already exists in our database
            Log::debug('Using cached translation from database', [
                'text' => substr($request->text, 0, 30) . (strlen($request->text) > 30 ? '...' : ''),
                'target' => $targetLang
            ]);
            
            return response()->json([
                'success' => true,
                'translation' => $existingTranslation,
                'source' => $request->source,
                'target' => $targetLang,
                'cached' => true
            ]);
        }
        
        // Если запрошен перевод на английский или казахский, но у нас нет кеша - сохраним для обоих языков
        if (in_array($targetLang, ['en', 'kz']) && empty($existingTranslation)) {
            // Запланируем фоновый перевод и сохранение для всех языков
            try {
                $this->cacheTranslationsForAllLanguages($request->text, $request->source);
            } catch (Exception $e) {
                Log::error('Error scheduling translations for all languages: ' . $e->getMessage());
                // Продолжаем выполнение основного запроса, даже если фоновая работа не удалась
            }
        }
        
        // Log the translation request for debugging
        Log::debug('Translation request', [
            'from' => $request->source,
            'to' => $targetLang,
            'text' => substr($request->text, 0, 30) . (strlen($request->text) > 30 ? '...' : '')
        ]);

        try {
            // Get the Google Translate instance with API key already configured
            $translator = app('google-translate');
            
            // Handle language codes correctly
            $sourceCode = $request->source;
            $targetCode = $googleLangCode;
            
            // Convert our lang codes to Google format if needed
            if ($sourceCode === 'kz') $sourceCode = 'kk'; // Kazakh language code in Google API is 'kk'
            
            // Log the actual codes being used
            Log::debug('Using language codes', ['source' => $sourceCode, 'target' => $targetCode]);
            
            // Set source and target languages
            $translator->setSource($sourceCode);
            $translator->setTarget($targetCode);
            
            // Try to translate the text
            $translation = $translator->translate($request->text);
            
            // If no exception but empty translation, use original text
            if (empty($translation)) {
                Log::warning('Empty translation result, using original text');
                $translation = $request->text;
            }
            
            // Store the translation if caching is requested
            if ($shouldCache && !empty($translation) && $translation !== $request->text) {
                try {
                    $hash = \App\Models\StoredTranslation::generateHash($request->text, $targetLang);
                    
                    \App\Models\StoredTranslation::create([
                        'original_text' => $request->text,
                        'translated_text' => $translation,
                        'target_language' => $targetLang,
                        'hash' => $hash,
                        'page_url' => $request->header('Referer') ?? null,
                    ]);
                    
                    Log::debug('Translation cached in database', [
                        'text' => substr($request->text, 0, 30) . (strlen($request->text) > 30 ? '...' : ''),
                        'target' => $targetLang
                    ]);
                } catch (Exception $e) {
                    Log::error('Error caching translation: ' . $e->getMessage());
                    // Continue with the response, even if caching failed
                }
            }
            
            // Log successful translation
            Log::debug('Translation successful', [
                'original' => $request->text,
                'translated' => $translation
            ]);
            
            return response()->json([
                'success' => true,
                'translation' => $translation,
                'source' => $request->source,
                'target' => $targetLang,
                'cached' => false
            ]);
        } catch (Exception $e) {
            Log::error('Translation error: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'source' => $request->source,
                'target' => $targetLang,
                'text_sample' => substr($request->text, 0, 30) . (strlen($request->text) > 30 ? '...' : ''),
                'api_key_present' => !empty(env('GOOGLE_TRANSLATE_API_KEY'))
            ]);
            
            // Return original text on error to avoid breaking the UI
            return response()->json([
                'success' => false,
                'error' => 'Translation failed',
                'message' => $e->getMessage(),
                'translation' => $request->text, // Return original text on error
                'source' => $request->source,
                'target' => $targetLang
            ], 200); // Still return 200 to let the frontend handle it gracefully
        }
    }
    
    /**
     * Save a collection of translations to the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveTranslations(Request $request)
    {
        // Validate the request
        $request->validate([
            'translations' => 'required|array',
            'target_language' => 'required|string|min:2|max:5',
            'page_url' => 'nullable|string|max:255'
        ]);
        
        $translations = $request->translations;
        $targetLanguage = $request->target_language;
        $pageUrl = $request->page_url;
        
        $savedCount = 0;
        $errors = [];
        
        // Loop through all translations and save them
        foreach ($translations as $originalText => $translatedText) {
            try {
                // Skip empty or very short translations
                if (empty($originalText) || strlen($originalText) < 3 || empty($translatedText)) {
                    continue;
                }
                
                // Generate hash for faster lookups
                $hash = \App\Models\StoredTranslation::generateHash($originalText, $targetLanguage);
                
                // Check if this translation already exists
                $existing = \App\Models\StoredTranslation::where('hash', $hash)
                    ->where('target_language', $targetLanguage)
                    ->first();
                
                if ($existing) {
                    // Update existing translation if different
                    if ($existing->translated_text !== $translatedText) {
                        $existing->translated_text = $translatedText;
                        $existing->page_url = $pageUrl ?? $existing->page_url;
                        $existing->save();
                        $savedCount++;
                    }
                } else {
                    // Create new translation
                    \App\Models\StoredTranslation::create([
                        'original_text' => $originalText,
                        'translated_text' => $translatedText,
                        'target_language' => $targetLanguage,
                        'hash' => $hash,
                        'page_url' => $pageUrl,
                    ]);
                    $savedCount++;
                }
            } catch (Exception $e) {
                $errors[] = [
                    'text' => substr($originalText, 0, 30),
                    'error' => $e->getMessage()
                ];
                Log::error('Error saving translation: ' . $e->getMessage(), [
                    'original_text' => substr($originalText, 0, 30) . '...',
                    'target_language' => $targetLanguage
                ]);
            }
        }
        
        // Log the results
        Log::info('Translations batch saved', [
            'saved_count' => $savedCount,
            'error_count' => count($errors),
            'target_language' => $targetLanguage
        ]);
        
        return response()->json([
            'success' => true,
            'saved_count' => $savedCount,
            'errors' => $errors
        ]);
    }
    
    /**
     * Перевести и сохранить текст на все поддерживаемые языки
     *
     * @param string $text Текст для перевода
     * @param string $sourceLanguage Исходный язык текста
     * @return void
     */
    private function cacheTranslationsForAllLanguages($text, $sourceLanguage)
    {
        if (empty(trim($text)) || strlen(trim($text)) < 3) {
            return; // Не переводим пустые или очень короткие тексты
        }
        
        // Поддерживаемые языки (кроме русского, который является основным)
        $targetLanguages = ['en', 'kz'];
        
        // Переводим текст на каждый язык и сохраняем в базу
        foreach ($targetLanguages as $targetLang) {
            // Проверяем, если уже есть перевод в базе
            $existingTranslation = \App\Models\StoredTranslation::findTranslation($text, $targetLang);
            if ($existingTranslation) {
                // Перевод уже существует, пропускаем
                continue;
            }
            
            try {
                // Получаем объект Google Translate
                $translator = app('google-translate');
                
                // Преобразование кодов языков для Google API
                $sourceCode = $sourceLanguage === 'kz' ? 'kk' : $sourceLanguage;
                $targetCode = $targetLang === 'kz' ? 'kk' : $targetLang;
                
                // Устанавливаем языки источника и назначения
                $translator->setSource($sourceCode);
                $translator->setTarget($targetCode);
                
                // Переводим текст
                $translatedText = $translator->translate($text);
                
                if (!empty($translatedText)) {
                    // Сохраняем перевод в базе данных
                    $hash = \App\Models\StoredTranslation::generateHash($text, $targetLang);
                    
                    \App\Models\StoredTranslation::create([
                        'original_text' => $text,
                        'translated_text' => $translatedText,
                        'target_language' => $targetLang,
                        'hash' => $hash,
                        'page_url' => request()->header('Referer') ?? null,
                    ]);
                    
                    Log::info("Cached translation for language: {$targetLang}", [
                        'original' => substr($text, 0, 30) . (strlen($text) > 30 ? '...' : ''),
                        'translated' => substr($translatedText, 0, 30) . (strlen($translatedText) > 30 ? '...' : ''),
                    ]);
                }
            } catch (Exception $e) {
                Log::error("Error translating to {$targetLang}: " . $e->getMessage(), [
                    'text' => substr($text, 0, 30) . (strlen($text) > 30 ? '...' : ''),
                    'source' => $sourceLanguage,
                ]);
            }
        }
    }
    
    /**
     * Test the translation API to see if it's working
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function testTranslation(Request $request)
    {
        // Validate the request
        $request->validate([
            'text' => 'required|string',
            'source' => 'required|string|min:2|max:5',
            'target' => 'required|string|min:2|max:5'
        ]);
        
        // Получаем API ключ напрямую, чтобы проверить его наличие
        $apiKey = env('GOOGLE_TRANSLATE_API_KEY');
        
        // Log the test request with masked API key
        Log::info('Translation API test request', [
            'from' => $request->source,
            'to' => $request->target,
            'text' => $request->text,
            'api_key_present' => !empty($apiKey),
            'api_key_preview' => $apiKey ? substr($apiKey, 0, 3) . '...' . substr($apiKey, -3) : 'none'
        ]);
        
        try {
            // Try to get the translator service
            $translator = app('google-translate');
            
            if (!$translator) {
                throw new Exception('Google Translate service not available');
            }
            
            // Convert language codes if needed (Google uses 'kk' for Kazakh)
            $sourceCode = $request->source === 'kz' ? 'kk' : $request->source;
            $targetCode = $request->target === 'kz' ? 'kk' : $request->target;
            
            // Устанавливаем языки для перевода
            $translator->setSource($sourceCode);
            $translator->setTarget($targetCode);
            
            // Используем переданный текст или тестовую фразу
            $originalText = $request->text ?: 'Привет, это тестовый перевод';
            $translation = $translator->translate($originalText);
            
            // Логируем результат
            Log::info('Test translation successful', [
                'original' => $originalText,
                'translated' => $translation
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Translation API is working correctly',
                'translation' => $translation,
                'original' => $originalText,
                'api_key_set' => !empty($apiKey),
                'api_key_preview' => $apiKey ? substr($apiKey, 0, 3) . '...' . substr($apiKey, -3) : 'none',
                'source' => $sourceCode,
                'target' => $targetCode
            ]);
            
        } catch (Exception $e) {
            Log::error('Test translation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Translation API test failed',
                'message' => $e->getMessage(),
                'api_key_set' => !empty($apiKey),
                'api_key_preview' => $apiKey ? substr($apiKey, 0, 3) . '...' . substr($apiKey, -3) : 'none',
                'php_version' => PHP_VERSION
            ]);
        }
    }
    
    /**
     * Установить язык в сессии
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setLanguage(Request $request)
    {
        // Валидация запроса
        $request->validate([
            'language' => 'required|string|min:2|max:5',
        ]);
        
        $language = $request->language;
        
        // Проверить, что язык поддерживается
        $availableLanguages = ['ru', 'kz', 'en'];
        if (!in_array($language, $availableLanguages)) {
            return response()->json([
                'success' => false,
                'message' => 'Unsupported language'
            ], 400);
        }
        
        // Сохранить язык в сессии
        session(['language' => $language]);
        
        // Также установить куки для сохранения между сессиями
        $cookie = cookie('language', $language, 43200); // 30 дней
        
        // Логируем установку языка
        Log::info('Language set', [
            'language' => $language,
            'user_ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);
        
        return response()->json([
            'success' => true,
            'language' => $language
        ])->cookie($cookie);
    }
    
    /**
     * Получить переводы для конкретной страницы
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPageTranslations(Request $request)
    {
        // Валидация запроса
        $request->validate([
            'page_url' => 'required|string',
            'target_language' => 'required|string|min:2|max:5',
        ]);
        
        $pageUrl = $request->page_url;
        $targetLanguage = $request->target_language;
        
        // Получить переводы из базы данных для этой страницы и языка
        $translations = [];
        
        $storedTranslations = \App\Models\StoredTranslation::where('target_language', $targetLanguage)
            ->where('page_url', $pageUrl)
            ->get();
        
        // Если нет переводов для конкретной страницы, то попробуем найти общие переводы
        if ($storedTranslations->isEmpty()) {
            $storedTranslations = \App\Models\StoredTranslation::where('target_language', $targetLanguage)
                ->get();
        }
        
        // Собрать переводы в ассоциативный массив
        foreach ($storedTranslations as $translation) {
            $translations[$translation->original_text] = $translation->translated_text;
        }
        
        // Логируем запрос переводов
        Log::info('Page translations requested', [
            'page_url' => $pageUrl,
            'target_language' => $targetLanguage,
            'translations_count' => count($translations)
        ]);
        
        return response()->json([
            'success' => true,
            'translations' => $translations,
            'target_language' => $targetLanguage,
            'page_url' => $pageUrl
        ]);
    }
}