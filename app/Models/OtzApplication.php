<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtzApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'current_stage',
        'description',
        'responsible_person',
        'phone',
        'email',
        'stage_start_date',
        'stage_end_date',
        'stage_documents',
        'stage_progress',
        'is_active'
    ];

    protected $casts = [
        'stage_documents' => 'array',
        'stage_progress' => 'array',
        'stage_start_date' => 'date',
        'stage_end_date' => 'date',
        'is_active' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->application_id)) {
                $model->application_id = self::generateApplicationId();
            }
        });
    }

    /**
     * Генерирует уникальный ID заявки
     */
    public static function generateApplicationId()
    {
        $year = date('Y');
        $lastApplication = self::where('application_id', 'like', "OT3-{$year}-%")
            ->orderBy('application_id', 'desc')
            ->first();

        if ($lastApplication) {
            $lastNumber = (int) substr($lastApplication->application_id, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return "OT3-{$year}-" . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Получает все этапы процесса
     */
    public static function getStages()
    {
        return [
            'Подача заявки',
            'Проверка документов',
            'Проведение ОТЗ',
            'Рассмотрение комиссиями',
            'Бюджетное одобрение',
            'Формирование тарифов'
        ];
    }

    /**
     * Получает категории
     */
    public static function getCategories()
    {
        return ['Комплексная', 'Простая'];
    }

    /**
     * Проверяет, завершен ли этап
     */
    public function isStageCompleted($stage)
    {
        $stages = self::getStages();
        $currentIndex = array_search($this->current_stage, $stages);
        $stageIndex = array_search($stage, $stages);
        
        return $stageIndex < $currentIndex;
    }

    /**
     * Проверяет, является ли этап текущим
     */
    public function isCurrentStage($stage)
    {
        return $this->current_stage === $stage;
    }
}
