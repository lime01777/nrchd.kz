<?php
// Загружаем автозагрузчик и приложение Laravel
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Получение параметров базы данных из конфигурации Laravel
$database = config('database.connections.mysql.database');
$username = config('database.connections.mysql.username');
$password = config('database.connections.mysql.password');
$host = config('database.connections.mysql.host');

// Путь для сохранения дампа
$backupPath = __DIR__ . '/database_backup_' . date('Y-m-d_H-i-s') . '.sql';

// Логирование процесса
$log = fopen(__DIR__ . '/storage/logs/windsurf.log', 'a');
fwrite($log, date('Y-m-d H:i:s') . " - Начинаем экспорт базы данных\n");
fwrite($log, "База данных: $database\n");

// Путь к mysqldump в XAMPP
$mysqldumpPath = 'C:\xampp\mysql\bin\mysqldump.exe';

// Проверяем существование mysqldump
if (!file_exists($mysqldumpPath)) {
    echo "Не найден mysqldump по пути: {$mysqldumpPath}\n";
    echo "Проверьте путь установки XAMPP и расположение mysqldump.\n";
    fwrite($log, "Ошибка: mysqldump не найден по пути {$mysqldumpPath}\n");
    exit(1);
}

// Команда для экспорта MySQL
$command = "\"{$mysqldumpPath}\" --opt -h {$host} -u {$username} " . 
    ($password ? "-p\"{$password}\" " : "") . 
    "{$database} > \"{$backupPath}\"";

echo "Выполняем экспорт базы данных в файл: {$backupPath}\n";

// Исполнение команды
exec($command, $output, $return_var);

// Проверка результата
if ($return_var === 0) {
    echo "Экспорт базы данных успешно завершен!\n";
    fwrite($log, "Экспорт базы данных успешно завершен в файл: {$backupPath}\n");
    
    // Сжимаем файл с помощью gzip для уменьшения размера
    echo "Сжимаем файл базы данных...\n";
    system("gzip -9 {$backupPath}");
    
    if (file_exists($backupPathGz)) {
        echo "Файл сжат и доступен по пути: {$backupPathGz}\n";
        fwrite($log, "Файл сжат и доступен по пути: {$backupPathGz}\n");
    } else {
        echo "Сжатие не удалось. Несжатый файл доступен по пути: {$backupPath}\n";
        fwrite($log, "Сжатие не удалось. Несжатый файл доступен по пути: {$backupPath}\n");
    }
} else {
    echo "Ошибка при экспорте базы данных. Код ошибки: {$return_var}\n";
    fwrite($log, "Ошибка при экспорте базы данных. Код ошибки: {$return_var}\n");
}

fclose($log);
?>
