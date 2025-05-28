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
     * Получить переводы для страницы и опционально сохранить все переводы на странице
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPageTranslations(Request $request)
    {
        $request->validate([
            'page_url' => 'required|string',
            'language' => 'required|string|min:2|max:5',
            'save_all' => 'nullable|boolean',
            'translations' => 'nullable|array'
        ]);
        
        $language = $request->language;
        $pageUrl = $request->page_url;
        $saveAll = $request->input('save_all', false);
        $providedTranslations = $request->input('translations', []);
        
        // Если переданы переводы или флаг сохранения всех переводов, сохраняем их
        $savedCount = 0;
        $errors = 0;
        
        if ($saveAll && !empty($providedTranslations)) {
            // Сохраняем все переданные переводы
            foreach ($providedTranslations as $original => $translated) {
                // Пропускаем пустые или идентичные переводы
                if (empty($original) || empty($translated) || $original === $translated) {
                    continue;
                }
                
                try {
                    // Ограничиваем длину текста для БД
                    $maxLength = 60000; // Максимальная длина текста для БД
                    if (mb_strlen($original) > $maxLength || mb_strlen($translated) > $maxLength) {
                        $original = mb_substr($original, 0, $maxLength);
                        $translated = mb_substr($translated, 0, $maxLength);
                        Log::warning('Text too long for translation, truncating', [
                            'original_length' => mb_strlen($original),
                            'translated_length' => mb_strlen($translated),
                            'max_length' => $maxLength
                        ]);
                    }
                    
                    $hash = StoredTranslation::generateHash($original, $language);
                    
                    // Сначала проверяем, есть ли уже этот перевод
                    $existing = StoredTranslation::where('hash', $hash)
                        ->where('target_language', $language)
                        ->first();
                    
                    if ($existing) {
                        // Обновляем URL страницы, если необходимо
                        if (empty($existing->page_url) || $existing->page_url !== $pageUrl) {
                            $existing->page_url = $pageUrl;
                            $existing->save();
                            $savedCount++;
                        }
                    } else {
                        // Создаем новый перевод
                        StoredTranslation::create([
                            'original_text' => $original,
                            'translated_text' => $translated,
                            'target_language' => $language,
                            'hash' => $hash,
                            'page_url' => $pageUrl,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]);
                        $savedCount++;
                    }
                } catch (Exception $e) {
                    Log::error('Error saving translation', [
                        'error' => $e->getMessage(),
                        'original_length' => mb_strlen($original ?? ''),
                        'translated_length' => mb_strlen($translated ?? ''),
                        'page_url' => $pageUrl
                    ]);
                    $errors++;
                }
            }
            
            Log::info('Translation save results', [
                'saved_count' => $savedCount,
                'errors' => $errors,
                'page_url' => $pageUrl,
                'language' => $language
            ]);
        }
        
        // Получаем переводы для этой страницы из БД
        $translations = StoredTranslation::where('target_language', $language)
            ->where(function($query) use ($pageUrl) {
                $query->where('page_url', 'LIKE', '%' . $pageUrl . '%')
                      ->orWhereNull('page_url');
            })
            ->get()
            ->pluck('translated_text', 'original_text')
            ->toArray();
        
        // Логируем запрос переводов
        Log::info('Page translations requested', [
            'page_url' => $pageUrl,
            'target_language' => $language,
            'translations_count' => count($translations)
        ]);
        
        return response()->json([
            'success' => true,
            'translations' => $translations,
            'target_language' => $language,
            'page_url' => $pageUrl,
            'saved_count' => $savedCount
        ]);
    }
}
