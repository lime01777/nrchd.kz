<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactApplication extends Model
{
    use HasFactory;

    /**
     * Поля, доступные для массового заполнения
     */
    protected $fillable = [
        'category',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'organization',
        'project_name',
        'attachment_path',
        'status',
        'admin_notes',
        'reviewed_at',
        'assigned_to',
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
     * Связь с пользователем, которому назначена заявка
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Получить список доступных категорий
     */
    public static function getCategories()
    {
        return [
            'general' => 'Общие вопросы',
            'tech_competence' => 'Техническая компетенция',
            'medical_tourism' => 'Медицинский туризм',
            'medical_accreditation' => 'Медицинская аккредитация',
            'health_rate' => 'Оценка технологий здравоохранения',
            'clinics' => 'Клиники',
            'other' => 'Другое',
        ];
    }

    /**
     * Получить название категории на русском
     */
    public function getCategoryLabelAttribute()
    {
        $categories = self::getCategories();
        return $categories[$this->category] ?? 'Неизвестно';
    }

    /**
     * Получить список доступных статусов
     */
    public static function getStatuses()
    {
        return [
            'new' => 'Новая',
            'in_progress' => 'В работе',
            'resolved' => 'Решена',
            'rejected' => 'Отклонена',
        ];
    }

    /**
     * Получить статус на русском
     */
    public function getStatusLabelAttribute()
    {
        $statuses = self::getStatuses();
        return $statuses[$this->status] ?? 'Неизвестно';
    }

    /**
     * Получить цвет статуса для UI
     */
    public function getStatusColorAttribute()
    {
        $colors = [
            'new' => 'blue',
            'in_progress' => 'yellow',
            'resolved' => 'green',
            'rejected' => 'red',
        ];

        return $colors[$this->status] ?? 'gray';
    }

    /**
     * Скоупы для фильтрации
     */
    
    // Фильтр по статусу "новая"
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    // Фильтр по статусу "в работе"
    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    // Фильтр по статусу "решена"
    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    // Фильтр по любому статусу
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Фильтр по категории
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Фильтр по назначенному пользователю
    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    // Фильтр непросмотренных
    public function scopeUnreviewed($query)
    {
        return $query->whereNull('reviewed_at');
    }

    // Поиск по имени, email или телефону
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%")
              ->orWhere('subject', 'like', "%{$search}%")
              ->orWhere('message', 'like', "%{$search}%");
        });
    }
}

