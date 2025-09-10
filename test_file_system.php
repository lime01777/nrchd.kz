<?php
// Тестируем новый метод getClinicalProtocols

$url = 'http://127.0.0.1/api/clinical-protocols?folder=' . urlencode('Клинические протоколы/Поток — клинические протоколы');
$response = file_get_contents($url);
$data = json_decode($response, true);

echo "=== Тест нового метода getClinicalProtocols ===\n";
echo "URL: $url\n";
echo "Статус ответа: " . (isset($data['error']) ? 'Ошибка' : 'Успех') . "\n";

if (isset($data['error'])) {
    echo "Ошибка: " . $data['error'] . "\n";
} else {
    echo "Найдено документов: " . (isset($data['documents']) ? count($data['documents']) : 0) . "\n";
    
    if (isset($data['documents']) && !empty($data['documents'])) {
        echo "\nПервые 3 документа:\n";
        for ($i = 0; $i < min(3, count($data['documents'])); $i++) {
            $doc = $data['documents'][$i];
            echo ($i + 1) . ". " . $doc['name'] . "\n";
            echo "   URL: " . $doc['url'] . "\n";
            echo "   Размер: " . $doc['size'] . " байт\n";
            echo "   Тип: " . $doc['type'] . "\n";
            echo "   Изменен: " . $doc['modified'] . "\n\n";
        }
    }
}

echo "\n=== Тест завершен ===\n";
?>
