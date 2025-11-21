<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedTechRegistry extends Model
{
    use HasFactory;

    protected $table = 'medtech_registry';

    protected $fillable = [
        'name',
        'description',
        'type',
        'application_area',
        'trl',
        'status',
        'developer',
        'pilot_sites',
        'full_description',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'trl' => 'integer',
        'order' => 'integer',
    ];

    /**
     * Scope для активных записей
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope для сортировки
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('created_at', 'desc');
    }
}
