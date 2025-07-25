<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stichoza\GoogleTranslate\GoogleTranslate;
use App\Models\StoredTranslation;
use Exception;

class TranslationAPIController extends Controller
{
    /**
     * Переводит текст на указанный язык
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function translate(Request $request)
    {
        // Валидация запроса
        $request->validate([
            'text' => 'required|string',
            'source_lang' => 'required|string|min:2|max:5',
            'target_lang' => 'required|string|min:2|max:5'
        ]);
        
        // Для пустого текста возвращаем оригинал
        if (empty(trim($request->text))) {
            return response()->json([
                'success' => true, 
                'translation' => $request->text
            ]);
        }
        
        // Проверяем, есть ли уже сохраненный перевод
        $targetLang = $request->target_lang;
        
        // Конвертируем код языка для Google API, если нужно
        $googleLangCode = ($targetLang === 'kz') ? 'kk' : $targetLang;

        // Проверяем существующий перевод в БД
        try {
            $existingTranslation = StoredTranslation::where('original_text', $request->text)
                ->where('target_language', $targetLang)
                ->first();
                
            if ($existingTranslation) {
                return response()->json([
                    'success' => true,
                    'translation' => $existingTranslation->translated_text,
                    'source' => $request->source_lang,
                    'target' => $targetLang,
                    'cached' => true
                ]);
            }
        } catch (Exception $e) {
            Log::error('Error checking cached translation: ' . $e->getMessage());
            // Продолжаем выполнение и попробуем получить новый перевод
        }
        
        // Логируем запрос перевода
        Log::debug('Translation API request', [
            'from' => $request->source_lang,
            'to' => $targetLang,
            'text' => mb_substr($request->text, 0, 30) . (mb_strlen($request->text) > 30 ? '...' : '')
        ]);

        try {
            // Получаем экземпляр Google Translate API
            // Инициализируем переводчик
            $translator = new GoogleTranslate();
            
            // Проверяем, есть ли специальный метод для установки ключа
            $apiKey = env('GOOGLE_TRANSLATE_API_KEY');
            if ($apiKey && method_exists($translator, 'setApiKey')) {
                $translator->setApiKey($apiKey);
            }
            
            // Устанавливаем исходный и целевой языки
            $sourceCode = ($request->source_lang === 'kz') ? 'kk' : $request->source_lang;
            $translator->setSource($sourceCode);
            $translator->setTarget($googleLangCode);
            
            // Выполняем перевод
            $translation = $translator->translate($request->text);
            
            // Если перевод пустой, возвращаем оригинал
            if (empty($translation)) {
                Log::warning('Empty translation result, using original text');
                $translation = $request->text;
            }
            
            // Сохраняем перевод в БД
            if (!empty($translation) && $translation !== $request->text) {
                try {
                    StoredTranslation::create([
                        'original_text' => $request->text,
                        'translated_text' => $translation,
                        'target_language' => $targetLang,
                        'hash' => md5($request->text . $targetLang),
                        'page_url' => $request->header('Referer') ?? null,
                    ]);
                    
                    Log::debug('Translation cached in database', [
                        'text' => mb_substr($request->text, 0, 30) . (mb_strlen($request->text) > 30 ? '...' : ''),
                        'target' => $targetLang
                    ]);
                } catch (Exception $e) {
                    Log::error('Error caching translation: ' . $e->getMessage());
                    // Продолжаем с ответом, даже если кэширование не удалось
                }
            }
            
            // Возвращаем результат перевода
            return response()->json([
                'success' => true,
                'translation' => $translation,
                'source' => $request->source_lang,
                'target' => $targetLang,
                'cached' => false
            ]);
        } catch (Exception $e) {
            Log::error('Translation API error: ' . $e->getMessage(), [
                'exception' => $e->getMessage(),
                'source' => $request->source_lang,
                'target' => $targetLang,
                'text_sample' => mb_substr($request->text, 0, 30) . (mb_strlen($request->text) > 30 ? '...' : '')
            ]);
            
            // Возвращаем оригинальный текст в случае ошибки
            return response()->json([
                'success' => false,
                'error' => 'Translation failed',
                'message' => $e->getMessage(),
                'translation' => $request->text, // Возвращаем оригинал при ошибке
                'source' => $request->source_lang,
                'target' => $targetLang
            ], 200); // Возвращаем 200, чтобы фронтенд мог обработать ошибку
        }
    }
    
    /**
     * Обновляет языковую настройку в сессии
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setLanguage(Request $request)
    {
        $request->validate([
            'language' => 'required|string|in:ru,en,kz'
        ]);
        
        $language = $request->language;
        
        // Сохраняем язык в сессии
        session(['language' => $language]);
        
        // Устанавливаем локаль приложения
        app()->setLocale($language);
        
        return response()->json([
            'success' => true,
            'language' => $language,
            'message' => 'Language set successfully'
        ]);
    }
    
    /**
     * Получает все доступные переводы для указанного языка
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTranslations(Request $request)
    {
        $request->validate([
            'language' => 'required|string|in:ru,en,kz'
        ]);
        
        $language = $request->language;
        
        // Получаем все переводы для указанного языка
        $translations = StoredTranslation::where('target_language', $language)
            ->select('original_text', 'translated_text')
            ->orderBy('id', 'desc')
            ->limit(1000) // Ограничиваем количество возвращаемых переводов
            ->get();
            
        // Преобразуем результат в удобный формат для фронтенда
        $result = [];
        foreach ($translations as $translation) {
            $result[$translation->original_text] = $translation->translated_text;
        }
        
        return response()->json([
            'success' => true,
            'language' => $language,
            'translations' => $result,
            'count' => count($result)
        ]);
    }
}
