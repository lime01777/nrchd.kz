<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Translation;
use App\Services\Translator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

/**
 * Контроллер для управления переводами в админ-панели
 */
class TranslationManagementController extends Controller
{
    protected Translator $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    /**
     * Показать список переводов
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $scope = $request->input('scope');
        $perPage = $request->input('per_page', 20);

        $query = Translation::query();

        if ($scope) {
            $query->where('scope', $scope);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                  ->orWhere('ru', 'like', "%{$search}%")
                  ->orWhere('kk', 'like', "%{$search}%")
                  ->orWhere('en', 'like', "%{$search}%");
            });
        }

        $translations = $query->with('updatedBy')
            ->orderBy('scope')
            ->orderBy('key')
            ->paginate($perPage)
            ->withQueryString();

        // Получаем все уникальные scope
        $scopes = Translation::select('scope')
            ->distinct()
            ->orderBy('scope')
            ->pluck('scope');

        // Статистика
        $stats = $this->translator->getStats();

        // Последние переводы по языкам
        $recentTranslations = [
            'en' => Translation::where('en', '!=', '')
                ->whereNotNull('en')
                ->orderBy('updated_at', 'desc')
                ->limit(10)
                ->get(),
            'kk' => Translation::where('kk', '!=', '')
                ->whereNotNull('kk')
                ->orderBy('updated_at', 'desc')
                ->limit(10)
                ->get(),
        ];

        // Поддерживаемые языки
        $languages = ['ru', 'kk', 'en'];

        return Inertia::render('Admin/Translations/Index', [
            'translations' => $translations,
            'scopes' => $scopes,
            'filters' => [
                'search' => $search,
                'scope' => $scope,
            ],
            'stats' => $stats,
            'recentTranslations' => $recentTranslations,
            'languages' => $languages,
        ]);
    }

    /**
     * Показать форму редактирования перевода
     */
    public function edit(Translation $translation): Response
    {
        return Inertia::render('Admin/Translations/Edit', [
            'translation' => $translation,
        ]);
    }

    /**
     * Обновить перевод
     */
    public function update(Request $request, Translation $translation): JsonResponse
    {
        $validated = $request->validate([
            'ru' => 'sometimes|string',
            'kk' => 'sometimes|nullable|string',
            'en' => 'sometimes|nullable|string',
            'key' => 'sometimes|string|max:190',
        ]);

        // Если изменили RU текст, обновляем hash и сбрасываем переводы
        if (isset($validated['ru']) && $translation->hasChangedRu($validated['ru'])) {
            $validated['hash'] = Translation::generateHash($validated['ru']);
            $validated['kk'] = null;
            $validated['en'] = null;

            // Очищаем кеш
            $this->translator->clearCacheFor($translation->scope, $translation->key);

            // Ставим задачи на перевод
            // Будет добавлено через очередь после сохранения
        }

        $validated['updated_by'] = auth()->id();

        $translation->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Перевод обновлен успешно',
            'data' => $translation,
        ]);
    }

    /**
     * Удалить перевод
     */
    public function destroy(Translation $translation): JsonResponse
    {
        $scope = $translation->scope;
        $key = $translation->key;

        $translation->delete();

        // Очищаем кеш
        $this->translator->clearCacheFor($scope, $key);

        return response()->json([
            'success' => true,
            'message' => 'Перевод удален успешно',
        ]);
    }

    /**
     * Массовый перевод всех текстов
     */
    public function translateAll(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'target_language' => 'required|in:kk,en',
            ]);

            $targetLang = $validated['target_language'];
            
            // Получаем все переводы, где целевой язык пустой
            $translations = Translation::where(function($query) use ($targetLang) {
                $query->whereNull($targetLang)
                      ->orWhere($targetLang, '');
            })->get();

            // Если нет переводов для обработки
            if ($translations->count() === 0) {
                return response()->json([
                    'success' => true,
                    'message' => 'Нет переводов для обработки. Все тексты уже переведены.',
                    'stats' => [
                        'translated' => 0,
                        'failed' => 0,
                        'total' => 0,
                    ],
                ]);
            }

            $translated = 0;
            $failed = 0;

            foreach ($translations as $translation) {
                try {
                    // Переводим через сервис Translator
                    $translatedText = $this->translator->translateDirect(
                        $translation->ru,
                        'ru',
                        $targetLang,
                        true
                    );

                    $translation->update([
                        $targetLang => $translatedText,
                    ]);

                    $translated++;
                } catch (\Exception $e) {
                    $failed++;
                    Log::error("Translation failed for ID {$translation->id}: " . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Переведено: {$translated}, ошибок: {$failed}",
                'stats' => [
                    'translated' => $translated,
                    'failed' => $failed,
                    'total' => $translations->count(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('TranslateAll error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при выполнении массового перевода: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Перевести заново для конкретного перевода
     */
    public function retranslate(Translation $translation): JsonResponse
    {
        // Сбрасываем переводы
        $translation->update([
            'kk' => null,
            'en' => null,
        ]);

        // Очищаем кеш
        $this->translator->clearCacheFor($translation->scope, $translation->key);

        // Ставим задачи на перевод через сервис
        $this->translator->bulkEnsure(
            $translation->scope,
            [$translation->key => $translation->ru],
            auth()->id()
        );

        return response()->json([
            'success' => true,
            'message' => 'Задачи на перевод добавлены в очередь',
        ]);
    }

    /**
     * Перевести заново весь scope
     */
    public function retranslateScope(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scope' => 'required|string|max:120',
        ]);

        $scope = $validated['scope'];
        $count = $this->translator->rehashScope($scope);

        return response()->json([
            'success' => true,
            'message' => "Обновлено переводов: {$count}. Задачи добавлены в очередь.",
            'count' => $count,
        ]);
    }

    /**
     * Очистить кеш переводов
     */
    public function clearCache(): JsonResponse
    {
        $this->translator->clearAllCache();

        return response()->json([
            'success' => true,
            'message' => 'Кеш переводов очищен',
        ]);
    }

    /**
     * Экспортировать словарь
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $validated = $request->validate([
            'scope' => 'required|string|max:120',
            'locale' => 'required|string|in:ru,kk,en',
        ]);

        $scope = $validated['scope'];
        $locale = $validated['locale'];

        $json = $this->translator->exportDictionary($scope, $locale);

        $filename = "translation_{$scope}_{$locale}_" . date('Y-m-d') . ".json";

        return response()->streamDownload(function () use ($json) {
            echo $json;
        }, $filename, [
            'Content-Type' => 'application/json',
        ]);
    }
}
