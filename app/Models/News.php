<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Модель новостей
 * 
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $excerpt
 * @property string $body
 * @property string|null $cover_image_path
 * @property string|null $cover_image_thumb_path
 * @property string|null $cover_image_alt
 * @property string|null $seo_title
 * @property string|null $seo_description
 * @property string $status
 * @property \Carbon\Carbon|null $published_at
 * @property int|null $created_by
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 * @property \Carbon\Carbon|null $deleted_at
 * @property-read string $cover_url
 * @property-read string $cover_thumb_url
 * @property-read \App\Models\User|null $creator
 */
class News extends Model
{
    /** Тип публикации: обычные новости. */
    public const TYPE_NEWS = 'news';

    /** Тип публикации: материалы СМИ о нас. */
    public const TYPE_MEDIA = 'media';

    /** Доступные типы публикаций. */
    public const TYPES = [
        self::TYPE_NEWS,
        self::TYPE_MEDIA,
    ];
    use HasFactory, SoftDeletes;

    /**
     * Таблица, связанная с моделью
     *
     * @var string
     */
    protected $table = 'news';

    /**
     * Поля, доступные для массового присвоения
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'body',
        'cover_image_path',
        'cover_image_thumb_path',
        'cover_image_alt',
        'seo_title',
        'seo_description',
        'status',
        'type',
        'published_at',
        'created_by',
        // Старые поля для обратной совместимости
        'content',
        'category',
        'tags',
        'publish_date',
        'image',
        'views',
        'images',
        'main_image',
    ];

    /**
     * Атрибуты, которые должны быть приведены к типам
     *
     * @var array<string, string>
     */
    protected $casts = [
        'published_at' => 'datetime',
        'publish_date' => 'datetime', // Для обратной совместимости
        'views' => 'integer',
        'category' => 'array',
        'type' => 'string',
        'tags' => 'array',
    ];

    /**
     * Boot метод модели
     * Автогенерация slug из title при создании/обновлении
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($news) {
            if (empty($news->slug) && !empty($news->title)) {
                $news->slug = static::generateUniqueSlug($news->title);
            }
            if (empty($news->created_by) && auth()->check()) {
                $news->created_by = auth()->id();
            }
            // Гарантируем корректный тип публикации.
            if (empty($news->type) || !in_array($news->type, self::TYPES, true)) {
                $news->type = self::TYPE_NEWS;
            }
        });

        static::updating(function ($news) {
            // Обновляем slug только если изменился title и slug не был изменен вручную
            if ($news->isDirty('title') && !$news->isDirty('slug')) {
                $news->slug = static::generateUniqueSlug($news->title, $news->id);
            }
            if ($news->isDirty('type') && !in_array($news->type, self::TYPES, true)) {
                $news->type = self::TYPE_NEWS;
            }
        });
    }

    /**
     * Генерирует уникальный slug из заголовка
     *
     * @param string $title
     * @param int|null $excludeId ID записи, которую исключаем при проверке уникальности
     * @return string
     */
    public static function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Связь с пользователем-создателем
     *
     * @return BelongsTo
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Аксессор: URL обложки (оригинал)
     * Поддерживает как новое поле cover_image_path, так и старые поля для обратной совместимости
     *
     * @return string
     */
    public function getCoverUrlAttribute(): string
    {
        // Новый формат
        if ($this->cover_image_path) {
            return asset('storage/' . $this->cover_image_path);
        }
        
        // Старый формат для обратной совместимости
        if ($this->main_image) {
            return asset('storage/' . $this->main_image);
        }
        
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        
        // Фолбэк на placeholder
        return asset('/img/news/placeholder.jpg');
    }

    /**
     * Аксессор: URL миниатюры обложки
     *
     * @return string
     */
    public function getCoverThumbUrlAttribute(): string
    {
        if ($this->cover_image_thumb_path) {
            return asset('storage/' . $this->cover_image_thumb_path);
        }
        
        // Если есть оригинал, но нет миниатюры, используем оригинал
        if ($this->cover_image_path) {
            return asset('storage/' . $this->cover_image_path);
        }
        
        // Фолбэк на placeholder
        return asset('/img/news/placeholder.jpg');
    }

