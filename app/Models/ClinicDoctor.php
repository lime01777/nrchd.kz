<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClinicDoctor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'clinic_id',
        'name_ru', 'name_kk', 'name_en',
        'position_ru', 'position_kk', 'position_en',
        'photo_path',
        'contacts',
        'is_featured',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contacts' => 'array',
        'is_featured' => 'boolean',
    ];

    /**
     * Отношение с клиникой
     */
    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Получить имя на текущем языке
     */
    public function getNameAttribute()
    {
        $locale = app()->getLocale();
        $field = "name_{$locale}";
        return $this->$field ?: $this->name_ru;
    }

    /**
     * Получить должность на текущем языке
     */
    public function getPositionAttribute()
    {
        $locale = app()->getLocale();
        $field = "position_{$locale}";
        return $this->$field ?: $this->position_ru;
    }

    /**
     * Получить полный URL фото
     */
    public function getPhotoUrlAttribute()
    {
        if (empty($this->photo_path)) {
            return null;
        }
        
        if (strpos($this->photo_path, 'http') === 0) {
            return $this->photo_path;
        }
        
        return asset('img/clinics/' . $this->clinic->slug . '/doctors/' . basename($this->photo_path));
    }

    /**
     * Scope для избранных врачей
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope для врачей конкретной клиники
     */
    public function scopeByClinic($query, $clinicId)
    {
        return $query->where('clinic_id', $clinicId);
    }
}
