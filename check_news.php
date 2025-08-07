<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\News;

echo "Проверяем новости в базе данных:\n";
echo "================================\n";

$news = News::all();

if ($news->count() === 0) {
    echo "Новостей в базе данных нет!\n";
} else {
    foreach ($news as $item) {
        echo "ID: {$item->id}\n";
        echo "Title: {$item->title}\n";
        echo "Images: " . json_encode($item->images) . "\n";
        echo "Main Image: {$item->main_image}\n";
        echo "Image: {$item->image}\n";
        echo "Status: {$item->status}\n";
        echo "Publish Date: {$item->publish_date}\n";
        echo "--------------------------------\n";
    }
}

echo "\nПроверяем API endpoint:\n";
echo "=======================\n";

$response = file_get_contents('http://127.0.0.1:8000/api/latest-news');
if ($response) {
    $data = json_decode($response, true);
    echo "API Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo "Ошибка получения данных из API\n";
}
