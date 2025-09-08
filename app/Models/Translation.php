<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

/** Eloquent-модель строк перевода. */
class Translation extends Model {
    protected $fillable = ['key','locale','value','namespace','context'];
}
