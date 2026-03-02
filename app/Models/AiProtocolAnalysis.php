<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiProtocolAnalysis extends Model
{
    protected $fillable = [
        'name',
        'indication',
        'status',
        'result_path',
        'log',
        'progress',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
