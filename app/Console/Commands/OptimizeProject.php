<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class OptimizeProject extends Command
{
    protected $signature = 'project:optimize';
    protected $description = 'Оптимизирует проект для production';

    public function handle()
    {
        $this->info('⚡ Оптимизация проекта...');
        
        // Очистка кэша
        $this->info('🧹 Очистка кэша...');
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        
        // Создание символической ссылки storage
        $this->info('🔗 Создание символической ссылки storage...');
        if (!is_link(public_path('storage'))) {
            Artisan::call('storage:link');
        }
        
        // Оптимизация для production
        if (config('app.env') === 'production') {
            $this->info('🏭 Production оптимизация...');
            
            // Кэширование конфигурации
            Artisan::call('config:cache');
            
            // Кэширование маршрутов
            Artisan::call('route:cache');
            
            // Кэширование представлений
            Artisan::call('view:cache');
            
            // Оптимизация автозагрузчика
            $this->info('📦 Оптимизация автозагрузчика...');
            exec('composer install --optimize-autoloader --no-dev');
        } else {
            // Development оптимизация
            $this->info('🔧 Development оптимизация...');
            
            // Обнаружение пакетов
            Artisan::call('package:discover');
            
            // Очистка старых файлов
            $this->cleanOldFiles();
        }
        
        // Проверка и создание необходимых директорий
        $this->createDirectories();
        
        // Оптимизация базы данных
        $this->optimizeDatabase();
        
        $this->info('✅ Оптимизация завершена!');
        
        return 0;
    }
    
    private function cleanOldFiles()
    {
        $this->info('🗑️ Очистка старых файлов...');
        
        // Очистка логов
        $logFiles = File::glob(storage_path('logs/*.log'));
        foreach ($logFiles as $logFile) {
            if (File::size($logFile) > 10 * 1024 * 1024) { // 10MB
                File::put($logFile, '');
                $this->info("Очищен лог файл: " . basename($logFile));
            }
        }
        
        // Очистка временных файлов
        $tempFiles = File::glob(storage_path('app/temp/*'));
        foreach ($tempFiles as $tempFile) {
            if (File::isFile($tempFile) && (time() - File::lastModified($tempFile)) > 86400) { // 24 часа
                File::delete($tempFile);
            }
        }
    }
    
    private function createDirectories()
    {
        $this->info('📁 Создание необходимых директорий...');
        
        $directories = [
            storage_path('app/public'),
            storage_path('app/temp'),
            storage_path('framework/cache'),
            storage_path('framework/sessions'),
            storage_path('framework/views'),
            storage_path('logs'),
            public_path('storage'),
        ];
        
        foreach ($directories as $directory) {
            if (!File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
                $this->info("Создана директория: {$directory}");
            }
        }
    }
    
    private function optimizeDatabase()
    {
        $this->info('🗄️ Оптимизация базы данных...');
        
        try {
            // Проверка подключения
            DB::connection()->getPdo();
            
            // Оптимизация таблиц
            $tables = DB::select('SHOW TABLES');
            foreach ($tables as $table) {
                $tableName = array_values((array) $table)[0];
                DB::statement("OPTIMIZE TABLE {$tableName}");
            }
            
            $this->info('✅ Таблицы оптимизированы');
            
        } catch (\Exception $e) {
            $this->warn("⚠️ Не удалось оптимизировать базу данных: " . $e->getMessage());
        }
    }
}
