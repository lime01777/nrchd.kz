<?php

namespace App\Services;

use App\Models\Translation;
use App\Contracts\TranslateProvider;
use App\Jobs\TranslateJob;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * Основной сервис переводов
 * 
 * Управляет получением, кешированием и генерацией переводов
 */
class Translator
{
    protected TranslateProvider $provider;
    protected TextProtector $protector;
    protected int $cacheTTL;
    protected string $defaultLocale;
    protected array $supportedLocales;

    public function __construct(
        TranslateProvider $provider,
        TextProtector $protector,
        int $cacheTTL = 86400,
        string $defaultLocale = 'ru',
        array $supportedLocales = ['ru', 'kk', 'en']
    ) {
        $this->provider = $provider;
        $this->protector = $protector;
        $this->cacheTTL = $cacheTTL;
        $this->defaultLocale = $defaultLocale;
        $this->supportedLocales = $supportedLocales;
    }

    /**
     * Получить перевод по scope и key
     * 
     * @param string $scope Область (ui, content, news и т.д.)
     * @param string $key Ключ перевода
     * @param string|null $locale Язык (null = текущий)
     * @param string $fallback Фолбэк язык
     * @return string
     */
    public function t(string $scope, string $key, ?string $locale = null, string $fallback = 'ru'): string
    {
        $locale = $locale ?? app()->getLocale();
        
        // Валидация локали
        if (!in_array($locale, $this->supportedLocales)) {
            $locale = $this->defaultLocale;
        }

        // Ключ кеша
        $cacheKey = $this->getCacheKey($scope, $key, $locale);

        // Пробуем получить из кеша
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        // Получаем из БД
        $translation = Translation::findTranslation($scope, $key);
        
        if (!$translation) {
            Log::warning("Translation not found: {$scope}.{$key} for locale {$locale}");
            return $key; // Возвращаем ключ, если перевода нет
        }

        $text = $translation->getTranslation($locale);
        
        // Если нет перевода для запрошенной локали, используем фолбэк
        if (empty($text) && $locale !== $fallback) {
            $text = $translation->getTranslation($fallback);
        }

        // Кешируем результат
        if (!empty($text)) {
            Cache::put($cacheKey, $text, $this->cacheTTL);
        }

        return $text ?? $key;
    }

    /**
     * Массово обеспечить наличие переводов
     * 
     * Создает/обновляет RU тексты и ставит задачи на перевод KK/EN
     * 
     * @param string $scope Область
     * @param array $pairs Массив [key => ruText]
     * @param int|null $userId ID пользователя
     * @return void
     */
    public function bulkEnsure(string $scope, array $pairs, ?int $userId = null): void
    {
        foreach ($pairs as $key => $ruText) {
            $hash = Translation::generateHash($ruText);
            
            $translation = Translation::where('scope', $scope)
                ->where('key', $key)
                ->first();

            if (!$translation) {
                // Создаем новый перевод
                $translation = Translation::create([
                    'scope' => $scope,
                    'key' => $key,
                    'ru' => $ruText,
                    'hash' => $hash,
                    'updated_by' => $userId,
                ]);

                // Ставим задачи на перевод KK и EN
                $this->queueTranslations($translation->id, $ruText, 'kk');
                $this->queueTranslations($translation->id, $ruText, 'en');
                
            } elseif ($translation->hasChangedRu($ruText)) {
                // RU текст изменился - обновляем и перегенерируем переводы
                $translation->update([
                    'ru' => $ruText,
                    'hash' => $hash,
                    'kk' => null, // Сбрасываем старые переводы
                    'en' => null,
                    'updated_by' => $userId,
                ]);

                // Очищаем кеш
                $this->clearCacheFor($scope, $key);

                // Ставим задачи на новый перевод
                $this->queueTranslations($translation->id, $ruText, 'kk');
                $this->queueTranslations($translation->id, $ruText, 'en');
            }
        }
    }

