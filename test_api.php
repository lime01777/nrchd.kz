<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Http\Controllers\NewsController;
use Illuminate\Http\Request;

echo "Тестируем API напрямую:\n";
echo "=======================\n";

// Создаем mock request
$request = new Request();
$request->merge(['limit' => 10]);

// Создаем контроллер и вызываем метод
$controller = new NewsController();
$response = $controller->getLatestNews($request);

echo "Response Content:\n";
echo $response->getContent() . "\n";

echo "Response Status:\n";
echo $response->getStatusCode() . "\n";
