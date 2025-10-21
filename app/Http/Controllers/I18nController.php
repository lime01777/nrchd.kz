<?php

namespace App\Http\Controllers;

use App\Services\Translator;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * API контроллер для работы с переводами
 */
class I18nController extends Controller
{
    protected Translator $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    /**
     * Получить словарь переводов для scope и локали
     * 
     * GET /api/i18n?scope=ui&locale=ru
     */
    public function getDictionary(Request $request): JsonResponse
    {
        $request->validate([
            'scope' => 'required|string|max:120',
            'locale' => 'nullable|string|in:ru,kk,en',
        ]);

        $scope = $request->input('scope');
        $locale = $request->input('locale', app()->getLocale());

        try {
            $dictionary = $this->translator->getDictionary($scope, $locale);

            return response()->json([
                'success' => true,
                'locale' => $locale,
                'scope' => $scope,
                'data' => $dictionary,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get translation dictionary', [
                'scope' => $scope,
                'locale' => $locale,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load translations',
            ], 500);
        }
    }

    /**
     * Массово обеспечить наличие переводов
     * 
     * POST /api/i18n/ensure
     * Body: { scope: 'ui', translations: { key1: 'text1', key2: 'text2' } }
     */
    public function ensureTranslations(Request $request): JsonResponse
    {
        $request->validate([
            'scope' => 'required|string|max:120',
            'translations' => 'required|array|min:1',
            'translations.*' => 'required|string',
        ]);

        $scope = $request->input('scope');
        $translations = $request->input('translations');
        $userId = auth()->id();

        try {
            $this->translator->bulkEnsure($scope, $translations, $userId);

            return response()->json([
                'success' => true,
                'message' => 'Translations queued successfully',
                'count' => count($translations),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to ensure translations', [
                'scope' => $scope,
                'count' => count($translations),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process translations',
            ], 500);
        }
    }

    /**
     * Установить локаль через POST
     * 
     * POST /api/locale
     * Body: { locale: 'ru' }
     */
    public function setLocale(Request $request): JsonResponse
    {
        $request->validate([
            'locale' => 'required|string|in:ru,kk,en',
        ]);

        $locale = $request->input('locale');
        
        // Сохраняем в сессии
        session(['locale' => $locale]);

        return response()->json([
            'success' => true,
            'locale' => $locale,
            'message' => 'Locale updated successfully',
        ]);
    }

    /**
     * Получить текущую локаль
     * 
     * GET /api/locale
     */
    public function getLocale(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'locale' => app()->getLocale(),
            'available' => config('i18n.locales', ['ru', 'kk', 'en']),
        ]);
    }

    /**
     * Получить статистику переводов
     * 
     * GET /api/i18n/stats
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = $this->translator->getStats();

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get translation stats', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load stats',
            ], 500);
        }
    }

    /**
     * Получить переводы для страницы
     * 
     * GET /api/page-translations
     */
    public function getPageTranslations(Request $request): JsonResponse
    {
        try {
            $locale = $request->input('locale', app()->getLocale());
            $scope = $request->input('scope', 'ui');
            
            $dictionary = $this->translator->getDictionary($scope, $locale);

            return response()->json([
                'success' => true,
                'locale' => $locale,
                'scope' => $scope,
                'data' => $dictionary,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get page translations', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to load page translations',
            ], 500);
        }
    }

    /**
     * Обновить переводы страницы
     * 
     * POST /api/page-translations
     */
    public function updatePageTranslations(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'translations' => 'required|array',
                'locale' => 'required|string|in:ru,kk,en',
                'scope' => 'required|string',
            ]);

            $translations = $request->input('translations');
            $locale = $request->input('locale');
            $scope = $request->input('scope');

            // TODO: Реализовать обновление переводов
            // Пока просто логируем полученные данные
            Log::info('Page translations update request', [
                'scope' => $scope,
                'locale' => $locale,
                'translations_count' => count($translations)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Translations updated successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update page translations', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update translations',
            ], 500);
        }
    }
}

