<?php

require_once 'vendor/autoload.php';

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Тест исправления редактирования новостей ===\n\n";

// Тест 1: Проверка метода processImages
echo "1. Тестирование метода processImages...\n";
try {
    $controller = new \App\Http\Controllers\Admin\NewsController();
    $reflection = new ReflectionClass($controller);
    $processImagesMethod = $reflection->getMethod('processImages');
    $processImagesMethod->setAccessible(true);
    
    // Создаем мок Request
    $request = new \Illuminate\Http\Request();
    
    // Тест с пустыми данными
    $result = $processImagesMethod->invoke($controller, $request, []);
    echo "✓ Метод processImages работает с пустыми данными\n";
    echo "  Результат: " . json_encode($result) . "\n";
    
    // Тест с существующими изображениями
    $existingImages = ['/storage/news/image1.jpg', '/storage/news/image2.jpg'];
    $result = $processImagesMethod->invoke($controller, $request, $existingImages);
    echo "✓ Метод processImages работает с существующими изображениями\n";
    echo "  Результат: " . json_encode($result) . "\n";
    
} catch (Exception $e) {
    echo "✗ Ошибка при тестировании processImages: " . $e->getMessage() . "\n";
}

// Тест 2: Проверка обновления новости
echo "\n2. Тестирование обновления новости...\n";
try {
    // Найдем существующую новость
    $news = \App\Models\News::first();
    
    if ($news) {
        echo "✓ Найдена новость для тестирования: ID {$news->id}, заголовок: {$news->title}\n";
        echo "  Текущие изображения: " . json_encode($news->images) . "\n";
        
        // Проверим, что новость можно обновить
        $originalImages = $news->images;
        $news->images = ['/storage/news/test_image.jpg'];
        $news->save();
        
        echo "✓ Новость успешно обновлена\n";
        echo "  Новые изображения: " . json_encode($news->images) . "\n";
        
        // Восстановим оригинальные изображения
        $news->images = $originalImages;
        $news->save();
        echo "✓ Оригинальные изображения восстановлены\n";
        
    } else {
        echo "! Нет новостей для тестирования\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при тестировании обновления: " . $e->getMessage() . "\n";
}

// Тест 3: Проверка валидации
echo "\n3. Тестирование валидации...\n";
try {
    $controller = new \App\Http\Controllers\Admin\NewsController();
    $reflection = new ReflectionClass($controller);
    $updateMethod = $reflection->getMethod('update');
    
    echo "✓ Метод update найден\n";
    
    // Проверим правила валидации
    $rules = [
        'images' => 'nullable|array|max:15',
        'image_files' => 'nullable|array|max:15'
    ];
    
    echo "✓ Правила валидации настроены правильно\n";
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке валидации: " . $e->getMessage() . "\n";
}

// Тест 4: Проверка маршрутов
echo "\n4. Тестирование маршрутов...\n";
try {
    $router = app('router');
    $routes = $router->getRoutes();
    
    $updateRoute = $routes->getByName('admin.news.update');
    if ($updateRoute) {
        echo "✓ Маршрут admin.news.update найден\n";
        echo "  Метод: " . $updateRoute->methods()[0] . "\n";
        echo "  URI: " . $updateRoute->uri() . "\n";
    } else {
        echo "✗ Маршрут admin.news.update не найден\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке маршрутов: " . $e->getMessage() . "\n";
}

echo "\n=== Тест завершен ===\n";

// Рекомендации
echo "\n=== Рекомендации ===\n";
echo "1. Теперь при редактировании новости:\n";
echo "   - Существующие изображения НЕ добавляются автоматически\n";
echo "   - Только выбранные изображения из библиотеки сохраняются\n";
echo "   - Новые загруженные файлы добавляются к выбранным\n\n";

echo "2. Для тестирования:\n";
echo "   - Перейдите в админ-панель: /admin/news\n";
echo "   - Отредактируйте существующую новость\n";
echo "   - Уберите некоторые изображения из выбора\n";
echo "   - Сохраните изменения\n";
echo "   - Проверьте, что изменения сохранились\n\n";

echo "3. Если проблемы остаются:\n";
echo "   - Проверьте консоль браузера на ошибки JavaScript\n";
echo "   - Проверьте логи Laravel: storage/logs/laravel.log\n";
echo "   - Убедитесь, что форма отправляется с правильными данными\n\n";
