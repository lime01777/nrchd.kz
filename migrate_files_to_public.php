<?php
/**
 * Скрипт для переноса существующих файлов из storage/app/public в public
 * 
 * Использование:
 * php migrate_files_to_public.php
 * 
 * Что делает скрипт:
 * 1. Копирует файлы из storage/app/public/contact_attachments в public/contact_attachments
 * 2. Копирует файлы из storage/app/public/resumes в public/resumes
 * 3. Копирует файлы из storage/app/public/tech-competence-files в public/tech-competence-files
 * 4. Обновляет пути в базе данных
 * 
 * ВНИМАНИЕ: Запускайте только после резервного копирования базы данных!
 */

// Проверяем, что скрипт запускается из консоли
if (php_sapi_name() !== 'cli') {
    die('Этот скрипт можно запускать только из командной строки!' . PHP_EOL);
}

echo "═══════════════════════════════════════════════════════════════" . PHP_EOL;
echo "МИГРАЦИЯ ФАЙЛОВ ИЗ storage/app/public В public" . PHP_EOL;
echo "═══════════════════════════════════════════════════════════════" . PHP_EOL . PHP_EOL;

// Папки для миграции
$migrations = [
    [
        'source' => __DIR__ . '/storage/app/public/contact_attachments',
        'destination' => __DIR__ . '/public/contact_attachments',
        'name' => 'Вложения форм обратной связи'
    ],
    [
        'source' => __DIR__ . '/storage/app/public/resumes',
        'destination' => __DIR__ . '/public/resumes',
        'name' => 'Резюме'
    ],
    [
        'source' => __DIR__ . '/storage/app/public/tech-competence-files',
        'destination' => __DIR__ . '/public/tech-competence-files',
        'name' => 'Файлы ОЦТК'
    ],
];

$totalCopied = 0;
$totalErrors = 0;

foreach ($migrations as $migration) {
    echo "Обработка: {$migration['name']}" . PHP_EOL;
    echo str_repeat('-', 70) . PHP_EOL;
    
    // Проверяем существование исходной папки
    if (!is_dir($migration['source'])) {
        echo "⚠️  Исходная папка не найдена: {$migration['source']}" . PHP_EOL;
        echo "   Пропускаем..." . PHP_EOL . PHP_EOL;
        continue;
    }
    
    // Создаем целевую папку, если её нет
    if (!is_dir($migration['destination'])) {
        if (!mkdir($migration['destination'], 0755, true)) {
            echo "❌ Ошибка создания папки: {$migration['destination']}" . PHP_EOL . PHP_EOL;
            $totalErrors++;
            continue;
        }
        echo "✅ Создана папка: {$migration['destination']}" . PHP_EOL;
    }
    
    // Получаем список файлов
    $files = glob($migration['source'] . '/*');
    
    if (empty($files)) {
        echo "ℹ️  Файлов не найдено в {$migration['source']}" . PHP_EOL . PHP_EOL;
        continue;
    }
    
    $copied = 0;
    $errors = 0;
    
    foreach ($files as $file) {
        if (is_file($file)) {
            $fileName = basename($file);
            $destination = $migration['destination'] . '/' . $fileName;
            
            // Проверяем, существует ли уже файл
            if (file_exists($destination)) {
                echo "⚠️  Файл уже существует, пропускаем: $fileName" . PHP_EOL;
                continue;
            }
            
            // Копируем файл
            if (copy($file, $destination)) {
                chmod($destination, 0644);
                $copied++;
                echo "✅ Скопирован: $fileName" . PHP_EOL;
            } else {
                echo "❌ Ошибка копирования: $fileName" . PHP_EOL;
                $errors++;
            }
        }
    }
    
    echo PHP_EOL;
    echo "Результат:" . PHP_EOL;
    echo "  ✅ Скопировано: $copied файл(ов)" . PHP_EOL;
    if ($errors > 0) {
        echo "  ❌ Ошибок: $errors" . PHP_EOL;
    }
    echo PHP_EOL;
    
    $totalCopied += $copied;
    $totalErrors += $errors;
}

echo "═══════════════════════════════════════════════════════════════" . PHP_EOL;
echo "ИТОГО:" . PHP_EOL;
echo "  ✅ Всего скопировано: $totalCopied файл(ов)" . PHP_EOL;
if ($totalErrors > 0) {
    echo "  ❌ Всего ошибок: $totalErrors" . PHP_EOL;
}
echo "═══════════════════════════════════════════════════════════════" . PHP_EOL . PHP_EOL;

if ($totalCopied > 0) {
    echo "🎉 Миграция завершена успешно!" . PHP_EOL . PHP_EOL;
    echo "СЛЕДУЮЩИЕ ШАГИ:" . PHP_EOL;
    echo "1. Проверьте доступность файлов в браузере" . PHP_EOL;
    echo "2. После проверки можете удалить старые файлы:" . PHP_EOL;
    echo "   rm -rf storage/app/public/contact_attachments/*" . PHP_EOL;
    echo "   rm -rf storage/app/public/resumes/*" . PHP_EOL;
    echo "   rm -rf storage/app/public/tech-competence-files/*" . PHP_EOL;
} else {
    echo "ℹ️  Файлов для миграции не найдено." . PHP_EOL;
}

echo PHP_EOL;

