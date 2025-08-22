<?php

require_once 'vendor/autoload.php';

// Инициализация Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Проверка настроек хостинга для загрузки изображений ===\n\n";

// Проверка 1: Права доступа к storage
echo "1. Проверка прав доступа к storage:\n";
$storagePath = storage_path('app/public/news');
if (file_exists($storagePath)) {
    echo "✓ Директория существует: {$storagePath}\n";
    
    if (is_writable($storagePath)) {
        echo "✓ Директория доступна для записи\n";
    } else {
        echo "✗ Директория НЕ доступна для записи\n";
        echo "  Рекомендация: chmod 755 {$storagePath}\n";
    }
} else {
    echo "✗ Директория не существует: {$storagePath}\n";
    echo "  Рекомендация: mkdir -p {$storagePath} && chmod 755 {$storagePath}\n";
}

// Проверка 2: Символическая ссылка
echo "\n2. Проверка символической ссылки storage:\n";
$publicStoragePath = public_path('storage');
if (file_exists($publicStoragePath)) {
    echo "✓ Символическая ссылка существует: {$publicStoragePath}\n";
    
    if (is_link($publicStoragePath)) {
        echo "✓ Это символическая ссылка\n";
        $target = readlink($publicStoragePath);
        echo "  Цель: {$target}\n";
    } else {
        echo "! Это не символическая ссылка\n";
    }
} else {
    echo "✗ Символическая ссылка не существует\n";
    echo "  Рекомендация: php artisan storage:link\n";
}

// Проверка 3: Настройки PHP
echo "\n3. Проверка настроек PHP:\n";
$settings = [
    'upload_max_filesize' => ini_get('upload_max_filesize'),
    'post_max_size' => ini_get('post_max_size'),
    'max_file_uploads' => ini_get('max_file_uploads'),
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time'),
];

foreach ($settings as $setting => $value) {
    echo "  {$setting}: {$value}\n";
}

// Проверка 4: Тест записи файла
echo "\n4. Тест записи файла:\n";
$testFile = $storagePath . '/test_' . time() . '.txt';
try {
    if (file_put_contents($testFile, 'test') !== false) {
        echo "✓ Тестовый файл создан: " . basename($testFile) . "\n";
        unlink($testFile);
        echo "✓ Тестовый файл удален\n";
    } else {
        echo "✗ Не удалось создать тестовый файл\n";
    }
} catch (Exception $e) {
    echo "✗ Ошибка при создании тестового файла: " . $e->getMessage() . "\n";
}

// Проверка 5: Настройки Laravel
echo "\n5. Проверка настроек Laravel:\n";
$config = config('filesystems.disks.public');
echo "  Driver: " . ($config['driver'] ?? 'не настроен') . "\n";
echo "  Root: " . ($config['root'] ?? 'не настроен') . "\n";
echo "  URL: " . ($config['url'] ?? 'не настроен') . "\n";

// Проверка 6: Существующие файлы
echo "\n6. Проверка существующих файлов:\n";
if (file_exists($storagePath)) {
    $files = scandir($storagePath);
    $imageFiles = array_filter($files, function($file) {
        return in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif', 'webp']);
    });
    
    echo "  Всего файлов: " . count($files) . "\n";
    echo "  Изображений: " . count($imageFiles) . "\n";
    
    if (count($imageFiles) > 0) {
        echo "  Примеры файлов:\n";
        $examples = array_slice($imageFiles, 0, 5);
        foreach ($examples as $file) {
            $filePath = $storagePath . '/' . $file;
            $size = file_exists($filePath) ? filesize($filePath) : 0;
            echo "    - {$file} (" . number_format($size) . " байт)\n";
        }
    }
}

echo "\n=== Проверка завершена ===\n";

// Рекомендации
echo "\n=== Рекомендации ===\n";
echo "1. Если есть проблемы с правами доступа:\n";
echo "   chmod -R 755 storage/\n";
echo "   chmod -R 755 public/storage/\n\n";

echo "2. Если символическая ссылка не работает:\n";
echo "   php artisan storage:link\n\n";

echo "3. Если файлы не загружаются:\n";
echo "   - Проверьте настройки PHP (upload_max_filesize, post_max_size)\n";
echo "   - Увеличьте лимиты в php.ini\n";
echo "   - Проверьте логи ошибок сервера\n\n";

echo "4. Для отладки загрузки:\n";
echo "   - Проверьте логи Laravel: storage/logs/laravel.log\n";
echo "   - Проверьте логи веб-сервера (Apache/Nginx)\n";
