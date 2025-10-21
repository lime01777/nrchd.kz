<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Модель термина глоссария (защищенные от перевода слова)
 * 
 * @property int $id
 * @property string $term Термин или имя собственное
 * @property string $locale Язык термина (ru, kk, en)
 * @property bool $case_sensitive Учитывать регистр
 * @property array|null $tags Теги для категоризации
 * @property bool $active Активен ли термин
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class GlossaryTerm extends Model
{
    protected $fillable = [
        'term',
        'locale',
        'case_sensitive',
        'tags',
        'active',
    ];

    protected $casts = [
        'case_sensitive' => 'boolean',
        'active' => 'boolean',
        'tags' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Получить активные термины для языка
     */
    public static function getActiveTerms(string $locale = 'ru', bool $useCache = true): array
    {
        if (!$useCache) {
            return static::where('locale', $locale)
                ->where('active', true)
                ->orderBy('term', 'desc')
                ->get()
                ->toArray();
        }

        $cacheKey = "glossary_terms:{$locale}";
        
        return Cache::remember($cacheKey, 3600, function () use ($locale) {
            return static::where('locale', $locale)
                ->where('active', true)
                ->orderBy('term', 'desc')
                ->get()
                ->toArray();
        });
    }

    /**
     * Добавить термин для всех языков
     */
    public static function addTermForAllLocales(string $term, array $tags = [], bool $caseSensitive = false): void
    {
        $locales = ['ru', 'kk', 'en'];
        
        foreach ($locales as $locale) {
            static::updateOrCreate(
                [
                    'term' => $term,
                    'locale' => $locale,
                ],
                [
                    'case_sensitive' => $caseSensitive,
                    'tags' => $tags,
                    'active' => true,
                ]
            );
        }

        static::clearCache();
    }

    /**
     * Добавить ФИО в глоссарий (все варианты)
     */
    public static function addFullName(string $lastName, string $firstName, ?string $middleName = null): void
    {
        $variants = static::generateNameVariants($lastName, $firstName, $middleName);
        
        foreach ($variants as $variant) {
            static::addTermForAllLocales($variant, ['person', 'name'], false);
        }
    }

    /**
     * Генерировать варианты ФИО
     */
    public static function generateNameVariants(string $lastName, string $firstName, ?string $middleName = null): array
    {
        $variants = [
            "$lastName $firstName", // Фамилия Имя
            "$firstName $lastName", // Имя Фамилия
        ];

        if ($middleName) {
            $variants[] = "$lastName $firstName $middleName"; // Фамилия Имя Отчество
            $variants[] = "$firstName $middleName $lastName"; // Имя Отчество Фамилия
            
            // С инициалами
            $fInit = mb_substr($firstName, 0, 1);
            $mInit = mb_substr($middleName, 0, 1);
            $variants[] = "$lastName $fInit.$mInit."; // Фамилия И.О.
            $variants[] = "$fInit.$mInit. $lastName"; // И.О. Фамилия
        } else {
            // Без отчества с инициалом
            $fInit = mb_substr($firstName, 0, 1);
            $variants[] = "$lastName $fInit."; // Фамилия И.
            $variants[] = "$fInit. $lastName"; // И. Фамилия
        }

        return array_unique($variants);
    }

    /**
     * Массово добавить ФИО из массива
     */
    public static function bulkAddNames(array $names): int
    {
        $count = 0;
        
        foreach ($names as $name) {
            if (isset($name['last_name']) && isset($name['first_name'])) {
                static::addFullName(
                    $name['last_name'],
                    $name['first_name'],
                    $name['middle_name'] ?? null
                );
                $count++;
            }
        }

        return $count;
    }

    /**
     * Очистить кеш терминов
     */
    public static function clearCache(): void
    {
        Cache::forget('glossary_terms:ru');
        Cache::forget('glossary_terms:kk');
        Cache::forget('glossary_terms:en');
    }

    /**
     * Событие после сохранения - очищаем кеш
     */
    protected static function booted(): void
    {
        static::saved(function () {
            static::clearCache();
        });

        static::deleted(function () {
            static::clearCache();
        });
    }

    /**
     * Поиск терминов по тегам
     */
    public static function findByTag(string $tag, string $locale = 'ru'): array
    {
        return static::where('locale', $locale)
            ->where('active', true)
            ->whereJsonContains('tags', $tag)
            ->orderBy('term')
            ->pluck('term')
            ->toArray();
    }

    /**
     * Активировать/деактивировать термин
     */
    public function toggleActive(): void
    {
        $this->active = !$this->active;
        $this->save();
    }
}

