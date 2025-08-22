<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Тест системы новостей ===\n\n";

// Тест 1: Проверка модели News
echo "1. Тестирование модели News...\n";
try {
    $news = new \App\Models\News();
    echo "✓ Модель News создана успешно\n";
    
    // Проверяем fillable поля
    $fillable = $news->getFillable();
    echo "✓ Fillable поля: " . implode(', ', $fillable) . "\n";
    
} catch (Exception $e) {
    echo "✗ Ошибка при создании модели: " . $e->getMessage() . "\n";
}

// Тест 2: Проверка контроллера
echo "\n2. Тестирование контроллера NewsController...\n";
try {
    $controller = new \App\Http\Controllers\Admin\NewsController();
    echo "✓ Контроллер NewsController создан успешно\n";
    
    // Проверяем методы
    $methods = get_class_methods($controller);
    $requiredMethods = ['index', 'create', 'store', 'edit', 'update', 'destroy'];
    
    foreach ($requiredMethods as $method) {
        if (in_array($method, $methods)) {
            echo "✓ Метод {$method} найден\n";
        } else {
            echo "✗ Метод {$method} не найден\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при создании контроллера: " . $e->getMessage() . "\n";
}

// Тест 3: Проверка маршрутов
echo "\n3. Тестирование маршрутов...\n";
try {
    $router = app('router');
    $routes = $router->getRoutes();
    
    $newsRoutes = [
        'admin.news' => 'GET',
        'admin.news.create' => 'GET', 
        'admin.news.store' => 'POST',
        'admin.news.edit' => 'GET',
        'admin.news.update' => 'PUT',
        'admin.news.destroy' => 'DELETE'
    ];
    
    foreach ($newsRoutes as $routeName => $method) {
        $route = $routes->getByName($routeName);
        if ($route) {
            echo "✓ Маршрут {$routeName} ({$method}) найден\n";
        } else {
            echo "✗ Маршрут {$routeName} ({$method}) не найден\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке маршрутов: " . $e->getMessage() . "\n";
}

// Тест 4: Проверка директорий для загрузки
echo "\n4. Тестирование директорий для загрузки...\n";
try {
    $storagePath = storage_path('app/public/news');
    if (!file_exists($storagePath)) {
        mkdir($storagePath, 0755, true);
        echo "✓ Директория {$storagePath} создана\n";
    } else {
        echo "✓ Директория {$storagePath} уже существует\n";
    }
    
    $publicPath = public_path('storage/news');
    if (!file_exists($publicPath)) {
        mkdir($publicPath, 0755, true);
        echo "✓ Директория {$publicPath} создана\n";
    } else {
        echo "✓ Директория {$publicPath} уже существует\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при создании директорий: " . $e->getMessage() . "\n";
}

// Тест 5: Проверка символической ссылки storage
echo "\n5. Тестирование символической ссылки storage...\n";
try {
    $storageLink = public_path('storage');
    if (!file_exists($storageLink)) {
        echo "! Символическая ссылка storage не найдена. Запустите: php artisan storage:link\n";
    } else {
        echo "✓ Символическая ссылка storage найдена\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке символической ссылки: " . $e->getMessage() . "\n";
}

// Тест 6: Проверка базы данных
echo "\n6. Тестирование базы данных...\n";
try {
    $newsCount = \App\Models\News::count();
    echo "✓ Подключение к БД успешно. Количество новостей: {$newsCount}\n";
    
    // Проверяем структуру таблицы
    $columns = \Schema::getColumnListing('news');
    $requiredColumns = ['id', 'title', 'slug', 'content', 'category', 'status', 'images'];
    
    foreach ($requiredColumns as $column) {
        if (in_array($column, $columns)) {
            echo "✓ Колонка {$column} найдена\n";
        } else {
            echo "✗ Колонка {$column} не найдена\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке БД: " . $e->getMessage() . "\n";
}

echo "\n=== Тест завершен ===\n";

// Рекомендации
echo "\n=== Рекомендации ===\n";
echo "1. Если символическая ссылка storage не найдена, выполните:\n";
echo "   php artisan storage:link\n\n";

echo "2. Для тестирования загрузки изображений:\n";
echo "   - Перейдите в админ-панель: /admin/news\n";
echo "   - Создайте новую новость\n";
echo "   - Попробуйте загрузить изображения\n\n";

echo "3. Для просмотра логов:\n";
echo "   tail -f storage/logs/laravel.log\n\n";

echo "4. Если есть проблемы с правами доступа:\n";
echo "   chmod -R 755 storage/\n";
echo "   chmod -R 755 public/storage/\n";
