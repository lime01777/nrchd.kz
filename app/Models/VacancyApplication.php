<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VacancyApplication extends Model
{
    use HasFactory;

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'vacancy_id',
        'name',
        'email',
        'phone',
        'cover_letter',
        'resume_path',
        'status',
        'notes',
        'reviewed_at',
    ];

    /**
     * Преобразование типов
     */
    protected $casts = [
        'reviewed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Связь с вакансией
     */
    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    /**
     * Получить статус на русском
     */
    public function getStatusLabelAttribute()
    {
        $statuses = [
            'new' => 'Новая',
            'reviewed' => 'Просмотрена',
            'contacted' => 'Связались',
            'rejected' => 'Отклонена',
            'hired' => 'Принят',
        ];

        return $statuses[$this->status] ?? 'Неизвестно';
    }

    /**
     * Получить цвет статуса для UI
     */
    public function getStatusColorAttribute()
    {
        $colors = [
            'new' => 'blue',
            'reviewed' => 'yellow',
            'contacted' => 'purple',
            'rejected' => 'red',
            'hired' => 'green',
        ];

        return $colors[$this->status] ?? 'gray';
    }

    /**
     * Скоупы для фильтрации
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}


