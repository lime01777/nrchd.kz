<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Translation extends Model
{
    use HasFactory;

    /**
     * Поля, которые можно массово присваивать
     *
     * @var array
     */
    protected $fillable = [
        'original_text',
        'translated_text',
        'source_language',
        'target_language',
        'content_type',
        'content_id',
    ];

    /**
     * Найти перевод по оригинальному тексту и языкам
     *
     * @param string $text Оригинальный текст
     * @param string $sourceLang Исходный язык
     * @param string $targetLang Целевой язык
     * @return string|Переведенный текст или null если не найден
     */
    public static function findTranslation($text, $sourceLang, $targetLang)
    {
        try {
            $translation = self::where([
                'original_text' => $text,
                'source_language' => $sourceLang,
                'target_language' => $targetLang
            ])->first();

            return $translation ? $translation->translated_text : null;
        } catch (\Exception $e) {
            Log::error('Error finding translation: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Получить все переводы для конкретного контента
     *
     * @param string $contentType Тип контента
     * @param int $contentId ID контента
     * @return array Массив переводов
     */
    public static function getContentTranslations($contentType, $contentId)
    {
        $translations = self::where([
            'content_type' => $contentType,
            'content_id' => $contentId
        ])->get();

        $result = [];
        foreach ($translations as $translation) {
            if (!isset($result[$translation->original_text])) {
                $result[$translation->original_text] = [];
            }
            $result[$translation->original_text][$translation->target_language] = $translation->translated_text;
        }

        return $result;
    }
}
