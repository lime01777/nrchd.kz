<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedTechDocument extends Model
{
    use HasFactory;

    protected $table = 'medtech_documents';

    protected $fillable = [
        'title',
        'description',
        'type',
        'file_path',
        'file_name',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Получить URL файла
     */
    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }

        if (str_starts_with($this->file_path, 'http')) {
            return $this->file_path;
        }

        return asset('storage/' . $this->file_path);
    }
}
