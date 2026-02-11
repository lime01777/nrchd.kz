<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiService extends Model
{
    protected $guarded = [];

    protected $casts = [
        'pathology' => 'array',
        'modality' => 'array',
        'area' => 'array',
        'advantages' => 'array',
        'purpose' => 'array',
        'validationTable' => 'array',
        'risks' => 'array',
        'limitations' => 'array',
        'discontinuationReasons' => 'array',
    ];
}
