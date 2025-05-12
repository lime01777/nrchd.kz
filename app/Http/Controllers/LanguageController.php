<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\StoredTranslation;
use Exception;

class LanguageController extends Controller
{
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
        
        $storedTranslations = StoredTranslation::where('target_language', $targetLanguage)
            ->where('page_url', $pageUrl)
            ->get();
        
        // Если нет переводов для конкретной страницы, то попробуем найти общие переводы
        if ($storedTranslations->isEmpty()) {
            $storedTranslations = StoredTranslation::where('target_language', $targetLanguage)
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
