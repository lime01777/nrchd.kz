<?php

namespace App\Http\Controllers;

use App\Services\DatabaseTranslationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DatabaseTranslationController extends Controller
{
    /**
     * Получить перевод
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getTranslation(Request $request): JsonResponse
    {
        $request->validate([
            'text' => 'required|string',
            'target_language' => 'required|string|in:ru,kz,en',
            'source_language' => 'string|in:ru,kz,en'
        ]);

        $text = $request->input('text');
        $targetLanguage = $request->input('target_language');
        $sourceLanguage = $request->input('source_language', 'ru');

        $translation = DatabaseTranslationService::getTranslation($text, $targetLanguage, $sourceLanguage);

        return response()->json([
            'success' => true,
            'translation' => $translation,
            'original' => $text,
            'target_language' => $targetLanguage,
            'source_language' => $sourceLanguage
        ]);
    }

    /**
     * Получить переводы для страницы
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getPageTranslations(Request $request): JsonResponse
    {
        $request->validate([
            'page_url' => 'required|string',
            'target_language' => 'required|string|in:ru,kz,en'
        ]);

        $pageUrl = $request->input('page_url');
        $targetLanguage = $request->input('target_language');

        $translations = DatabaseTranslationService::getPageTranslations($pageUrl, $targetLanguage);

        return response()->json([
            'success' => true,
            'translations' => $translations,
            'page_url' => $pageUrl,
            'target_language' => $targetLanguage
        ]);
    }

    /**
     * Сохранить перевод
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function saveTranslation(Request $request): JsonResponse
    {
        $request->validate([
            'original_text' => 'required|string',
            'translated_text' => 'required|string',
            'target_language' => 'required|string|in:ru,kz,en',
            'source_language' => 'string|in:ru,kz,en',
            'content_type' => 'string|nullable',
            'content_id' => 'integer|nullable'
        ]);

        $originalText = $request->input('original_text');
        $translatedText = $request->input('translated_text');
        $targetLanguage = $request->input('target_language');
        $sourceLanguage = $request->input('source_language', 'ru');
        $contentType = $request->input('content_type');
        $contentId = $request->input('content_id');

        $success = DatabaseTranslationService::saveTranslation(
            $originalText,
            $translatedText,
            $targetLanguage,
            $sourceLanguage,
            $contentType,
            $contentId
        );

        if ($success) {
            return response()->json([
                'success' => true,
                'message' => 'Translation saved successfully'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save translation'
            ], 500);
        }
    }

    /**
     * Получить все переводы для языка
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllTranslations(Request $request): JsonResponse
    {
        $request->validate([
            'target_language' => 'required|string|in:ru,kz,en'
        ]);

        $targetLanguage = $request->input('target_language');
        $translations = DatabaseTranslationService::getAllTranslations($targetLanguage);

        return response()->json([
            'success' => true,
            'translations' => $translations,
            'target_language' => $targetLanguage,
            'count' => count($translations)
        ]);
    }

    /**
     * Очистить кэш переводов
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function clearCache(Request $request): JsonResponse
    {
        $targetLanguage = $request->input('target_language');

        DatabaseTranslationService::clearCache($targetLanguage);

        return response()->json([
            'success' => true,
            'message' => 'Cache cleared successfully'
        ]);
    }

    /**
     * Массовое сохранение переводов
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function bulkSave(Request $request): JsonResponse
    {
        $request->validate([
            'translations' => 'required|array',
            'translations.*.original_text' => 'required|string',
            'translations.*.translated_text' => 'required|string',
            'translations.*.target_language' => 'required|string|in:ru,kz,en',
            'translations.*.source_language' => 'string|in:ru,kz,en'
        ]);

        $translations = $request->input('translations');
        $saved = 0;
        $failed = 0;

        foreach ($translations as $translation) {
            $success = DatabaseTranslationService::saveTranslation(
                $translation['original_text'],
                $translation['translated_text'],
                $translation['target_language'],
                $translation['source_language'] ?? 'ru',
                $translation['content_type'] ?? null,
                $translation['content_id'] ?? null
            );

            if ($success) {
                $saved++;
            } else {
                $failed++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Saved: {$saved}, Failed: {$failed}",
            'saved' => $saved,
            'failed' => $failed
        ]);
    }
}
