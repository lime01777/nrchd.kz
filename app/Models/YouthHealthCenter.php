<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YouthHealthCenter extends Model
{
    use HasFactory;

    /**
     * Название таблицы
     */
    protected $table = 'youth_health_centers';

    /**
     * Поля, доступные для массового заполнения
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'organization',
        'address',
        'region',
        'latitude',
        'longitude',
        'is_active',
    ];

    /**
     * Типы полей
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_active' => 'boolean',
    ];

    /**
     * Scope для активных центров
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope для фильтрации по региону
     */
    public function scopeByRegion($query, $region)
    {
        return $query->where('region', $region);
    }

    /**
     * Scope для поиска
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('organization', 'like', "%{$search}%")
              ->orWhere('address', 'like', "%{$search}%")
              ->orWhere('region', 'like', "%{$search}%");
        });
    }
}