    /**
     * Скоуп: только опубликованные новости
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->when(config('app.env') !== 'local', fn($q) => $q->whereNotNull('published_at'))
            ->orderByDesc('published_at');
    }

    /**
     * Скоуп: фильтрация по типу публикации.
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        if (!in_array($type, self::TYPES, true)) {
            $type = self::TYPE_NEWS;
        }

        return $query->where('type', $type);
    }

    /**
     * Скоуп: поиск по термину
     *
     * @param Builder $query
     * @param string $term
     * @return Builder
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhere('excerpt', 'like', "%{$term}%")
                ->orWhere('body', 'like', "%{$term}%");
        });
    }

    /**
     * Получить отформатированную дату публикации (для обратной совместимости)
     *
     * @return string|null
     */
    public function getFormattedPublishDateAttribute(): ?string
    {
        $date = $this->published_at ?? $this->publish_date;
        
        if (!$date) {
            return null;
        }
        
        if ($date instanceof Carbon) {
            return $date->format('Y-m-d');
        }
        
        try {
            return Carbon::parse($date)->format('Y-m-d');
        } catch (\Exception $e) {
            Log::warning('Не удалось распарсить дату публикации', [
                'news_id' => $this->id ?? 'unknown',
                'date' => $date,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Получить все медиафайлы новости (для обратной совместимости)
     *
     * @return array
     */
    public function getMediaAttribute(): array
    {
        return $this->images ?? [];
    }

    /**
     * Получить медиафайлы по типу (для обратной совместимости)
     *
     * @param string $type 'image' или 'video'
     * @return array
     */
    public function getMediaByType(string $type): array
    {
        $media = $this->getMediaAttribute();
        if (empty($media)) {
            return [];
        }

        return array_filter($media, function ($item) use ($type) {
            if (is_string($item)) {
                $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
                $itemType = in_array($extension, $videoExtensions) ? 'video' : 'image';
                return $itemType === $type;
            } elseif (is_array($item) && isset($item['type'])) {
                return $item['type'] === $type;
            }
            return false;
        });
    }

    /**
     * Получить только изображения (для обратной совместимости)
     *
     * @return array
     */
    public function getImagesOnlyAttribute(): array
    {
        return $this->getMediaByType('image');
    }

    /**
     * Получить только видео (для обратной совместимости)
     *
     * @return array
     */
    public function getVideosOnlyAttribute(): array
    {
        return $this->getMediaByType('video');
    }

    /**
     * Проверить, есть ли медиафайлы (для обратной совместимости)
     *
     * @return bool
     */
    public function hasMedia(): bool
    {
        $media = $this->getMediaAttribute();
        return !empty($media);
    }

    /**
     * Проверить, есть ли изображения (для обратной совместимости)
     *
     * @return bool
     */
    public function hasImages(): bool
    {
        return !empty($this->getImagesOnlyAttribute());
    }

    /**
     * Проверить, есть ли видео (для обратной совместимости)
     *
     * @return bool
     */
    public function hasVideos(): bool
    {
        return !empty($this->getVideosOnlyAttribute());
    }

    /**
     * Получить первое изображение (для обратной совместимости)
     *
     * @return string|null
     */
    public function getFirstImageAttribute(): ?string
    {
        $images = $this->getImagesOnlyAttribute();
        if (empty($images)) {
            return null;
        }

        $firstImage = reset($images);
        return is_string($firstImage) ? $firstImage : ($firstImage['path'] ?? null);
    }

    /**
     * Получить первое видео (для обратной совместимости)
     *
     * @return string|null
     */
    public function getFirstVideoAttribute(): ?string
    {
        $videos = $this->getVideosOnlyAttribute();
        if (empty($videos)) {
            return null;
        }

        $firstVideo = reset($videos);
        return is_string($firstVideo) ? $firstVideo : ($firstVideo['path'] ?? null);
    }

    /**
     * Мутатор для поля images - нормализует структуру медиа (для обратной совместимости)
     *
     * @param mixed $value
     * @return void
     */
    public function setImagesAttribute($value): void
    {
        if (is_array($value)) {
            $normalizedMedia = [];
            foreach ($value as $item) {
                if (is_string($item)) {
                    $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                    $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
                    $type = in_array($extension, $videoExtensions) ? 'video' : 'image';
                    
                    $normalizedMedia[] = [
                        'path' => $item,
                        'type' => $type,
                        'name' => basename($item),
                        'source' => 'existing'
                    ];
                } elseif (is_array($item)) {
                    $normalizedMedia[] = $item;
                }
            }
            $this->attributes['images'] = json_encode($normalizedMedia);
        } else {
            $this->attributes['images'] = $value;
        }
    }

    /**
     * Аксессор для поля images - возвращает нормализованные данные (для обратной совместимости)
     *
     * @param mixed $value
     * @return array
     */
    public function getImagesAttribute($value): array
    {
        if (empty($value)) {
            return [];
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        if (is_array($value)) {
            return $value;
        }

        return [];
    }
}
