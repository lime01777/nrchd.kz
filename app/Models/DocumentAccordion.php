<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentAccordion extends Model
{
    use HasFactory;
    
    /**
     * Атрибуты, которые можно массово назначать.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'page_route',
        'folder_path',
        'title',
        'bg_color',
        'is_active',
        'sort_order',
    ];
    
    /**
     * Атрибуты, которые должны быть приведены к определенным типам.
     *
     * @var array
     */
    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
    
    /**
     * Получить все активные аккордеоны для указанного маршрута страницы.
     *
     * @param string $pageRoute
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getForPage($pageRoute)
    {
        return self::where('page_route', $pageRoute)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }
}
