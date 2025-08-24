<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use App\Models\StoredTranslation;
use App\Services\AutoTranslationService;
use Exception;

class TranslationAPIController extends Controller
{
    /**
     * Сервис автоматического перевода
     *
     * @var AutoTranslationService
     */
    protected $translationService;

    /**
     * Конструктор
     *
     * @param AutoTranslationService $translationService
     */
    public function __construct(AutoTranslationService $translationService)
    {
        $this->translationService = $translationService;
    }

    /**
     * Получить переводы для указанного языка
     *
     * @param Request $request
     * @param string $language
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTranslations(Request $request, $language)
    {
        try {
            // Проверяем, что язык поддерживается
            $supportedLanguages = ['kz', 'ru', 'en'];
            if (!in_array($language, $supportedLanguages)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unsupported language'
                ], 400);
            }

            // Загружаем переводы из языковых файлов
            $translations = $this->translationService->getLanguageFileTranslations($language);

            // Получаем дополнительные переводы из базы данных
            $dbTranslations = StoredTranslation::where('target_language', $language)
                ->get()
                ->pluck('translated_text', 'original_text')
                ->toArray();

            // Объединяем переводы
            $allTranslations = array_merge($translations, $dbTranslations);

            return response()->json([
                'success' => true,
                'language' => $language,
                'translations' => $allTranslations,
                'count' => count($allTranslations)
            ]);

        } catch (Exception $e) {
            Log::error('Error getting translations: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error loading translations'
            ], 500);
        }
    }

    /**
     * Перевести текст
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function translate(Request $request)
    {
        try {
            $request->validate([
                'text' => 'required|string',
                'target_language' => 'required|string|in:kz,ru,en',
                'source_language' => 'string|in:kz,ru,en'
            ]);

            $text = $request->text;
            $targetLanguage = $request->target_language;
            $sourceLanguage = $request->source_language ?? 'kz';

            // Если целевой язык совпадает с исходным, возвращаем исходный текст
            if ($targetLanguage === $sourceLanguage) {
                return response()->json([
                    'success' => true,
                    'translation' => $text,
                    'source' => $sourceLanguage,
                    'target' => $targetLanguage
                ]);
            }

            // Выполняем перевод
            $translation = $this->translationService->translateText($text, $targetLanguage, $sourceLanguage);

            return response()->json([
                'success' => true,
                'translation' => $translation,
                'source' => $sourceLanguage,
                'target' => $targetLanguage
            ]);

        } catch (Exception $e) {
            Log::error('Translation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Translation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Перевести несколько текстов одновременно
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function translateBatch(Request $request)
    {
        try {
            $request->validate([
                'texts' => 'required|array',
                'texts.*' => 'string',
                'target_language' => 'required|string|in:kz,ru,en',
                'source_language' => 'string|in:kz,ru,en'
            ]);

            $texts = $request->texts;
            $targetLanguage = $request->target_language;
            $sourceLanguage = $request->source_language ?? 'kz';

            $translations = [];
            $errors = [];

            foreach ($texts as $index => $text) {
                try {
                    if (empty($text)) {
                        $translations[$index] = '';
                        continue;
                    }

                    // Если целевой язык совпадает с исходным, возвращаем исходный текст
                    if ($targetLanguage === $sourceLanguage) {
                        $translations[$index] = $text;
                        continue;
                    }

                    // Выполняем перевод
                    $translation = $this->translationService->translateText($text, $targetLanguage, $sourceLanguage);
                    $translations[$index] = $translation;

                } catch (Exception $e) {
                    $errors[] = [
                        'index' => $index,
                        'text' => substr($text, 0, 30),
                        'error' => $e->getMessage()
                    ];
                    $translations[$index] = $text; // Возвращаем исходный текст при ошибке
                }
            }

            return response()->json([
                'success' => true,
                'translations' => $translations,
                'errors' => $errors,
                'source' => $sourceLanguage,
                'target' => $targetLanguage
            ]);

        } catch (Exception $e) {
            Log::error('Batch translation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Batch translation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Сохранить переводы
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveTranslations(Request $request)
    {
        try {
            $request->validate([
                'translations' => 'required|array',
                'target_language' => 'required|string|in:kz,ru,en',
                'source_language' => 'string|in:kz,ru,en'
            ]);

            $translations = $request->translations;
            $targetLanguage = $request->target_language;
            $sourceLanguage = $request->source_language ?? 'kz';

            $savedCount = 0;
            $errors = [];

            foreach ($translations as $originalText => $translatedText) {
                try {
                    if (empty($originalText) || empty($translatedText)) {
                        continue;
                    }

                    $this->translationService->storeTranslation(
                        $originalText,
                        $translatedText,
                        $sourceLanguage,
                        $targetLanguage
                    );

                    $savedCount++;

                } catch (Exception $e) {
                    $errors[] = [
                        'text' => substr($originalText, 0, 30),
                        'error' => $e->getMessage()
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'saved_count' => $savedCount,
                'errors' => $errors,
                'message' => "Saved $savedCount translations"
            ]);

        } catch (Exception $e) {
            Log::error('Error saving translations: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error saving translations'
            ], 500);
        }
    }

    /**
     * Установить язык
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setLanguage(Request $request)
    {
        try {
            $request->validate([
                'language' => 'required|string|in:kz,ru,en'
            ]);

            $language = $request->language;

            // Сохраняем язык в сессии
            Session::put('language', $language);
            
            // Устанавливаем язык приложения
            App::setLocale($language);

            // Устанавливаем куки для сохранения между сессиями
            $cookie = cookie('language', $language, 43200); // 30 дней

            Log::info('Language set via API', [
                'language' => $language,
                'user_ip' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'language' => $language,
                'message' => 'Language set successfully'
            ])->cookie($cookie);

        } catch (Exception $e) {
            Log::error('Error setting language: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error setting language'
            ], 500);
        }
    }

    /**
     * Получить текущий язык
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCurrentLanguage(Request $request)
    {
        try {
            $currentLanguage = App::getLocale();
            $sessionLanguage = Session::get('language');
            $cookieLanguage = $request->cookie('language');

            return response()->json([
                'success' => true,
                'current_language' => $currentLanguage,
                'session_language' => $sessionLanguage,
                'cookie_language' => $cookieLanguage,
                'browser_language' => $request->getPreferredLanguage(['kz', 'ru', 'en'])
            ]);

        } catch (Exception $e) {
            Log::error('Error getting current language: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error getting current language'
            ], 500);
        }
    }
}
