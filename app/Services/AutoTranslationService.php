<?php

namespace App\Services;

abstract class AutoTranslationService
{
    /**
     * Переводит массив текстов
     * 
     * @param array $data Массив ['ключ' => 'текст']
     * @param string $targetLanguage Целевой язык
     * @param string $sourceLanguage Исходный язык
     * @return array
     */
    public function translateArray(array $data, string $targetLanguage, string $sourceLanguage = 'kz'): array
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = $this->translateText($value, $targetLanguage, $sourceLanguage);
            } elseif (is_array($value)) {
                $data[$key] = $this->translateArray($value, $targetLanguage, $sourceLanguage);
            }
        }
        return $data;
    }

    /**
     * Абстрактный метод для перевода одиночного текста
     */
    abstract public function translateText($text, $targetLanguage, $sourceLanguage = 'kz');
}
