<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Research extends Model
{
    use HasFactory;

    protected $table = 'researches';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'sample',
        'geography',
        'period',
        'methodology',
        'citation_rules',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function indicators()
    {
        return $this->hasMany(ResearchIndicator::class)->orderBy('sort_order');
    }

    public function dashboards()
    {
        return $this->hasMany(ResearchDashboard::class)->orderBy('sort_order');
    }

    public function files()
    {
        return $this->hasMany(ResearchFile::class)->orderBy('sort_order');
    }

    public function infographics()
    {
        return $this->hasMany(ResearchInfographic::class)->orderBy('sort_order');
    }
}
