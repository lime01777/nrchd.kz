<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchInfographic extends Model
{
    use HasFactory;

    protected $fillable = [
        'research_id',
        'title',
        'image_path',
        'pdf_path',
        'attributes',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'attributes' => 'array',
    ];

    public function research()
    {
        return $this->belongsTo(Research::class);
    }
}
