<?php

namespace App\Contracts;

/**
 * Интерфейс провайдера автоматического перевода текста
 * 
 * Реализации могут использовать Google Translate, DeepL или другие API
 */
interface TranslateProvider
{
    /**
     * Перевести текст с одного языка на другой
     *
     * @param string $text Текст для перевода
     * @param string $from Исходный язык (ru, kk, en)
     * @param string $to Целевой язык (ru, kk, en)
     * @return string Переведенный текст
     * @throws \RuntimeException если перевод не удался
     */
    public function translate(string $text, string $from, string $to): string;
    
    /**
     * Массовый перевод текстов (опционально, для оптимизации)
     *
     * @param array<string> $texts Массив текстов для перевода
     * @param string $from Исходный язык
     * @param string $to Целевой язык
     * @return array<string> Массив переведенных текстов в том же порядке
     */
    public function translateBatch(array $texts, string $from, string $to): array;
}

