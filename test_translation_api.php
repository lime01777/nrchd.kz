<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Schema;

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Тест API перевода ===\n\n";

// Тест 1: Проверка маршрутов
echo "1. Проверка маршрутов API:\n";
try {
    $router = app('router');
    $routes = $router->getRoutes();
    
    $apiRoutes = [
        'POST /api/translate' => false,
        'POST /api/translate-batch' => false,
        'POST /api/translations/translate' => false
    ];
    
    foreach ($routes as $route) {
        $method = $route->methods()[0];
        $uri = $route->uri();
        $key = "$method /$uri";
        
        if (isset($apiRoutes[$key])) {
            $apiRoutes[$key] = true;
            echo "✓ Найден маршрут: $key\n";
        }
    }
    
    foreach ($apiRoutes as $route => $found) {
        if (!$found) {
            echo "✗ Не найден маршрут: $route\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке маршрутов: " . $e->getMessage() . "\n";
}

// Тест 2: Проверка контроллера
echo "\n2. Проверка контроллера:\n";
try {
    $controller = new \App\Http\Controllers\Api\TranslationAPIController(
        app(\App\Services\AutoTranslationService::class)
    );
    echo "✓ Контроллер создан успешно\n";
    
    // Проверяем методы
    $methods = ['translate', 'translateBatch', 'getTranslations'];
    foreach ($methods as $method) {
        if (method_exists($controller, $method)) {
            echo "✓ Метод {$method} найден\n";
        } else {
            echo "✗ Метод {$method} не найден\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при создании контроллера: " . $e->getMessage() . "\n";
}

// Тест 3: Проверка сервиса перевода
echo "\n3. Проверка сервиса перевода:\n";
try {
    $translationService = app(\App\Services\AutoTranslationService::class);
    echo "✓ Сервис перевода создан успешно\n";
    
    // Проверяем метод перевода
    if (method_exists($translationService, 'translateText')) {
        echo "✓ Метод translateText найден\n";
    } else {
        echo "✗ Метод translateText не найден\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при создании сервиса: " . $e->getMessage() . "\n";
}

// Тест 4: Проверка модели переводов
echo "\n4. Проверка модели переводов:\n";
try {
    $model = new \App\Models\StoredTranslation();
    echo "✓ Модель StoredTranslation создана успешно\n";
    
    // Проверяем таблицу
    $tableExists = Schema::hasTable('stored_translations');
    if ($tableExists) {
        echo "✓ Таблица stored_translations существует\n";
    } else {
        echo "✗ Таблица stored_translations не существует\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке модели: " . $e->getMessage() . "\n";
}

// Тест 5: Проверка языковых файлов
echo "\n5. Проверка языковых файлов:\n";
$languages = ['ru', 'kz', 'en'];
foreach ($languages as $lang) {
    $langPath = resource_path("lang/{$lang}");
    if (is_dir($langPath)) {
        echo "✓ Директория для языка {$lang} существует\n";
        
        // Проверяем основные файлы
        $mainFiles = ['app.php', 'validation.php', 'pagination.php'];
        foreach ($mainFiles as $file) {
            $filePath = $langPath . '/' . $file;
            if (file_exists($filePath)) {
                echo "  ✓ Файл {$lang}/{$file} существует\n";
            } else {
                echo "  ✗ Файл {$lang}/{$file} не существует\n";
            }
        }
    } else {
        echo "✗ Директория для языка {$lang} не существует\n";
    }
}

echo "\n=== Тест завершен ===\n";

// Рекомендации
echo "\n=== Рекомендации ===\n";
echo "1. Если маршруты не найдены, проверьте:\n";
echo "   - Файл routes/api.php\n";
echo "   - Кэш маршрутов: php artisan route:clear\n\n";

echo "2. Если контроллер не создается, проверьте:\n";
echo "   - Файл app/Http/Controllers/Api/TranslationAPIController.php\n";
echo "   - Зависимости в конструкторе\n\n";

echo "3. Если сервис не работает, проверьте:\n";
echo "   - Файл app/Services/AutoTranslationService.php\n";
echo "   - Конфигурацию переводов\n\n";

echo "4. Для тестирования API:\n";
echo "   - Откройте браузер и перейдите на сайт\n";
echo "   - Проверьте консоль браузера на ошибки\n";
echo "   - Проверьте Network tab в DevTools\n";
