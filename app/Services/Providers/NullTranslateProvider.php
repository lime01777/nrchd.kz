<?php

namespace App\Services\Providers;

use App\Contracts\TranslateProvider;

/**
 * Заглушка провайдера перевода (для режима без подключения к API)
 * 
 * Возвращает оригинальный текст без перевода.
 * Используется при отключенном API или в режиме разработки.
 */
class NullTranslateProvider implements TranslateProvider
{
    /**
     * Возвращает оригинальный текст без перевода
     */
    public function translate(string $text, string $from, string $to): string
    {
        return $text;
    }

    /**
     * Возвращает оригинальные тексты без перевода
     */
    public function translateBatch(array $texts, string $from, string $to): array
    {
        return $texts;
    }
}

