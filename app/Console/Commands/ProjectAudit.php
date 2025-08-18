<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Artisan;
use App\Services\TranslationService;

class ProjectAudit extends Command
{
    protected $signature = 'project:audit {--fix : Автоматически исправить найденные проблемы}';
    protected $description = 'Комплексная проверка проекта на ошибки и предложения по улучшению';

    private $issues = [];
    private $suggestions = [];
    private $fixes = [];

    public function handle()
    {
        $this->info('🔍 Начинаю комплексную проверку проекта...');
        
        // Проверка конфигурации
        $this->checkConfiguration();
        
        // Проверка маршрутов
        $this->checkRoutes();
        
        // Проверка базы данных
        $this->checkDatabase();
        
        // Проверка переводов
        $this->checkTranslations();
        
        // Проверка компонентов React
        $this->checkReactComponents();
        
        // Проверка файловой системы
        $this->checkFileSystem();
        
        // Проверка безопасности
        $this->checkSecurity();
        
        // Проверка производительности
        $this->checkPerformance();
        
        // Вывод результатов
        $this->displayResults();
        
        // Применение исправлений
        if ($this->option('fix')) {
            $this->applyFixes();
        }
        
        return 0;
    }

    private function checkConfiguration()
    {
        $this->info('📋 Проверка конфигурации...');
        
        // Проверка APP_KEY
        if (empty(config('app.key'))) {
            $this->issues[] = '❌ APP_KEY не установлен в .env файле';
            $this->fixes[] = 'php artisan key:generate';
        }
        
        // Проверка APP_DEBUG
        if (config('app.debug') && config('app.env') === 'production') {
            $this->issues[] = '⚠️ APP_DEBUG включен в production режиме';
            $this->suggestions[] = 'Отключить APP_DEBUG в production';
        }
        
        // Проверка локали
        if (config('app.locale') !== 'kz') {
            $this->issues[] = '❌ Основная локаль не установлена как kz';
        }
        
        // Проверка timezone
        if (config('app.timezone') !== 'Asia/Almaty') {
            $this->suggestions[] = 'Установить timezone как Asia/Almaty для Казахстана';
        }
    }

    private function checkRoutes()
    {
        $this->info('🛣️ Проверка маршрутов...');
        
        $routes = Route::getRoutes();
        $localizedRoutes = 0;
        $nonLocalizedRoutes = 0;
        
        foreach ($routes as $route) {
            $uri = $route->uri();
            if (str_contains($uri, '{locale}')) {
                $localizedRoutes++;
            } else {
                // Исключаем API и админ маршруты
                if (!str_starts_with($uri, 'api/') && !str_starts_with($uri, 'admin/') && 
                    !str_starts_with($uri, 'sanctum/') && !str_starts_with($uri, 'translations/')) {
                    $nonLocalizedRoutes++;
                }
            }
        }
        
        if ($nonLocalizedRoutes > 0) {
            $this->issues[] = "⚠️ Найдено {$nonLocalizedRoutes} публичных маршрутов без локализации";
        }
        
        $this->info("✅ Локализованных маршрутов: {$localizedRoutes}");
        $this->info("⚠️ Нелокализованных маршрутов: {$nonLocalizedRoutes}");
    }

    private function checkDatabase()
    {
        $this->info('🗄️ Проверка базы данных...');
        
        try {
            // Проверка подключения
            DB::connection()->getPdo();
            
            // Проверка таблицы переводов
            if (!Schema::hasTable('stored_translations')) {
                $this->issues[] = '❌ Таблица stored_translations не существует';
                $this->fixes[] = 'php artisan migrate';
            } else {
                $count = DB::table('stored_translations')->count();
                $this->info("✅ Переводов в базе: {$count}");
            }
            
            // Проверка других важных таблиц
            $requiredTables = ['users', 'news', 'documents', 'vacancies'];
            foreach ($requiredTables as $table) {
                if (!Schema::hasTable($table)) {
                    $this->issues[] = "❌ Таблица {$table} не существует";
                }
            }
            
        } catch (\Exception $e) {
            $this->issues[] = '❌ Ошибка подключения к базе данных: ' . $e->getMessage();
        }
    }

    private function checkTranslations()
    {
        $this->info('🌐 Проверка системы переводов...');
        
        $languages = ['kz', 'ru', 'en'];
        $pages = ['home', 'news', 'about', 'contacts', 'services'];
        
        foreach ($languages as $lang) {
            foreach ($pages as $page) {
                try {
                    $translations = TranslationService::getForPage($page, $lang);
                    if (empty($translations)) {
                        $this->issues[] = "⚠️ Нет переводов для страницы {$page} на языке {$lang}";
                    }
                } catch (\Exception $e) {
                    $this->issues[] = "❌ Ошибка загрузки переводов для {$page}/{$lang}: " . $e->getMessage();
                }
            }
        }
        
        // Проверка языковых файлов
        $langFiles = ['kz/common.php', 'ru/common.php', 'en/common.php'];
        foreach ($langFiles as $file) {
            $path = resource_path("lang/{$file}");
            if (!File::exists($path)) {
                $this->issues[] = "❌ Языковой файл не найден: {$file}";
            }
        }
    }

