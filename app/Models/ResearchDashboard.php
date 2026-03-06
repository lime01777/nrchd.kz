<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchDashboard extends Model
{
    use HasFactory;

    protected $fillable = [
        'research_id',
        'title',
        'embed_url',
        'type', // trend, map, comparison
        'description',
        'sort_order',
    ];

    public function research()
    {
        return $this->belongsTo(Research::class);
    }
}
