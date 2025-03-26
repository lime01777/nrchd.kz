<?php
// Скрипт для создания тестовых изображений для новостей с помощью GD

// Директория для сохранения изображений
$dir = __DIR__ . '/public/storage/images/news';

// Проверяем, существует ли директория, если нет - создаем
if (!is_dir($dir)) {
    if (!mkdir($dir, 0755, true)) {
        die("Не удалось создать директорию $dir");
    }
}

// Цвета фона для изображений (в RGB)
$colors = [
    [52, 152, 219],  // Синий
    [46, 204, 113],  // Зеленый
    [231, 76, 60],   // Красный
    [243, 156, 18],  // Оранжевый
    [155, 89, 182]   // Фиолетовый
];

// Создание и сохранение изображений
for ($i = 0; $i < 5; $i++) {
    // Создаем новое изображение
    $image = imagecreatetruecolor(800, 500);
    
    // Цвет фона
    $bgcolor = imagecolorallocate($image, $colors[$i][0], $colors[$i][1], $colors[$i][2]);
    
    // Заливаем фон
    imagefill($image, 0, 0, $bgcolor);
    
    // Цвет текста
    $textcolor = imagecolorallocate($image, 255, 255, 255);
    
    // Текст надписи
    $text = "Новость " . ($i + 1);
    
    // Получаем размеры текста
    $font = 5;  // размер шрифта
    $textWidth = imagefontwidth($font) * strlen($text);
    $textHeight = imagefontheight($font);
    
    // Позиция текста (по центру)
    $x = (800 - $textWidth) / 2;
    $y = (500 - $textHeight) / 2;
    
    // Добавляем текст на изображение
    imagestring($image, $font, $x, $y, $text, $textcolor);
    
    // Имя файла
    $fileName = $dir . '/news' . ($i + 1) . '.jpg';
    
    // Сохраняем изображение
    if (imagejpeg($image, $fileName, 90)) {
        echo "Изображение успешно создано: $fileName\n";
    } else {
        echo "Ошибка при сохранении изображения $fileName\n";
    }
    
    // Освобождаем память
    imagedestroy($image);
}

echo "Создание изображений завершено!";
?>
