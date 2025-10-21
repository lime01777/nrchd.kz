<?php

/**
 * Хелпер t(): возвращает перевод для текущей локали.
 * Использует стандартную систему переводов Laravel.
 */
function t(string $key, array $repl = [], ?string $locale = null): string {
    $locale = $locale ?: app()->getLocale();
    
    // Используем стандартную функцию перевода Laravel
    $value = trans($key, $repl, $locale);
    
    // Если перевод не найден, возвращаем ключ
    if ($value === $key) {
        // Пытаемся найти в common файле
        $value = trans("common.{$key}", $repl, $locale);
    }
    
    return $value;
}
