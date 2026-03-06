<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OkkProject extends Model
{
    protected $fillable = [
        'name',
        'type',
        'folder_path',
        'status',
        'meeting_time',
    ];

    protected $casts = [
        'meeting_time' => 'datetime',
    ];

    public function votes()
    {
        return $this->hasMany(OkkVote::class, 'project_id');
    }

    public function questions()
    {
        return $this->hasMany(OkkQuestion::class, 'project_id');
    }
}
