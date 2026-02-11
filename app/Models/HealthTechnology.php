<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthTechnology extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'validation_date' => 'date',
        'piloting_date' => 'date',
        'revalidation_date' => 'date',
        'status_date' => 'date',
        'app_orgs' => 'array', // Will auto-serialize JSON
        'directions' => 'array',
        'documents' => 'array',
    ];
}
