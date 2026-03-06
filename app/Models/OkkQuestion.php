<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OkkQuestion extends Model
{
    protected $fillable = [
        'project_id',
        'text',
        'is_active',
        'sort_order',
    ];

    public function project()
    {
        return $this->belongsTo(OkkProject::class, 'project_id');
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
