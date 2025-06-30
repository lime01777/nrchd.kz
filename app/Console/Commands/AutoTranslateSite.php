<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class AutoTranslateSite extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translate:generate {--source=ru} {--file=common.php} {--skip-existing : Skip existing translations} {--force : Overwrite existing translations}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Автоматически переводит файлы локализации на казахский и английский языки';

    /**
     * Массив для кэширования переводов в рамках текущего выполнения команды
     * чтобы не делать повторных запросов к API для одинаковых строк
     */
    protected $translationCache = [
        'kz' => [],
        'en' => []
    ];
    
    /**
     * Целевые языки для перевода
     */
    protected $targetLanguages = ['kz', 'en'];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sourceLanguage = $this->option('source');
        $fileName = $this->option('file');
        $skipExisting = $this->option('skip-existing');
        $force = $this->option('force');
        
        $this->info("Начинаем перевод файла {$fileName} с языка {$sourceLanguage} на казахский и английский");
        
        // Проверяем существование исходного файла
        $sourcePath = resource_path("lang/{$sourceLanguage}/{$fileName}");
        if (!File::exists($sourcePath)) {
            $this->error("Исходный файл не найден: {$sourcePath}");
            return 1;
        }
        
        // Загружаем исходные строки для перевода
        $sourceArray = include($sourcePath);
        if (!is_array($sourceArray)) {
            $this->error("Исходный файл не содержит массив: {$sourcePath}");
            return 1;
        }
        
        $this->info("Загружено " . count($sourceArray) . " строк для перевода");
        
        // Загружаем существующие переводы, если они есть
        $existingTranslations = [];
        foreach ($this->targetLanguages as $lang) {
            $langPath = resource_path("lang/{$lang}/{$fileName}");
            if (File::exists($langPath)) {
                $existingTranslations[$lang] = include($langPath);
                $this->info("Загружены существующие переводы для {$lang}: " . count($existingTranslations[$lang]) . " строк");
            }
        }
        
        // Обрабатываем каждый целевой язык
        foreach ($this->targetLanguages as $lang) {
            $translated = [];
            $this->info("=== Перевод на {$lang} ===");
            
            // Проверяем и создаем директорию для языка, если она не существует
            $langDir = resource_path("lang/{$lang}");
            if (!File::exists($langDir)) {
                File::makeDirectory($langDir, 0755, true);
                $this->info("Создана директория для языка: {$langDir}");
            }
            
            // Инициализируем экземпляр переводчика
            $translator = new GoogleTranslate();
            $translator->setSource($sourceLanguage);
            
            // Особая обработка для казахского языка, т.к. Google использует 'kk'
            if ($lang === 'kz') {
                $translator->setTarget('kk');
            } else {
                $translator->setTarget($lang);
            }
            
            // Счетчики для статистики
            $translated = [];
            $skipped = 0;
            $failed = 0;
            $fromCache = 0;
            
            $progressBar = $this->output->createProgressBar(count($sourceArray));
            $progressBar->start();
            
            foreach ($sourceArray as $key => $value) {
                // Проверяем, существует ли уже перевод
                if (!$force && $skipExisting && isset($existingTranslations[$lang][$key])) {
                    $translated[$key] = $existingTranslations[$lang][$key];
                    $skipped++;
                    $progressBar->advance();
                    continue;
                }
                
                // Если строка пустая, не переводим
                if (empty($value) || !is_string($value)) {
                    $translated[$key] = $value;
                    $skipped++;
                    $progressBar->advance();
                    continue;
                }
                
                try {
                    // Проверяем, есть ли перевод в кэше
                    if (isset($this->translationCache[$lang][$value])) {
                        $translated[$key] = $this->translationCache[$lang][$value];
                        $fromCache++;
                    } else {
                        // Делаем паузу чтобы не перегружать API
                        usleep(100000); // 100 мс
                        
                        // Получаем перевод
                        $translatedText = $translator->translate($value);
                        
                        // Сохраняем в кэш и результат
                        $this->translationCache[$lang][$value] = $translatedText;
                        $translated[$key] = $translatedText;
                    }
                } catch (\Exception $e) {
                    Log::error("Ошибка при переводе [{$key}]: " . $e->getMessage());
                    $this->translationCache[$lang][$value] = $value; // Кэшируем оригинал для предотвращения повторных ошибок
                    $translated[$key] = $value; // Используем оригинал как fallback
                    $failed++;
                }
                
                $progressBar->advance();
            }
            
            $progressBar->finish();
            $this->newLine(2);
            
            // Сохраняем результат
            $outputPath = resource_path("lang/{$lang}/{$fileName}");
            $content = "<?php\n\nreturn " . var_export($translated, true) . ";\n";
            File::put($outputPath, $content);
            
            $this->info("Переведено: " . (count($sourceArray) - $skipped - $failed) . ", пропущено: {$skipped}, ошибок: {$failed}, из кэша: {$fromCache}");
            $this->info("Перевод сохранен в: {$outputPath}");
        }
        
        $this->info("\nПеревод завершен успешно!");
        
        return 0;
    }
}
