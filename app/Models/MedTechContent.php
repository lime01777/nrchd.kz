<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedTechContent extends Model
{
    use HasFactory;

    protected $table = 'medtech_content';

    protected $fillable = [
        'section',
        'key',
        'content_ru',
        'content_kz',
        'content_en',
        'image_path',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Получить контент на текущем языке
     */
    public function getContentAttribute(): ?string
    {
        $locale = app()->getLocale();
        
        return match($locale) {
            'kz' => $this->content_kz,
            'en' => $this->content_en,
            default => $this->content_ru,
        };
    }

    /**
     * Получить URL изображения
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        return asset('storage/' . $this->image_path);
    }
}
