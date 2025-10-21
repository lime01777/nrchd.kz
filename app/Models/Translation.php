<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Модель перевода текста
 * 
 * @property int $id
 * @property string $scope Область (ui, content, news и т.д.)
 * @property string $key Ключ перевода
 * @property string $ru Русский текст (базовый)
 * @property string|null $kk Казахский текст
 * @property string|null $en Английский текст
 * @property string $hash Хеш от RU текста
 * @property array|null $meta Метаданные
 * @property int|null $updated_by ID пользователя, обновившего перевод
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Translation extends Model
{
    protected $fillable = [
        'scope',
        'key',
        'ru',
        'kk',
        'en',
        'hash',
        'meta',
        'updated_by',
    ];

    protected $casts = [
        'meta' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Связь с пользователем, обновившим перевод
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Сгенерировать хеш от текста
     */
    public static function generateHash(string $text): string
    {
        return hash('sha256', trim($text));
    }

    /**
     * Найти перевод по scope и key
     */
    public static function findTranslation(string $scope, string $key): ?self
    {
        return static::where('scope', $scope)
            ->where('key', $key)
            ->first();
    }

    /**
     * Получить перевод для конкретной локали
     */
    public function getTranslation(string $locale): ?string
    {
        return match($locale) {
            'ru' => $this->ru,
            'kk' => $this->kk ?? $this->ru,
            'en' => $this->en ?? $this->ru,
            default => $this->ru,
        };
    }

    /**
     * Установить перевод для локали
     */
    public function setTranslation(string $locale, string $text): void
    {
        match($locale) {
            'ru' => $this->ru = $text,
            'kk' => $this->kk = $text,
            'en' => $this->en = $text,
            default => null,
        };
    }

    /**
     * Проверить, нужен ли перевод для локали
     */
    public function needsTranslation(string $locale): bool
    {
        return match($locale) {
            'ru' => false, // RU всегда есть
            'kk' => empty($this->kk),
            'en' => empty($this->en),
            default => true,
        };
    }

    /**
     * Проверить, изменился ли RU текст
     */
    public function hasChangedRu(string $newRuText): bool
    {
        return $this->hash !== static::generateHash($newRuText);
    }

    /**
     * Получить все переводы для scope
     */
    public static function getScope(string $scope, string $locale = 'ru'): array
    {
        return static::where('scope', $scope)
            ->get()
            ->mapWithKeys(fn($t) => [$t->key => $t->getTranslation($locale)])
            ->toArray();
    }

    /**
     * Массово создать/обновить переводы
     */
    public static function bulkUpsert(string $scope, array $translations, ?int $userId = null): void
    {
        foreach ($translations as $key => $ruText) {
            $hash = static::generateHash($ruText);
            
            static::updateOrCreate(
                ['scope' => $scope, 'key' => $key],
                [
                    'ru' => $ruText,
                    'hash' => $hash,
                    'updated_by' => $userId,
                ]
            );
        }
    }
}