    /**
     * Поставить задачу на перевод в очередь
     */
    protected function queueTranslations(int $translationId, string $text, string $targetLocale): void
    {
        TranslateJob::dispatch($translationId, $text, 'ru', $targetLocale)
            ->onQueue('translations');
    }

    /**
     * Получить словарь для scope и локали
     * 
     * @param string $scope Область
     * @param string $locale Язык
     * @return array [key => translation]
     */
    public function getDictionary(string $scope, string $locale = 'ru'): array
    {
        $cacheKey = "dict:{$scope}:{$locale}";

        return Cache::remember($cacheKey, $this->cacheTTL, function () use ($scope, $locale) {
            return Translation::getScope($scope, $locale);
        });
    }

    /**
     * Очистить кеш для конкретного перевода
     */
    public function clearCacheFor(string $scope, string $key): void
    {
        foreach ($this->supportedLocales as $locale) {
            Cache::forget($this->getCacheKey($scope, $key, $locale));
        }
        
        // Также очищаем кеш словарей
        foreach ($this->supportedLocales as $locale) {
            Cache::forget("dict:{$scope}:{$locale}");
        }
    }

    /**
     * Очистить весь кеш переводов
     */
    public function clearAllCache(): void
    {
        Cache::tags(['translations'])->flush();
    }

    /**
     * Получить ключ кеша
     */
    protected function getCacheKey(string $scope, string $key, string $locale): string
    {
        return "tr:{$scope}:{$key}:{$locale}";
    }

    /**
     * Синхронно перевести текст (без БД, без кеша)
     * 
     * Используется для разовых переводов
     * 
     * @param string $text Текст
     * @param string $from Исходный язык
     * @param string $to Целевой язык
     * @param bool $protect Защищать ли термины
     * @return string
     */
    public function translateDirect(string $text, string $from, string $to, bool $protect = true): string
    {
        if ($from === $to) {
            return $text;
        }

        try {
            if ($protect) {
                return $this->protector->protectAndTranslate(
                    $text,
                    $from,
                    fn($protectedText) => $this->provider->translate($protectedText, $from, $to)
                );
            } else {
                return $this->provider->translate($text, $from, $to);
            }
        } catch (\Exception $e) {
            Log::error('Direct translation error', [
                'text' => substr($text, 0, 100),
                'from' => $from,
                'to' => $to,
                'error' => $e->getMessage()
            ]);
            
            return $text; // Возвращаем оригинал при ошибке
        }
    }

    /**
     * Пересчитать хеши и перегенерировать переводы для scope
     */
    public function rehashScope(string $scope): int
    {
        $translations = Translation::where('scope', $scope)->get();
        $count = 0;

        foreach ($translations as $translation) {
            $newHash = Translation::generateHash($translation->ru);
            
            if ($translation->hash !== $newHash) {
                $translation->update([
                    'hash' => $newHash,
                    'kk' => null,
                    'en' => null,
                ]);

                $this->queueTranslations($translation->id, $translation->ru, 'kk');
                $this->queueTranslations($translation->id, $translation->ru, 'en');
                
                $this->clearCacheFor($scope, $translation->key);
                $count++;
            }
        }

        return $count;
    }

    /**
     * Экспортировать словарь в JSON
     */
    public function exportDictionary(string $scope, string $locale): string
    {
        $dict = $this->getDictionary($scope, $locale);
        return json_encode($dict, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }

    /**
     * Получить статистику переводов
     */
    public function getStats(): array
    {
        $stats = [];

        foreach ($this->supportedLocales as $locale) {
            if ($locale === $this->defaultLocale) {
                continue;
            }

            $total = Translation::count();
            $translated = Translation::whereNotNull($locale)->count();
            
            $stats[$locale] = [
                'total' => $total,
                'translated' => $translated,
                'missing' => $total - $translated,
                'percentage' => $total > 0 ? round(($translated / $total) * 100, 2) : 0,
            ];
        }

        return $stats;
    }
}

