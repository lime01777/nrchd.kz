<?php

namespace App\Jobs;

use App\Models\Translation;
use App\Contracts\TranslateProvider;
use App\Services\TextProtector;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Задача для асинхронного перевода текста
 */
class TranslateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Количество попыток выполнения
     */
    public int $tries = 3;

    /**
     * Таймаут выполнения в секундах
     */
    public int $timeout = 120;

    /**
     * Детерминированный бэкофф (в секундах)
     */
    public array $backoff = [30, 120, 300]; // 30 сек, 2 мин, 5 мин

    protected int $translationId;
    protected string $text;
    protected string $fromLocale;
    protected string $toLocale;

    /**
     * Создать новый экземпляр задачи
     */
    public function __construct(int $translationId, string $text, string $fromLocale, string $toLocale)
    {
        $this->translationId = $translationId;
        $this->text = $text;
        $this->fromLocale = $fromLocale;
        $this->toLocale = $toLocale;
    }

    /**
     * Выполнить задачу
     */
    public function handle(TranslateProvider $provider, TextProtector $protector): void
    {
        $startTime = microtime(true);

        try {
            // Загружаем перевод из БД
            $translation = Translation::find($this->translationId);
            
            if (!$translation) {
                Log::error("Translation not found for job", ['id' => $this->translationId]);
                return;
            }

            // Проверяем, нужен ли еще перевод
            if (!$translation->needsTranslation($this->toLocale)) {
                Log::info("Translation already exists", [
                    'id' => $this->translationId,
                    'locale' => $this->toLocale
                ]);
                return;
            }

            // Защищаем термины
            [$protectedText, $map] = $protector->protect($this->text, $this->fromLocale);

            // Переводим
            $translatedProtected = $provider->translate($protectedText, $this->fromLocale, $this->toLocale);

            // Восстанавливаем термины
            $translatedText = $protector->restore($translatedProtected, $map);

            // Сохраняем результат
            $translation->setTranslation($this->toLocale, $translatedText);
            $translation->save();

            // Очищаем кеш
            $this->clearCache($translation);

            // Логируем успех
            $duration = round((microtime(true) - $startTime) * 1000, 2);
            
            Log::channel('i18n')->info('Translation completed', [
                'id' => $this->translationId,
                'scope' => $translation->scope,
                'key' => $translation->key,
                'from' => $this->fromLocale,
                'to' => $this->toLocale,
                'chars' => mb_strlen($this->text),
                'duration_ms' => $duration,
                'provider' => class_basename($provider),
            ]);

        } catch (\Exception $e) {
            // Логируем ошибку
            Log::error('Translation job failed', [
                'id' => $this->translationId,
                'from' => $this->fromLocale,
                'to' => $this->toLocale,
                'attempt' => $this->attempts(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Если исчерпаны попытки, сохраняем оригинальный текст
            if ($this->attempts() >= $this->tries) {
                $this->saveFallback();
            }

            throw $e; // Перебрасываем для retry
        }
    }

    /**
     * Сохранить фолбэк (оригинальный текст) при исчерпании попыток
     */
    protected function saveFallback(): void
    {
        try {
            $translation = Translation::find($this->translationId);
            
            if ($translation && $translation->needsTranslation($this->toLocale)) {
                // Сохраняем оригинальный RU текст как фолбэк
                $translation->setTranslation($this->toLocale, $translation->ru);
                $translation->save();

                Log::warning('Translation fallback saved', [
                    'id' => $this->translationId,
                    'locale' => $this->toLocale,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to save translation fallback', [
                'id' => $this->translationId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Очистить кеш для перевода
     */
    protected function clearCache(Translation $translation): void
    {
        $cacheKey = "tr:{$translation->scope}:{$translation->key}:{$this->toLocale}";
        Cache::forget($cacheKey);
        
        // Также очищаем кеш словаря
        Cache::forget("dict:{$translation->scope}:{$this->toLocale}");
    }

    /**
     * Обработка неудачного выполнения задачи
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Translation job permanently failed', [
            'id' => $this->translationId,
            'from' => $this->fromLocale,
            'to' => $this->toLocale,
            'error' => $exception->getMessage(),
        ]);
    }

    /**
     * Уникальный ID задачи для предотвращения дубликатов
     */
    public function uniqueId(): string
    {
        return "translate:{$this->translationId}:{$this->toLocale}";
    }

    /**
     * Теги для мониторинга задачи
     */
    public function tags(): array
    {
        return [
            'translation',
            "translation:{$this->translationId}",
            "locale:{$this->toLocale}",
        ];
    }
}

