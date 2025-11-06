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
     * Проверяет наличие перевода в БД, если нет - переводит через Google Translate
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
                        'from_db' => 0,
                        'from_google' => 0,
                        'failed' => 0,
                        'total' => 0,
                    ],
                ]);
            }

            $translated = 0;
            $fromDb = 0;
            $fromGoogle = 0;
            $failed = 0;

            foreach ($translations as $translation) {
                try {
                    // 1. Проверяем, есть ли уже перевод в БД для этого текста
                    $existingTranslation = Translation::where('ru', $translation->ru)
                        ->whereNotNull($targetLang)
                        ->where($targetLang, '!=', '')
                        ->first();

                    if ($existingTranslation) {
                        // Используем существующий перевод из БД
                        $translatedText = $existingTranslation->{$targetLang};
                        
                        $translation->update([
                            $targetLang => $translatedText,
                            'updated_by' => auth()->id(),
                        ]);
                        
                        $fromDb++;
                        $translated++;
                        
                        Log::info("Использован существующий перевод из БД для: {$translation->scope}.{$translation->key}");
                    } else {
                        // 2. Если перевода нет в БД - переводим через Google Translate
                        $translatedText = $this->translator->translateDirect(
                            $translation->ru,
                            'ru',
                            $targetLang,
                            true // Защита терминов
                        );

                        // Сохраняем перевод в БД
                        $translation->update([
                            $targetLang => $translatedText,
                            'updated_by' => auth()->id(),
                        ]);

                        $fromGoogle++;
                        $translated++;
                        
                        Log::info("Создан новый перевод через Google для: {$translation->scope}.{$translation->key}");
                    }
                    
                    // Очищаем кеш для этого перевода
                    $this->translator->clearCacheFor($translation->scope, $translation->key);
                    
                } catch (\Exception $e) {
                    $failed++;
                    Log::error("Ошибка перевода для ID {$translation->id}: " . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Переведено: {$translated} (из БД: {$fromDb}, через Google: {$fromGoogle}), ошибок: {$failed}",
                'stats' => [
                    'translated' => $translated,
                    'from_db' => $fromDb,
                    'from_google' => $fromGoogle,
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

    /**
     * Проверить и перевести отдельный текст
     * Сначала ищет в БД, если не находит - переводит через Google Translate
     */
    public function translateSingle(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'text' => 'required|string',
                'target_language' => 'required|in:kk,en',
                'scope' => 'nullable|string|max:120',
                'key' => 'nullable|string|max:190',
            ]);

            $text = $validated['text'];
            $targetLang = $validated['target_language'];
            $scope = $validated['scope'] ?? 'manual';
            $key = $validated['key'] ?? md5($text);

            // 1. Проверяем наличие перевода в БД
            $existingTranslation = Translation::where('ru', $text)
                ->whereNotNull($targetLang)
                ->where($targetLang, '!=', '')
                ->first();

            if ($existingTranslation) {
                // Найден существующий перевод
                return response()->json([
                    'success' => true,
                    'translation' => $existingTranslation->{$targetLang},
                    'source' => 'database',
                    'message' => 'Перевод найден в базе данных',
                ]);
            }

            // 2. Если не найден - переводим через Google Translate
            try {
                $translatedText = $this->translator->translateDirect(
                    $text,
                    'ru',
                    $targetLang,
                    true
                );

                // 3. Сохраняем новый перевод в БД
                Translation::updateOrCreate(
                    ['scope' => $scope, 'key' => $key],
                    [
                        'ru' => $text,
                        'hash' => Translation::generateHash($text),
                        $targetLang => $translatedText,
                        'updated_by' => auth()->id(),
                    ]
                );

                return response()->json([
                    'success' => true,
                    'translation' => $translatedText,
                    'source' => 'google_translate',
                    'message' => 'Текст переведен через Google Translate и сохранен в БД',
                ]);

            } catch (\Exception $e) {
                Log::error('Ошибка перевода через Google Translate: ' . $e->getMessage());
                
                return response()->json([
                    'success' => false,
                    'message' => 'Ошибка перевода: ' . $e->getMessage(),
                    'translation' => $text, // Возвращаем оригинал
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('TranslateSingle error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ошибка: ' . $e->getMessage(),
            ], 500);
        }
    }
}
