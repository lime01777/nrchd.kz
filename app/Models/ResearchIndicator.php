<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchIndicator extends Model
{
    use HasFactory;

    protected $fillable = [
        'research_id',
        'name',
        'definition',
        'sort_order',
    ];

    public function research()
    {
        return $this->belongsTo(Research::class);
    }
}
