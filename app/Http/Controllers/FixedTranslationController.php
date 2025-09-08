<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\StoredTranslation;
use Exception;
use Illuminate\Support\Facades\DB;

class FixedTranslationController extends Controller
{
    /**
     * Get translation from database (without Google Translate)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function translate(Request $request)
    {
        // Оборачиваем все в try-catch на уровне всего метода для защиты от белого экрана
        try {
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
            
            $targetLang = $request->target;

            // Проверяем существующий перевод в БД с защитой от ошибок
            try {
                $existingTranslation = StoredTranslation::findTranslation($request->text, $targetLang);
                
                if ($existingTranslation) {
                    // Translation exists in our database
                    Log::debug('Using translation from database', [
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
            } catch (Exception $dbException) {
                // Если произошла ошибка при доступе к БД, логируем и продолжаем работу
                Log::error('Error accessing database for translation: ' . $dbException->getMessage());
            }
            
            // Log the translation request for debugging
            Log::debug('No translation found in database, returning original', [
                'from' => $request->source,
                'to' => $targetLang,
                'text' => substr($request->text, 0, 30) . (strlen($request->text) > 30 ? '...' : '')
            ]);

            // If no translation found, return original text
            return response()->json([
                'success' => true,
                'translation' => $request->text, // Return original text
                'source' => $request->source,
                'target' => $targetLang,
                'cached' => false
            ]);
        
        // Глобальный catch для защиты от белого экрана при любых непредвиденных ошибках
        } catch (Exception $globalError) {
            Log::critical('Unexpected translation error: ' . $globalError->getMessage(), [
                'exception' => $globalError->getMessage(),
                'trace' => $globalError->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Unexpected error',
                'message' => 'An unexpected error occurred',
                'translation' => $request->text ?? '',
                'source' => $request->source ?? 'unknown',
                'target' => $request->target ?? 'unknown'
            ], 200);
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
     * Test the translation API (database only, no Google Translate)
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
        
        // Log the test request
        Log::info('Translation API test request (database only)', [
            'from' => $request->source,
            'to' => $request->target,
            'text' => $request->text
        ]);
        
        try {
            // Check if translation exists in database
            $existingTranslation = StoredTranslation::findTranslation($request->text, $request->target);
            
            if ($existingTranslation) {
                return response()->json([
                    'success' => true,
                    'message' => 'Translation found in database',
                    'translation' => $existingTranslation,
                    'original' => $request->text,
                    'source' => $request->source,
                    'target' => $request->target,
                    'cached' => true
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'message' => 'No translation found in database, returning original',
                    'translation' => $request->text,
                    'original' => $request->text,
                    'source' => $request->source,
                    'target' => $request->target,
                    'cached' => false
                ]);
            }
            
        } catch (Exception $e) {
            Log::error('Test translation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Translation API test failed',
                'message' => $e->getMessage()
            ]);
        }
    }
}
