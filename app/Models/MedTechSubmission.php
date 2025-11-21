<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedTechSubmission extends Model
{
    use HasFactory;

    protected $table = 'medtech_submissions';

    protected $fillable = [
        'organization',
        'contact_name',
        'contact_email',
        'contact_phone',
        'technology_name',
        'description',
        'type',
        'trl',
        'pilot_sites',
        'attachment_path',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'trl' => 'integer',
    ];

    /**
     * Получить URL вложения
     */
    public function getAttachmentUrlAttribute(): ?string
    {
        if (!$this->attachment_path) {
            return null;
        }

        return asset('storage/' . $this->attachment_path);
    }
}
