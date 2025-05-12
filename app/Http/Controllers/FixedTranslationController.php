<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Log;
use App\Models\StoredTranslation;
use Exception;

class FixedTranslationController extends Controller
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
        
        // Check if we should cache this translation
        $shouldCache = $request->has('cache') ? $request->boolean('cache') : false;
        
        // First check if we already have this translation stored
        $targetLang = $request->target;
        if ($targetLang === 'kz') {
            // We use 'kz' in our system, but Google API uses 'kk'
            $googleLangCode = 'kk';
        } else {
            $googleLangCode = $targetLang;
        }

        // Check for existing translation in the database
        $existingTranslation = StoredTranslation::findTranslation($request->text, $targetLang);
        
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
                    $hash = StoredTranslation::generateHash($request->text, $targetLang);
                    
                    StoredTranslation::create([
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
                $hash = StoredTranslation::generateHash($originalText, $targetLanguage);
                
                // Check if this translation already exists
                $existing = StoredTranslation::where('hash', $hash)
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
                    StoredTranslation::create([
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
                'translated' => $translation,
                'target' => $request->target
            ]);
            
            return response()->json([
                'success' => true,
                'original' => $originalText,
                'translation' => $translation,
                'api_key_present' => !empty($apiKey),
                'source' => $request->source,
                'target' => $request->target
            ]);
        } catch (Exception $e) {
            Log::error('Test translation error: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'source' => $request->source,
                'target' => $request->target,
                'api_key_present' => !empty($apiKey)
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Translation test failed',
                'message' => $e->getMessage(),
                'api_key_present' => !empty($apiKey),
                'source' => $request->source,
                'target' => $request->target
            ]);
        }
    }
}
