<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Vacancy extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'body', 'city', 'department', 'employment_type', 'status', 'published_at'
    ];

    protected $casts = [
        'body' => 'array',
        'published_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($vacancy) {
            if (empty($vacancy->slug)) {
                $vacancy->slug = Str::slug($vacancy->title);
            }
        });
    }

    //
}
