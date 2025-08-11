<?php
/**
 * Простой скрипт для обновления путей к изображениям в базе данных
 * Заменяет /storage/news/ на /img/news/
 */

// Параметры подключения к базе данных
$host = 'localhost';
$dbname = 'nncrz';
$username = 'root';
$password = '';

try {
    // Подключаемся к базе данных
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Подключение к базе данных успешно\n";
    
    // Обновляем пути к изображениям в таблице news
    $stmt = $pdo->query("SELECT id, images, main_image FROM news WHERE images IS NOT NULL OR main_image IS NOT NULL");
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $updatedCount = 0;
    $mainImageUpdatedCount = 0;
    
    foreach ($news as $item) {
        $hasChanges = false;
        $updatedImages = null;
        $updatedMainImage = null;
        
        // Обновляем images
        if ($item['images']) {
            $images = json_decode($item['images'], true);
            if (is_array($images)) {
                $updatedImagesArray = [];
                foreach ($images as $image) {
                    if (is_string($image)) {
                        $updatedImage = str_replace('/storage/news/', '/img/news/', $image);
                        if ($updatedImage !== $image) {
                            $hasChanges = true;
                        }
                        $updatedImagesArray[] = $updatedImage;
                    } else {
                        $updatedImagesArray[] = $image;
                    }
                }
                $updatedImages = json_encode($updatedImagesArray);
            }
        }
        
        // Обновляем main_image
        if ($item['main_image'] && is_string($item['main_image'])) {
            $updatedMainImage = str_replace('/storage/news/', '/img/news/', $item['main_image']);
            if ($updatedMainImage !== $item['main_image']) {
                $hasChanges = true;
            }
        }
        
        if ($hasChanges) {
            $sql = "UPDATE news SET ";
            $params = [];
            
            if ($updatedImages !== null) {
                $sql .= "images = ?";
                $params[] = $updatedImages;
                $updatedCount++;
            }
            
            if ($updatedMainImage !== null) {
                if ($updatedImages !== null) {
                    $sql .= ", ";
                }
                $sql .= "main_image = ?";
                $params[] = $updatedMainImage;
                $mainImageUpdatedCount++;
            }
            
            $sql .= " WHERE id = ?";
            $params[] = $item['id'];
            
            $updateStmt = $pdo->prepare($sql);
            $updateStmt->execute($params);
            
            echo "Обновлена новость ID: {$item['id']}\n";
        }
    }
    
    echo "\n✅ Обновление завершено!\n";
    echo "Обновлено новостей с изображениями: {$updatedCount}\n";
    echo "Обновлено новостей с main_image: {$mainImageUpdatedCount}\n";
    
} catch (PDOException $e) {
    echo "❌ Ошибка при работе с базой данных: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ Ошибка: " . $e->getMessage() . "\n";
}
?>
