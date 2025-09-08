<?php
/**
 * Тестовый файл для проверки системы переводов
 * Запустить: php test_translation_system.php
 */

require_once 'vendor/autoload.php';

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Тест системы переводов ===\n\n";

try {
    // 1. Проверка модели Translation
    echo "1. Проверка модели Translation...\n";
    $translation = new \App\Models\Translation();
    echo "✓ Модель создана успешно\n\n";

    // 2. Проверка сервиса переводов
    echo "2. Проверка сервиса переводов...\n";
    $translationService = app(\App\Services\Translation\TranslationService::class);
    echo "✓ TranslationService создан успешно\n\n";

    // 3. Проверка хелпера t()
    echo "3. Проверка хелпера t()...\n";
    if (function_exists('t')) {
        echo "✓ Хелпер t() доступен\n";
        $result = t('site.name', [], 'kk', 'site');
        echo "✓ Результат: $result\n\n";
    } else {
        echo "✗ Хелпер t() недоступен\n\n";
    }

    // 4. Проверка API маршрутов
    echo "4. Проверка API маршрутов...\n";
    $router = app('router');
    $routes = $router->getRoutes();
    
    $hasI18nRoute = false;
    $hasEnsureRoute = false;
    
    foreach ($routes as $route) {
        if ($route->uri() === 'api/i18n/{locale}') $hasI18nRoute = true;
        if ($route->uri() === 'api/translate/ensure') $hasEnsureRoute = true;
    }
    
    echo $hasI18nRoute ? "✓ Маршрут /api/i18n/{locale} найден\n" : "✗ Маршрут /api/i18n/{locale} не найден\n";
    echo $hasEnsureRoute ? "✓ Маршрут /api/translate/ensure найден\n" : "✗ Маршрут /api/translate/ensure не найден\n\n";

    // 5. Проверка middleware
    echo "5. Проверка middleware SetLocale...\n";
    $middleware = app(\App\Http\Middleware\SetLocale::class);
    echo "✓ Middleware SetLocale создан успешно\n\n";

    echo "=== Все тесты завершены ===\n";
    
} catch (Exception $e) {
    echo "✗ Ошибка: " . $e->getMessage() . "\n";
    echo "Файл: " . $e->getFile() . "\n";
    echo "Строка: " . $e->getLine() . "\n";
}
