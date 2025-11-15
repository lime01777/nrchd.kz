<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClinicalProtocolMetadata extends Model
{
    use HasFactory;

    protected $fillable = [
        'file_path',
        'medicine_category_ids',
        'mkb_codes',
    ];

    protected $casts = [
        'medicine_category_ids' => 'array',
        'mkb_codes' => 'array',
    ];
}

