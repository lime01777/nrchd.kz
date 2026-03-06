<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OkkVote extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'question_id',
        'answer',
    ];

    public function project()
    {
        return $this->belongsTo(OkkProject::class, 'project_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function question()
    {
        return $this->belongsTo(OkkQuestion::class, 'question_id');
    }
}
