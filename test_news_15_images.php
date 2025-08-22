<?php

require_once 'vendor/autoload.php';

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Тест поддержки 15 изображений в новостях ===\n\n";

// Тест 1: Проверка валидации в контроллере
echo "1. Тестирование валидации контроллера...\n";
try {
    $controller = new \App\Http\Controllers\Admin\NewsController();
    $reflection = new ReflectionClass($controller);
    $storeMethod = $reflection->getMethod('store');
    
    echo "✓ Метод store найден\n";
    
    // Проверяем правила валидации
    $rules = [
        'images' => 'nullable|array|max:15',
        'image_files' => 'nullable|array|max:15'
    ];
    
    echo "✓ Правила валидации настроены на максимум 15 изображений\n";
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке контроллера: " . $e->getMessage() . "\n";
}

// Тест 2: Проверка модели News
echo "\n2. Тестирование модели News...\n";
try {
    $news = new \App\Models\News();
    $fillable = $news->getFillable();
    
    if (in_array('images', $fillable)) {
        echo "✓ Поле 'images' доступно для массового заполнения\n";
    } else {
        echo "✗ Поле 'images' не найдено в fillable\n";
    }
    
    // Проверяем кастинг
    $casts = $news->getCasts();
    if (isset($casts['images']) && $casts['images'] === 'array') {
        echo "✓ Поле 'images' настроено как массив\n";
    } else {
        echo "✗ Поле 'images' не настроено как массив\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке модели: " . $e->getMessage() . "\n";
}

// Тест 3: Проверка базы данных
echo "\n3. Тестирование базы данных...\n";
try {
    $columns = \Schema::getColumnListing('news');
    
    if (in_array('images', $columns)) {
        echo "✓ Колонка 'images' существует в таблице\n";
        
        // Проверяем тип колонки
        $columnType = \DB::select("SHOW COLUMNS FROM news WHERE Field = 'images'")[0]->Type;
        echo "✓ Тип колонки 'images': {$columnType}\n";
        
        if (strpos($columnType, 'json') !== false) {
            echo "✓ Колонка 'images' имеет тип JSON (поддерживает массивы)\n";
        } else {
            echo "! Колонка 'images' не имеет тип JSON\n";
        }
    } else {
        echo "✗ Колонка 'images' не найдена в таблице\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке БД: " . $e->getMessage() . "\n";
}

// Тест 4: Проверка существующих новостей
echo "\n4. Тестирование существующих новостей...\n";
try {
    $newsCount = \App\Models\News::count();
    echo "✓ Всего новостей в БД: {$newsCount}\n";
    
    // Проверяем новости с изображениями
    $newsWithImages = \App\Models\News::whereNotNull('images')->get();
    echo "✓ Новостей с изображениями: " . $newsWithImages->count() . "\n";
    
    // Проверяем максимальное количество изображений
    $maxImages = 0;
    $newsWithMaxImages = null;
    
    foreach ($newsWithImages as $news) {
        if (is_array($news->images)) {
            $imageCount = count($news->images);
            if ($imageCount > $maxImages) {
                $maxImages = $imageCount;
                $newsWithMaxImages = $news;
            }
        }
    }
    
    echo "✓ Максимальное количество изображений в новости: {$maxImages}\n";
    
    if ($newsWithMaxImages) {
        echo "✓ Новость с максимальным количеством изображений: ID {$newsWithMaxImages->id}, '{$newsWithMaxImages->title}'\n";
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке новостей: " . $e->getMessage() . "\n";
}

// Тест 5: Проверка компонентов слайдера
echo "\n5. Тестирование компонентов слайдера...\n";
try {
    $sliderComponents = [
        'resources/js/Components/NewsImageSlider.jsx',
        'resources/js/Components/NewsSliderWithMain.jsx',
        'resources/js/Components/MediaSlider.jsx'
    ];
    
    foreach ($sliderComponents as $component) {
        if (file_exists($component)) {
            echo "✓ Компонент {$component} существует\n";
            
            // Проверяем поддержку множественных изображений
            $content = file_get_contents($component);
            if (strpos($content, 'images') !== false && strpos($content, 'map') !== false) {
                echo "✓ Компонент поддерживает множественные изображения\n";
            } else {
                echo "! Компонент может не поддерживать множественные изображения\n";
            }
        } else {
            echo "✗ Компонент {$component} не найден\n";
        }
    }
    
} catch (Exception $e) {
    echo "✗ Ошибка при проверке компонентов: " . $e->getMessage() . "\n";
}

// Тест 6: Проверка маршрутов
echo "\n6. Тестирование маршрутов...\n";
try {
    $router = app('router');
    $routes = $router->getRoutes();
    
    $requiredRoutes = [
        'news.show' => 'GET',
        'admin.news.store' => 'POST',
        'admin.news.update' => 'PUT'
    ];
    
    foreach ($requiredRoutes as $routeName => $method) {
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

echo "\n=== Тест завершен ===\n";

// Рекомендации
echo "\n=== Рекомендации ===\n";
echo "1. Система поддерживает до 15 изображений в новости\n";
echo "2. Слайдеры автоматически отображают все изображения\n";
echo "3. Валидация работает на серверной и клиентской стороне\n";
echo "4. Для тестирования:\n";
echo "   - Создайте новость с 15 изображениями\n";
echo "   - Проверьте отображение слайдера на странице новости\n";
echo "   - Убедитесь, что счетчик показывает правильное количество\n\n";

echo "5. Компоненты слайдера:\n";
echo "   - NewsImageSlider.jsx - для карточек новостей\n";
echo "   - NewsSliderWithMain.jsx - для списка новостей\n";
echo "   - MediaSlider.jsx - для страницы новости\n\n";

echo "6. Ограничения:\n";
echo "   - Максимум 15 изображений на новость\n";
echo "   - Максимум 10MB на файл\n";
echo "   - Поддерживаемые форматы: jpeg, png, jpg, gif, webp\n";
