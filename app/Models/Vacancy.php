<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Vacancy extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'body', 'functional_responsibilities', 'qualification_requirements', 
        'application_procedure', 'city', 'department', 'employment_type', 'status', 'published_at'
    ];

    protected $casts = [
        'body' => 'array',
        'functional_responsibilities' => 'array',
        'qualification_requirements' => 'array',
        'application_procedure' => 'array',
        'published_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($vacancy) {
            if (empty($vacancy->slug)) {
                $vacancy->slug = Str::slug($vacancy->title);
            }
            
            // Устанавливаем статус по умолчанию как 'published', если не указан
            if (empty($vacancy->status)) {
                $vacancy->status = 'published';
            }
            
            // Если статус 'published' и нет даты публикации, устанавливаем текущую дату
            if ($vacancy->status === 'published' && empty($vacancy->published_at)) {
                $vacancy->published_at = now();
            }
        });
    }

    //
}
