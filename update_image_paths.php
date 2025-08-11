<?php
/**
 * Скрипт для обновления путей к изображениям в базе данных
 * Заменяет /storage/news/ на /img/news/
 */

require_once 'vendor/autoload.php';

// Загружаем Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Начинаем обновление путей к изображениям...\n";

try {
    // Обновляем пути к изображениям в таблице news
    $news = DB::table('news')->whereNotNull('images')->get();
    $updatedCount = 0;
    
    foreach ($news as $item) {
        if ($item->images) {
            $images = json_decode($item->images, true);
            $updatedImages = [];
            $hasChanges = false;
            
            if (is_array($images)) {
                foreach ($images as $image) {
                    if (is_string($image)) {
                        // Заменяем старые пути /storage/news/ на новые /img/news/
                        $updatedImage = str_replace('/storage/news/', '/img/news/', $image);
                        if ($updatedImage !== $image) {
                            $hasChanges = true;
                        }
                        $updatedImages[] = $updatedImage;
                    } else {
                        $updatedImages[] = $image;
                    }
                }
            }
            
            if ($hasChanges) {
                // Обновляем запись в базе данных
                DB::table('news')
                    ->where('id', $item->id)
                    ->update(['images' => json_encode($updatedImages)]);
                
                $updatedCount++;
                echo "Обновлена новость ID: {$item->id}\n";
            }
        }
    }
    
    // Также обновляем main_image если есть
    $newsWithMainImage = DB::table('news')->whereNotNull('main_image')->get();
    $mainImageUpdatedCount = 0;
    
    foreach ($newsWithMainImage as $item) {
        if ($item->main_image && is_string($item->main_image)) {
            $updatedMainImage = str_replace('/storage/news/', '/img/news/', $item->main_image);
            
            if ($updatedMainImage !== $item->main_image) {
                DB::table('news')
                    ->where('id', $item->id)
                    ->update(['main_image' => $updatedMainImage]);
                
                $mainImageUpdatedCount++;
                echo "Обновлен main_image для новости ID: {$item->id}\n";
            }
        }
    }
    
    echo "\n✅ Обновление завершено!\n";
    echo "Обновлено новостей с изображениями: {$updatedCount}\n";
    echo "Обновлено новостей с main_image: {$mainImageUpdatedCount}\n";
    
} catch (Exception $e) {
    echo "❌ Ошибка при обновлении: " . $e->getMessage() . "\n";
}
?>
