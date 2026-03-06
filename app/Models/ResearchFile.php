<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'research_id',
        'title',
        'category',
        'file_path',
        'file_type',
        'sort_order',
    ];

    public function research()
    {
        return $this->belongsTo(Research::class);
    }
}
