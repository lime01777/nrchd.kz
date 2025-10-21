<?php

namespace App\Console\Commands;

use App\Services\Translator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class I18nExportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'i18n:export 
                            {--scope= : Scope для экспорта (обязательный)}
                            {--locale= : Язык для экспорта (ru, kk, en)}
                            {--output= : Путь для сохранения файла}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Экспортировать словарь переводов в JSON';

    /**
     * Execute the console command.
     */
    public function handle(Translator $translator)
    {
        $scope = $this->option('scope');
        $locale = $this->option('locale') ?? 'ru';
        $output = $this->option('output');

        if (!$scope) {
            $this->error('❌ Необходимо указать --scope=название');
            return 1;
        }

        if (!in_array($locale, ['ru', 'kk', 'en'])) {
            $this->error('❌ Неподдерживаемая локаль. Используйте: ru, kk, en');
            return 1;
        }

        $this->info("📦 Экспорт словаря: {$scope} ({$locale})...");

        try {
            $json = $translator->exportDictionary($scope, $locale);
            
            if (!$output) {
                // Выводим в консоль
                $this->line($json);
            } else {
                // Сохраняем в файл
                $directory = dirname($output);
                
                if (!File::isDirectory($directory)) {
                    File::makeDirectory($directory, 0755, true);
                }
                
                File::put($output, $json);
                
                $size = File::size($output);
                $this->info("✅ Словарь экспортирован в: {$output}");
                $this->info("📊 Размер: " . $this->formatBytes($size));
            }

            return 0;

        } catch (\Exception $e) {
            $this->error("❌ Ошибка экспорта: {$e->getMessage()}");
            return 1;
        }
    }

    /**
     * Форматировать размер в байтах
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
