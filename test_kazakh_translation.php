<?php

/**
 * Тестовый скрипт для проверки работы системы переводов
 * Запуск: php test_kazakh_translation.php
 */

require_once 'vendor/autoload.php';

use App\Services\AutoTranslationService;
use App\Models\StoredTranslation;

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🚀 Тестирование системы переводов на казахский язык\n";
echo "==================================================\n\n";

// Тест 1: Проверка сервиса переводов
echo "1. Тестирование сервиса переводов...\n";
try {
    $translationService = app(AutoTranslationService::class);
    echo "✅ Сервис переводов инициализирован\n";
} catch (Exception $e) {
    echo "❌ Ошибка инициализации сервиса: " . $e->getMessage() . "\n";
    exit(1);
}

// Тест 2: Проверка языковых файлов
echo "\n2. Проверка языковых файлов...\n";
$languages = ['kz', 'ru', 'en'];
foreach ($languages as $lang) {
    $langPath = resource_path("lang/$lang");
    if (is_dir($langPath)) {
        $files = glob($langPath . '/*.php');
        echo "✅ Язык $lang: " . count($files) . " файлов\n";
    } else {
        echo "❌ Язык $lang: папка не найдена\n";
    }
}

// Тест 3: Проверка базы данных
echo "\n3. Проверка базы данных...\n";
try {
    $count = StoredTranslation::count();
    echo "✅ Таблица переводов: $count записей\n";
    
    $languages = StoredTranslation::groupBy('target_language')
        ->selectRaw('target_language, count(*) as count')
        ->get();
    
    foreach ($languages as $lang) {
        echo "   - {$lang->target_language}: {$lang->count} переводов\n";
    }
} catch (Exception $e) {
    echo "❌ Ошибка базы данных: " . $e->getMessage() . "\n";
}

// Тест 4: Проверка конфигурации
echo "\n4. Проверка конфигурации...\n";
$config = config('app');
echo "✅ Основной язык: " . ($config['locale'] ?? 'не установлен') . "\n";
echo "✅ Fallback язык: " . ($config['fallback_locale'] ?? 'не установлен') . "\n";

$googleKey = config('services.google.translate_api_key');
if ($googleKey) {
    echo "✅ Google Translate API ключ: настроен\n";
} else {
    echo "⚠️  Google Translate API ключ: не настроен\n";
}

// Тест 5: Тестовый перевод
echo "\n5. Тестовый перевод...\n";
try {
    $testText = "Добро пожаловать на наш сайт";
    $translation = $translationService->translateText($testText, 'kz', 'ru');
    
    if ($translation !== $testText) {
        echo "✅ Перевод успешен: '$testText' → '$translation'\n";
    } else {
        echo "⚠️  Перевод не выполнен (возможно, нет API ключа)\n";
    }
} catch (Exception $e) {
    echo "❌ Ошибка перевода: " . $e->getMessage() . "\n";
}

// Тест 6: Проверка middleware
echo "\n6. Проверка middleware...\n";
$middlewarePath = app_path('Http/Middleware/AutoLanguageDetectionMiddleware.php');
if (file_exists($middlewarePath)) {
    echo "✅ Middleware найден\n";
    
    // Проверяем регистрацию в Kernel
    $kernelPath = app_path('Http/Kernel.php');
    $kernelContent = file_get_contents($kernelPath);
    if (strpos($kernelContent, 'AutoLanguageDetectionMiddleware') !== false) {
        echo "✅ Middleware зарегистрирован в Kernel\n";
    } else {
        echo "⚠️  Middleware не зарегистрирован в Kernel\n";
    }
} else {
    echo "❌ Middleware не найден\n";
}

// Тест 7: Проверка API маршрутов
echo "\n7. Проверка API маршрутов...\n";
$apiPath = base_path('routes/api.php');
$apiContent = file_get_contents($apiPath);
if (strpos($apiContent, 'TranslationAPIController') !== false) {
    echo "✅ API контроллер зарегистрирован\n";
} else {
    echo "❌ API контроллер не зарегистрирован\n";
}

// Тест 8: Проверка JavaScript утилиты
echo "\n8. Проверка JavaScript утилиты...\n";
$jsPath = resource_path('js/Utils/TranslationHelper.js');
if (file_exists($jsPath)) {
    echo "✅ JavaScript утилита найдена\n";
} else {
    echo "❌ JavaScript утилита не найдена\n";
}

// Тест 9: Проверка команды Artisan
echo "\n9. Проверка команды Artisan...\n";
$commandPath = app_path('Console/Commands/TranslateAllTexts.php');
if (file_exists($commandPath)) {
    echo "✅ Команда Artisan найдена\n";
    echo "   Использование: php artisan translate:all --dry-run\n";
} else {
    echo "❌ Команда Artisan не найдена\n";
}

// Тест 10: Проверка компонента MediaSlider
echo "\n10. Проверка компонента MediaSlider...\n";
$componentPath = resource_path('js/Components/MediaSlider.jsx');
if (file_exists($componentPath)) {
    $componentContent = file_get_contents($componentPath);
    if (strpos($componentContent, 'window.translations') !== false) {
        echo "✅ Компонент поддерживает переводы\n";
    } else {
        echo "⚠️  Компонент не поддерживает переводы\n";
    }
} else {
    echo "❌ Компонент не найден\n";
}

echo "\n🎉 Тестирование завершено!\n";
echo "\n📋 Рекомендации:\n";
echo "1. Убедитесь, что Google Translate API ключ настроен\n";
echo "2. Запустите миграции: php artisan migrate\n";
echo "3. Протестируйте переводы: php artisan translate:all --dry-run\n";
echo "4. Проверьте логи: tail -f storage/logs/laravel.log\n";
echo "\n📚 Документация: KAZAKH_TRANSLATION_SETUP.md\n";
