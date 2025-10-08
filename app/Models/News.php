<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class News extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'news';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'content',
        'category',
        'status',
        'publish_date',
        'image',
        'views',
        'images',
        'main_image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'publish_date' => 'datetime',
        'views' => 'integer',
        'category' => 'array',
        // 'images' => 'array', // Убираем cast, так как используем кастомный аксессор
    ];

    /**
     * Получить отформатированную дату публикации
     *
     * @return string|null
     */
    public function getFormattedPublishDateAttribute()
    {
        if (!$this->publish_date) {
            return null;
        }
        
        // Проверяем, является ли это Carbon объектом
        if ($this->publish_date instanceof Carbon) {
            return $this->publish_date->format('Y-m-d');
        }
        
        // Если это строка или другой тип, преобразуем в Carbon
        try {
            return Carbon::parse($this->publish_date)->format('Y-m-d');
        } catch (\Carbon\Exceptions\InvalidFormatException $e) {
            // Логируем ошибку для отладки
            Log::warning('Не удалось распарсить дату публикации', [
                'news_id' => $this->id ?? 'unknown',
                'publish_date' => $this->publish_date,
                'error' => $e->getMessage()
            ]);
            return null;
        } catch (\Exception $e) {
            // Логируем любые другие ошибки
            Log::error('Ошибка при форматировании даты публикации', [
                'news_id' => $this->id ?? 'unknown',
                'publish_date' => $this->publish_date,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Получить все медиафайлы новости
     *
     * @return array
     */
    public function getMediaAttribute()
    {
        return $this->images ?? [];
    }

    /**
     * Получить медиафайлы по типу
     *
     * @param string $type 'image' или 'video'
     * @return array
     */
    public function getMediaByType($type)
    {
        $media = $this->getMediaAttribute();
        if (empty($media)) {
            return [];
        }

        return array_filter($media, function ($item) use ($type) {
            if (is_string($item)) {
                // Старый формат - определяем тип по расширению
                $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'ogg'];
                $itemType = in_array($extension, $videoExtensions) ? 'video' : 'image';
                return $itemType === $type;
            } elseif (is_array($item) && isset($item['type'])) {
                // Новый формат - используем поле type
                return $item['type'] === $type;
            }
            return false;
        });
    }

    /**
     * Получить только изображения
     *
     * @return array
     */
    public function getImagesOnlyAttribute()
    {
        return $this->getMediaByType('image');
    }

    /**
     * Получить только видео
     *
     * @return array
     */
    public function getVideosOnlyAttribute()
    {
        return $this->getMediaByType('video');
    }

    /**
     * Проверить, есть ли медиафайлы
     *
     * @return bool
     */
    public function hasMedia()
    {
        $media = $this->getMediaAttribute();
        return !empty($media);
    }

    /**
     * Проверить, есть ли изображения
     *
     * @return bool
     */
    public function hasImages()
    {
        return !empty($this->getImagesOnlyAttribute());
    }

    /**
     * Проверить, есть ли видео
     *
     * @return bool
     */
    public function hasVideos()
    {
        return !empty($this->getVideosOnlyAttribute());
    }

    /**
     * Получить первое изображение
     *
     * @return string|null
     */
    public function getFirstImageAttribute()
    {
        $images = $this->getImagesOnlyAttribute();
        if (empty($images)) {
            return null;
        }

        $firstImage = reset($images);
        return is_string($firstImage) ? $firstImage : ($firstImage['path'] ?? null);
    }

    /**
     * Получить первое видео
     *
     * @return string|null
     */
    public function getFirstVideoAttribute()
    {
        $videos = $this->getVideosOnlyAttribute();
        if (empty($videos)) {
            return null;
        }

        $firstVideo = reset($videos);
        return is_string($firstVideo) ? $firstVideo : ($firstVideo['path'] ?? null);
    }

    /**
     * Мутатор для поля images - нормализует структуру медиа
     *
     * @param mixed $value
     * @return void
     */
    public function setImagesAttribute($value)
    {
        if (is_array($value)) {
            // Нормализуем структуру медиа
            $normalizedMedia = [];
            foreach ($value as $item) {
                if (is_string($item)) {
                    // Старый формат - строка пути
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
                    // Новый формат - уже объект
                    $normalizedMedia[] = $item;
                }
            }
            $this->attributes['images'] = json_encode($normalizedMedia);
        } else {
            $this->attributes['images'] = $value;
        }
    }

    /**
     * Аксессор для поля images - возвращает нормализованные данные
     *
     * @param mixed $value
     * @return array
     */
    public function getImagesAttribute($value)
    {
        if (empty($value)) {
            return [];
        }

        // Если это JSON строка, декодируем
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return $decoded;
            }
        }

        // Если это уже массив, возвращаем как есть
        if (is_array($value)) {
            return $value;
        }

        return [];
    }
}
