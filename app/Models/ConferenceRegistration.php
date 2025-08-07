<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConferenceRegistration extends Model
{
    use HasFactory;
    
    /**
     * Поля, доступные для массового заполнения
     * 
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'phone',
        'organization',
        'position',
        'type',
        'topic',
        'participant_category',
    ];
    
    /**
     * Автоматическое добавление IP-адреса перед созданием записи
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($registration) {
            $registration->ip_address = request()->ip();
        });
    }
}
