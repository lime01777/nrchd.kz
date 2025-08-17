<?php

/**
 * Скрипт для проверки и исправления проблем с переводами
 * Запуск: php fix_translation_issues.php
 */

require_once 'vendor/autoload.php';

use App\Services\AutoTranslationService;
use App\Models\StoredTranslation;

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔧 Проверка и исправление проблем с переводами\n";
echo "==============================================\n\n";

// 1. Проверка конфигурации
echo "1. Проверка конфигурации...\n";
$config = config('app');
echo "✅ Основной язык: " . ($config['locale'] ?? 'не установлен') . "\n";
echo "✅ Fallback язык: " . ($config['fallback_locale'] ?? 'не установлен') . "\n";

$googleKey = config('services.google.translate_api_key');
if ($googleKey) {
    echo "✅ Google Translate API ключ: настроен\n";
} else {
    echo "⚠️  Google Translate API ключ: не настроен\n";
    echo "   Добавьте в .env: GOOGLE_TRANSLATE_API_KEY=your_key\n";
}

// 2. Проверка языковых файлов
echo "\n2. Проверка языковых файлов...\n";
$languages = ['kz', 'ru', 'en'];
$totalKeys = [];

foreach ($languages as $lang) {
    $langPath = resource_path("lang/$lang");
    if (is_dir($langPath)) {
        $files = glob($langPath . '/*.php');
        $langKeys = [];
        
        foreach ($files as $file) {
            $fileName = basename($file, '.php');
            $fileTranslations = include $file;
            if (is_array($fileTranslations)) {
                foreach ($fileTranslations as $key => $value) {
                    if (is_string($value)) {
                        $langKeys[] = "$fileName.$key";
                        $totalKeys[] = "$fileName.$key";
                    }
                }
            }
        }
        
        echo "✅ Язык $lang: " . count($files) . " файлов, " . count($langKeys) . " ключей\n";
    } else {
        echo "❌ Язык $lang: папка не найдена\n";
    }
}

// 3. Проверка базы данных
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

// 4. Проверка дублирования в казахском файле
echo "\n4. Проверка дублирования в казахском файле...\n";
$kzPath = resource_path("lang/kz/common.php");
if (file_exists($kzPath)) {
    $kzTranslations = include $kzPath;
    $duplicates = [];
    $keys = [];
    
    foreach ($kzTranslations as $key => $value) {
        if (in_array($key, $keys)) {
            $duplicates[] = $key;
        }
        $keys[] = $key;
    }
    
    if (empty($duplicates)) {
        echo "✅ Дублирования не найдены\n";
    } else {
        echo "❌ Найдены дублирования: " . implode(', ', $duplicates) . "\n";
    }
} else {
    echo "❌ Казахский файл не найден\n";
}

// 5. Проверка middleware
echo "\n5. Проверка middleware...\n";
$middlewarePath = app_path('Http/Middleware/AutoLanguageDetectionMiddleware.php');
if (file_exists($middlewarePath)) {
    echo "✅ Middleware найден\n";
    
    $kernelPath = app_path('Http/Kernel.php');
    $kernelContent = file_get_contents($kernelPath);
    if (strpos($kernelContent, 'AutoLanguageDetectionMiddleware') !== false) {
        echo "✅ Middleware зарегистрирован в Kernel\n";
    } else {
        echo "❌ Middleware не зарегистрирован в Kernel\n";
    }
} else {
    echo "❌ Middleware не найден\n";
}

// 6. Проверка API маршрутов
echo "\n6. Проверка API маршрутов...\n";
$apiPath = base_path('routes/api.php');
$apiContent = file_get_contents($apiPath);
if (strpos($apiContent, 'TranslationAPIController') !== false) {
    echo "✅ API контроллер зарегистрирован\n";
} else {
    echo "❌ API контроллер не зарегистрирован\n";
}

// 7. Проверка JavaScript утилиты
echo "\n7. Проверка JavaScript утилиты...\n";
$jsPath = resource_path('js/Utils/TranslationHelper.js');
if (file_exists($jsPath)) {
    echo "✅ JavaScript утилита найдена\n";
} else {
    echo "❌ JavaScript утилита не найдена\n";
}

// 8. Проверка компонента MediaSlider
echo "\n8. Проверка компонента MediaSlider...\n";
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

// 9. Рекомендации
echo "\n📋 Рекомендации:\n";
echo "1. Убедитесь, что Google Translate API ключ настроен в .env\n";
echo "2. Запустите команду для перевода всех текстов:\n";
echo "   php artisan translate:all --from=kz --to=ru,en\n";
echo "3. Проверьте логи: tail -f storage/logs/laravel.log\n";
echo "4. Протестируйте сайт с разными языками\n";

echo "\n🎉 Проверка завершена!\n";
