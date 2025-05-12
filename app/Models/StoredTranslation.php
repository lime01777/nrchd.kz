<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoredTranslation extends Model
{
    /**
     * Таблица, связанная с моделью
     *
     * @var string
     */
    protected $table = 'stored_translations';

    /**
     * Поля, доступные для массового заполнения
     *
     * @var array
     */
    protected $fillable = [
        'original_text',
        'translated_text',
        'target_language',
        'page_url',
        'hash',
        'is_verified'
    ];

    /**
     * Создать хэш из оригинального текста и языка перевода
     *
     * @param string $originalText
     * @param string $targetLanguage
     * @return string
     */
    public static function generateHash(string $originalText, string $targetLanguage): string
    {
        return md5($originalText . '_' . $targetLanguage);
    }

    /**
     * Найти перевод по оригинальному тексту и языку
     *
     * @param string $originalText
     * @param string $targetLanguage
     * @return string|null
     */
    public static function findTranslation(string $originalText, string $targetLanguage): ?string
    {
        $hash = self::generateHash($originalText, $targetLanguage);
        $translation = self::where('hash', $hash)
            ->where('target_language', $targetLanguage)
            ->first();

        return $translation ? $translation->translated_text : null;
    }
}
