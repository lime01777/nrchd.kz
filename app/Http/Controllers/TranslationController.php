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
            'target' => 'required|string|min:2|max:5'
        ]);
        
        // For empty text, return original
        if (empty(trim($request->text))) {
            return response()->json([
                'success' => true, 
                'translation' => $request->text
            ]);
        }
        
        // Log the translation request for debugging
        Log::debug('Translation request', [
            'from' => $request->source,
            'to' => $request->target,
            'text' => substr($request->text, 0, 30) . (strlen($request->text) > 30 ? '...' : '')
        ]);

        try {
            // Get the Google Translate instance with API key already configured
            $translator = app('google-translate');
            
            // Handle language codes correctly
            $sourceCode = $request->source;
            $targetCode = $request->target;
            
            // Convert our lang codes to Google format if needed
            if ($sourceCode === 'kz') $sourceCode = 'kk'; // Kazakh language code in Google API is 'kk'
            if ($targetCode === 'kz') $targetCode = 'kk'; // Kazakh language code in Google API is 'kk'
            
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
            
            // Log successful translation
            Log::debug('Translation successful', [
                'original' => $request->text,
                'translated' => $translation
            ]);
            
            return response()->json([
                'success' => true,
                'translation' => $translation,
                'source' => $request->source,
                'target' => $request->target
            ]);
        } catch (Exception $e) {
            Log::error('Translation error: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'source' => $request->source,
                'target' => $request->target,
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
                'target' => $request->target
            ], 200); // Still return 200 to let the frontend handle it gracefully
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
                throw new \Exception('Google Translate service not available');
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
}