    private function checkReactComponents()
    {
        $this->info('⚛️ Проверка React компонентов...');
        
        $jsxFiles = File::glob(resource_path('js/**/*.jsx'));
        $issues = 0;
        
        foreach ($jsxFiles as $file) {
            $content = File::get($file);
            
            // Проверка на использование t() функции
            if (str_contains($content, 't(') && !str_contains($content, 'const t = ')) {
                $this->issues[] = "⚠️ Компонент {$file} использует t() без определения функции";
            }
            
            // Проверка на usePage импорт
            if (str_contains($content, 'usePage()') && !str_contains($content, 'import.*usePage')) {
                $this->issues[] = "⚠️ Компонент {$file} использует usePage без импорта";
            }
            
            // Проверка на route() вызовы без locale
            if (preg_match('/route\([\'"][^\'"]+[\'"]\)/', $content) && 
                !str_contains($content, 'route(') && str_contains($content, '{ locale }')) {
                $this->issues[] = "⚠️ Компонент {$file} использует route() без locale параметра";
            }
        }
        
        $this->info("✅ Проверено компонентов: " . count($jsxFiles));
    }

    private function checkFileSystem()
    {
        $this->info('📁 Проверка файловой системы...');
        
        // Проверка прав доступа
        $writableDirs = ['storage', 'bootstrap/cache', 'public/storage'];
        foreach ($writableDirs as $dir) {
            if (!is_writable($dir)) {
                $this->issues[] = "❌ Директория {$dir} недоступна для записи";
                $this->fixes[] = "chmod -R 775 {$dir}";
            }
        }
        
        // Проверка символических ссылок
        if (!is_link(public_path('storage'))) {
            $this->issues[] = '❌ Символическая ссылка storage не создана';
            $this->fixes[] = 'php artisan storage:link';
        }
        
        // Проверка размера логов
        $logFile = storage_path('logs/laravel.log');
        if (File::exists($logFile) && File::size($logFile) > 50 * 1024 * 1024) { // 50MB
            $this->suggestions[] = 'Лог файл превышает 50MB, рекомендуется очистить';
        }
    }

    private function checkSecurity()
    {
        $this->info('🔒 Проверка безопасности...');
        
        // Проверка .env файла
        if (File::exists('.env') && !File::exists('.env.example')) {
            $this->suggestions[] = 'Создать .env.example файл для безопасности';
        }
        
        // Проверка composer.lock
        if (!File::exists('composer.lock')) {
            $this->issues[] = '❌ composer.lock отсутствует';
        }
        
        // Проверка package-lock.json
        if (!File::exists('package-lock.json')) {
            $this->issues[] = '❌ package-lock.json отсутствует';
        }
        
        // Проверка node_modules
        if (!File::exists('node_modules')) {
            $this->issues[] = '❌ node_modules отсутствует';
            $this->fixes[] = 'npm install';
        }
    }

    private function checkPerformance()
    {
        $this->info('⚡ Проверка производительности...');
        
        // Проверка кэша
        if (!File::exists(base_path('bootstrap/cache/packages.php'))) {
            $this->suggestions[] = 'Рекомендуется создать кэш пакетов: php artisan package:discover';
        }
        
        if (!File::exists(base_path('bootstrap/cache/services.php'))) {
            $this->suggestions[] = 'Рекомендуется создать кэш сервисов: php artisan config:cache';
        }
        
        // Проверка оптимизации
        if (config('app.env') === 'production') {
            $this->suggestions[] = 'В production режиме рекомендуется: php artisan optimize';
        }
        
        // Проверка размера node_modules
        if (File::exists('node_modules')) {
            $size = $this->getDirectorySize('node_modules');
            if ($size > 500 * 1024 * 1024) { // 500MB
                $this->suggestions[] = 'node_modules превышает 500MB, рекомендуется проверить зависимости';
            }
        }
    }

    private function getDirectorySize($path)
    {
        $size = 0;
        foreach (File::allFiles($path) as $file) {
            $size += $file->getSize();
        }
        return $size;
    }

    private function displayResults()
    {
        $this->newLine();
        $this->info('📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ:');
        $this->newLine();
        
        if (empty($this->issues) && empty($this->suggestions)) {
            $this->info('✅ Проект в отличном состоянии! Проблем не найдено.');
            return;
        }
        
        if (!empty($this->issues)) {
            $this->error('🚨 НАЙДЕННЫЕ ПРОБЛЕМЫ:');
            foreach ($this->issues as $issue) {
                $this->line($issue);
            }
            $this->newLine();
        }
        
        if (!empty($this->suggestions)) {
            $this->warn('💡 ПРЕДЛОЖЕНИЯ ПО УЛУЧШЕНИЮ:');
            foreach ($this->suggestions as $suggestion) {
                $this->line($suggestion);
            }
            $this->newLine();
        }
        
        if (!empty($this->fixes)) {
            $this->info('🔧 КОМАНДЫ ДЛЯ ИСПРАВЛЕНИЯ:');
            foreach ($this->fixes as $fix) {
                $this->line($fix);
            }
            $this->newLine();
        }
    }

    private function applyFixes()
    {
        $this->info('🔧 Применение автоматических исправлений...');
        
        foreach ($this->fixes as $fix) {
            $this->info("Выполняю: {$fix}");
            try {
                if (str_starts_with($fix, 'php artisan')) {
                    Artisan::call(explode(' ', $fix)[2]);
                } elseif (str_starts_with($fix, 'npm')) {
                    exec($fix);
                } elseif (str_starts_with($fix, 'chmod')) {
                    // Пропускаем chmod для Windows
                    $this->warn("Пропускаю chmod команду (Windows)");
                }
            } catch (\Exception $e) {
                $this->error("Ошибка при выполнении {$fix}: " . $e->getMessage());
            }
        }
        
        $this->info('✅ Автоматические исправления применены');
    }
}
