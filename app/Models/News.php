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
        'images' => 'array',
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
}
