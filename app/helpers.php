<?php
use App\Services\Translation\TranslationService;

/** Хелпер t(): возвращает перевод для текущей локали. */
function t(string $key, array $repl = [], ?string $locale = null, ?string $namespace = null, ?string $context = null): string {
    /** @var TranslationService $svc */
    $svc = app(TranslationService::class);
    $locale = $locale ?: app()->getLocale();
    $value = $svc->get($key, $locale, $namespace, $context);
    foreach ($repl as $k => $v) $value = str_replace(':'.$k, (string)$v, $value);
    return $value;
}
