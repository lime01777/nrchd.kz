<?php

require_once 'vendor/autoload.php';

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

// Тестовый скрипт для проверки подключения к Яндекс.Метрике
echo "Тестирование подключения к Яндекс.Метрике\n";
echo "==========================================\n\n";

$token = env('YANDEX_METRIKA_TOKEN');
$counter = env('YANDEX_METRIKA_COUNTER');

if (!$token || !$counter) {
    echo "❌ Ошибка: Не настроены переменные окружения\n";
    echo "Добавьте в .env файл:\n";
    echo "YANDEX_METRIKA_TOKEN=ваш_токен\n";
    echo "YANDEX_METRIKA_COUNTER=ваш_id_счетчика\n\n";
    echo "Подробные инструкции в файле METRIKA_SETUP.md\n";
    exit(1);
}

echo "✅ Токен и ID счетчика настроены\n";
echo "Токен: " . substr($token, 0, 10) . "...\n";
echo "Счетчик: $counter\n\n";

try {
    $client = new Client(['timeout' => 10]);
    $today = date('Y-m-d');
    
    echo "📊 Получение данных за сегодня ($today)...\n";
    
    $response = $client->get('https://api-metrika.yandex.net/stat/v1/data', [
        'headers' => [
            'Authorization' => 'OAuth ' . $token,
        ],
        'query' => [
            'ids' => $counter,
            'metrics' => 'ym:s:visitors,ym:s:pageviews,ym:s:avgSessionDuration',
            'date1' => $today,
            'date2' => $today,
        ],
    ]);
    
    $data = json_decode($response->getBody(), true);
    
    if (isset($data['data'][0]['metrics'])) {
        $metrics = $data['data'][0]['metrics'];
        echo "✅ Данные получены успешно!\n\n";
        echo "📈 Статистика за сегодня:\n";
        echo "- Посетителей: " . ($metrics[0] ?? 'N/A') . "\n";
        echo "- Просмотров: " . ($metrics[1] ?? 'N/A') . "\n";
        echo "- Средняя сессия: " . ($metrics[2] ?? 'N/A') . " сек\n";
    } else {
        echo "❌ Ошибка: Неверный формат ответа\n";
        echo "Ответ: " . json_encode($data, JSON_PRETTY_PRINT) . "\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Ошибка подключения: " . $e->getMessage() . "\n";
    echo "\nВозможные причины:\n";
    echo "1. Неверный токен\n";
    echo "2. Неверный ID счетчика\n";
    echo "3. Нет прав доступа к счетчику\n";
    echo "4. Проблемы с сетью\n";
}

echo "\n✨ Тест завершен\n"; 