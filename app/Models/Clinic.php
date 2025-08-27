<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Clinic extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'name_ru', 'name_kk', 'name_en',
        'short_desc_ru', 'short_desc_kk', 'short_desc_en',
        'full_desc_ru', 'full_desc_kk', 'full_desc_en',
        'city_ru', 'city_kk', 'city_en',
        'address_ru', 'address_kk', 'address_en',
        'phone', 'email', 'website',
        'working_hours_ru', 'working_hours_kk', 'working_hours_en',
        'specialties_ru', 'specialties_kk', 'specialties_en',
        'services_ru', 'services_kk', 'services_en',
        'accreditations_ru', 'accreditations_kk', 'accreditations_en',
        'equipment_ru', 'equipment_kk', 'equipment_en',
        'map_lat', 'map_lng',
        'logo_path', 'hero_path', 'gallery',
        'is_published', 'publish_at',
        'seo_title_ru', 'seo_title_kk', 'seo_title_en',
        'seo_desc_ru', 'seo_desc_kk', 'seo_desc_en',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'working_hours_ru' => 'array',
        'working_hours_kk' => 'array',
        'working_hours_en' => 'array',
        'specialties_ru' => 'array',
        'specialties_kk' => 'array',
        'specialties_en' => 'array',
        'services_ru' => 'array',
        'services_kk' => 'array',
        'services_en' => 'array',
        'accreditations_ru' => 'array',
        'accreditations_kk' => 'array',
        'accreditations_en' => 'array',
        'equipment_ru' => 'array',
        'equipment_kk' => 'array',
        'equipment_en' => 'array',
        'gallery' => 'array',
        'is_published' => 'boolean',
        'publish_at' => 'datetime',
        'map_lat' => 'decimal:7',
        'map_lng' => 'decimal:7',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Автоматически генерируем slug из name_ru при создании
        static::creating(function ($clinic) {
            if (empty($clinic->slug) && !empty($clinic->name_ru)) {
                $clinic->slug = self::generateUniqueSlug($clinic->name_ru);
            }
        });

        // Обновляем slug при изменении name_ru
        static::updating(function ($clinic) {
            if ($clinic->isDirty('name_ru') && !empty($clinic->name_ru)) {
                $clinic->slug = self::generateUniqueSlug($clinic->name_ru, $clinic->id);
            }
        });
    }

    /**
     * Генерирует уникальный slug из названия
     */
    public static function generateUniqueSlug($name, $excludeId = null)
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        $query = self::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $query = self::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
            $counter++;
        }

        return $slug;
    }

    /**
     * Отношение с врачами
     */
    public function doctors()
    {
        return $this->hasMany(ClinicDoctor::class);
    }

    /**
     * Получить название на текущем языке
     */
    public function getNameAttribute()
    {
        $locale = app()->getLocale();
        $field = "name_{$locale}";
        return $this->$field ?: $this->name_ru;
    }

    /**
     * Получить краткое описание на текущем языке
     */
    public function getShortDescAttribute()
    {
        $locale = app()->getLocale();
        $field = "short_desc_{$locale}";
        return $this->$field ?: $this->short_desc_ru;
    }

    /**
     * Получить полное описание на текущем языке
     */
    public function getFullDescAttribute()
    {
        $locale = app()->getLocale();
        $field = "full_desc_{$locale}";
        return $this->$field ?: $this->full_desc_ru;
    }

    /**
     * Получить город на текущем языке
     */
    public function getCityAttribute()
    {
        $locale = app()->getLocale();
        $field = "city_{$locale}";
        return $this->$field ?: $this->city_ru;
    }

    /**
     * Получить адрес на текущем языке
     */
    public function getAddressAttribute()
    {
        $locale = app()->getLocale();
        $field = "address_{$locale}";
        return $this->$field ?: $this->address_ru;
    }

    /**
     * Получить рабочие часы на текущем языке
     */
    public function getWorkingHoursAttribute()
    {
        $locale = app()->getLocale();
        $field = "working_hours_{$locale}";
        return $this->$field ?: $this->working_hours_ru;
    }

    /**
     * Получить специализации на текущем языке
     */
    public function getSpecialtiesAttribute()
    {
        $locale = app()->getLocale();
        $field = "specialties_{$locale}";
        return $this->$field ?: $this->specialties_ru;
    }

    /**
     * Получить услуги на текущем языке
     */
    public function getServicesAttribute()
    {
        $locale = app()->getLocale();
        $field = "services_{$locale}";
        return $this->$field ?: $this->services_ru;
    }

    /**
     * Получить аккредитации на текущем языке
     */
    public function getAccreditationsAttribute()
    {
        $locale = app()->getLocale();
        $field = "accreditations_{$locale}";
        return $this->$field ?: $this->accreditations_ru;
    }

    /**
     * Получить оборудование на текущем языке
     */
    public function getEquipmentAttribute()
    {
        $locale = app()->getLocale();
        $field = "equipment_{$locale}";
        return $this->$field ?: $this->equipment_ru;
    }

    /**
     * Получить SEO заголовок на текущем языке
     */
    public function getSeoTitleAttribute()
    {
        $locale = app()->getLocale();
        $field = "seo_title_{$locale}";
        return $this->$field ?: $this->seo_title_ru;
    }

    /**
     * Получить SEO описание на текущем языке
     */
    public function getSeoDescAttribute()
    {
        $locale = app()->getLocale();
        $field = "seo_desc_{$locale}";
        return $this->$field ?: $this->seo_desc_ru;
    }

    /**
     * Получить полный URL логотипа
     */
    public function getLogoUrlAttribute()
    {
        if (empty($this->logo_path)) {
            return null;
        }
        
        if (strpos($this->logo_path, 'http') === 0) {
            return $this->logo_path;
        }
        
        return asset('img/clinics/' . $this->slug . '/' . basename($this->logo_path));
    }

    /**
     * Получить полный URL главного изображения
     */
    public function getHeroUrlAttribute()
    {
        if (empty($this->hero_path)) {
            return null;
        }
        
        if (strpos($this->hero_path, 'http') === 0) {
            return $this->hero_path;
        }
        
        return asset('img/clinics/' . $this->slug . '/' . basename($this->hero_path));
    }

    /**
     * Получить галерею с полными URL
     */
    public function getGalleryUrlsAttribute()
    {
        if (empty($this->gallery) || !is_array($this->gallery)) {
            return [];
        }

        return array_map(function($image) {
            if (strpos($image, 'http') === 0) {
                return $image;
            }
            return asset('img/clinics/' . $this->slug . '/' . basename($image));
        }, $this->gallery);
    }

    /**
     * Проверить, опубликована ли клиника
     */
    public function getIsPublishedAttribute($value)
    {
        if (!$value) {
            return false;
        }

        // Если есть дата публикации, проверяем её
        if ($this->publish_at) {
            return $this->publish_at->isPast();
        }

        return $value;
    }

    /**
     * Scope для опубликованных клиник
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                    ->where(function($q) {
                        $q->whereNull('publish_at')
                          ->orWhere('publish_at', '<=', now());
                    });
    }

    /**
     * Scope для поиска по городу
     */
    public function scopeByCity($query, $city)
    {
        return $query->where(function($q) use ($city) {
            $q->where('city_ru', 'like', "%{$city}%")
              ->orWhere('city_kk', 'like', "%{$city}%")
              ->orWhere('city_en', 'like', "%{$city}%");
        });
    }

    /**
     * Scope для поиска по специализации
     */
    public function scopeBySpecialty($query, $specialty)
    {
        return $query->where(function($q) use ($specialty) {
            $q->whereJsonContains('specialties_ru', $specialty)
              ->orWhereJsonContains('specialties_kk', $specialty)
              ->orWhereJsonContains('specialties_en', $specialty);
        });
    }

    /**
     * Scope для поиска по услуге
     */
    public function scopeByService($query, $service)
    {
        return $query->where(function($q) use ($service) {
            $q->whereJsonContains('services_ru', $service)
              ->orWhereJsonContains('services_kk', $service)
              ->orWhereJsonContains('services_en', $service);
        });
    }

    /**
     * Scope для поиска по тексту
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name_ru', 'like', "%{$search}%")
              ->orWhere('name_kk', 'like', "%{$search}%")
              ->orWhere('name_en', 'like', "%{$search}%")
              ->orWhere('short_desc_ru', 'like', "%{$search}%")
              ->orWhere('short_desc_kk', 'like', "%{$search}%")
              ->orWhere('short_desc_en', 'like', "%{$search}%")
              ->orWhere('city_ru', 'like', "%{$search}%")
              ->orWhere('city_kk', 'like', "%{$search}%")
              ->orWhere('city_en', 'like', "%{$search}%");
        });
    }
}
