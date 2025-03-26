<?php
// Скрипт для загрузки тестовых изображений для новостей

// Директория для сохранения изображений
$dir = __DIR__ . '/public/storage/images/news';

// Проверяем, существует ли директория, если нет - создаем
if (!is_dir($dir)) {
    if (!mkdir($dir, 0755, true)) {
        die("Не удалось создать директорию $dir");
    }
}

// Массив URL для тестовых изображений (placeholders)
$imageUrls = [
    'https://via.placeholder.com/800x500/3498db/ffffff?text=Новость+1',
    'https://via.placeholder.com/800x500/2ecc71/ffffff?text=Новость+2',
    'https://via.placeholder.com/800x500/e74c3c/ffffff?text=Новость+3',
    'https://via.placeholder.com/800x500/f39c12/ffffff?text=Новость+4',
    'https://via.placeholder.com/800x500/9b59b6/ffffff?text=Новость+5',
];

// Загрузка и сохранение изображений
foreach ($imageUrls as $index => $url) {
    $imageData = @file_get_contents($url);
    
    if ($imageData === false) {
        echo "Ошибка при загрузке изображения $url\n";
        continue;
    }
    
    $fileName = $dir . '/news' . ($index + 1) . '.jpg';
    
    if (file_put_contents($fileName, $imageData) === false) {
        echo "Ошибка при сохранении изображения $fileName\n";
    } else {
        echo "Изображение успешно сохранено: $fileName\n";
    }
}

echo "Загрузка изображений завершена!";
?>
