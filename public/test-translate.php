<?php
/**
 * Простой скрипт для тестирования работы Google Translate API
 */

// Включаем отображение всех ошибок
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Функция для загрузки переменных окружения из .env файла
function loadEnv() {
    $envFile = __DIR__ . '/../.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }
        return true;
    }
    return false;
}

// Загружаем .env файл
if (!loadEnv()) {
    die('.env файл не найден');
}

// Получаем ключ API из .env
$apiKey = getenv('GOOGLE_TRANSLATE_API_KEY');

if (!$apiKey) {
    die('API ключ Google Translate не найден в .env файле');
}

echo "<pre>";
echo "API ключ найден: " . substr($apiKey, 0, 3) . '...' . substr($apiKey, -3) . "\n\n";

// Проверяем, установлен ли composer
if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
    die('Composer autoload не найден. Установите зависимости с помощью команды "composer install"');
}

// Подключаем autoload
require __DIR__ . '/../vendor/autoload.php';

// Пробуем использовать библиотеку напрямую
try {
    // Проверяем, установлена ли библиотека Google Translate
    if (!class_exists('Stichoza\GoogleTranslate\GoogleTranslate')) {
        die('Класс GoogleTranslate не найден. Установите библиотеку с помощью команды "composer require stichoza/google-translate-php"');
    }

    // Создаем экземпляр переводчика с правильным форматом опций
    $options = ['key' => $apiKey];
    echo "Использую опции: " . json_encode($options) . "\n";
    $translator = new \Stichoza\GoogleTranslate\GoogleTranslate('ru', 'en', $options);
    
    echo "Translator создан успешно\n";
    
    // Пробуем перевести тестовый текст
    $text = "Привет, это тестовый перевод!";
    $translated = $translator->translate($text);
    
    echo "Оригинальный текст: $text\n";
    echo "Перевод: $translated\n";
    
    if ($translated) {
        echo "\nРЕЗУЛЬТАТ: API РАБОТАЕТ!\n";
    } else {
        echo "\nРЕЗУЛЬТАТ: Перевод не удался. Проверьте логи для получения подробной информации.\n";
    }
    
} catch (Exception $e) {
    echo "ОШИБКА: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

echo "</pre>";
