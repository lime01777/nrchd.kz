<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ExtractAllTexts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'extract:texts 
                            {--output=extracted_texts.json : Output file path}
                            {--include=jsx,php,blade : File extensions to include}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Extract all Russian texts from the website for translation';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $outputFile = $this->option('output');
        $includeExtensions = explode(',', $this->option('include'));
        
        $this->info("🔍 Starting text extraction...");
        $this->info("Output file: $outputFile");
        $this->info("Including extensions: " . implode(', ', $includeExtensions));

        $texts = [];
        $stats = [
            'files_processed' => 0,
            'texts_found' => 0,
            'unique_texts' => 0
        ];

        // Обрабатываем языковые файлы
        $this->info("\n📁 Processing language files...");
        $langTexts = $this->extractFromLanguageFiles();
        $texts = array_merge($texts, $langTexts);
        $stats['texts_found'] += count($langTexts);

        // Обрабатываем JSX файлы
        $this->info("\n📁 Processing JSX files...");
        $jsxTexts = $this->extractFromJsxFiles();
        $texts = array_merge($texts, $jsxTexts);
        $stats['texts_found'] += count($jsxTexts);

        // Обрабатываем Blade файлы
        $this->info("\n📁 Processing Blade files...");
        $bladeTexts = $this->extractFromBladeFiles();
        $texts = array_merge($texts, $bladeTexts);
        $stats['texts_found'] += count($bladeTexts);

        // Обрабатываем PHP файлы
        $this->info("\n📁 Processing PHP files...");
        $phpTexts = $this->extractFromPhpFiles();
        $texts = array_merge($texts, $phpTexts);
        $stats['texts_found'] += count($phpTexts);

        // Удаляем дубликаты и пустые строки
        $uniqueTexts = [];
        $seenTexts = [];
        
        foreach ($texts as $textItem) {
            $text = is_array($textItem) ? $textItem['text'] : $textItem;
            $text = trim($text);
            
            if (!empty($text) && mb_strlen($text) > 1 && !in_array($text, $seenTexts)) {
                $uniqueTexts[] = $textItem;
                $seenTexts[] = $text;
            }
        }
        
        $texts = $uniqueTexts;
        $stats['unique_texts'] = count($texts);

        // Сортируем тексты по длине
        usort($texts, function($a, $b) {
            $textA = is_array($a) ? $a['text'] : $a;
            $textB = is_array($b) ? $b['text'] : $b;
            return mb_strlen($textB) - mb_strlen($textA);
        });

        // Сохраняем результат
        $result = [
            'metadata' => [
                'extracted_at' => now()->toISOString(),
                'total_texts' => $stats['unique_texts'],
                'stats' => $stats
            ],
            'texts' => $texts
        ];

        File::put($outputFile, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->info("\n✅ Text extraction completed!");
        $this->info("📊 Statistics:");
        $this->line("  📄 Files processed: " . $stats['files_processed']);
        $this->line("  🔤 Total texts found: " . $stats['texts_found']);
        $this->line("  ✨ Unique texts: " . $stats['unique_texts']);
        $this->line("  💾 Output saved to: $outputFile");

        return 0;
    }

    /**
     * Извлекает тексты из языковых файлов
     */
    protected function extractFromLanguageFiles(): array
    {
        $texts = [];
        $langPath = resource_path('lang');
        
        if (!is_dir($langPath)) {
            return $texts;
        }

        $languages = ['ru', 'en', 'kz'];
        
        foreach ($languages as $lang) {
            $langDir = $langPath . '/' . $lang;
            if (!is_dir($langDir)) continue;

            $files = File::glob($langDir . '/*.php');
            
            foreach ($files as $file) {
                $fileName = basename($file, '.php');
                $fileTranslations = include $file;
                
                if (is_array($fileTranslations)) {
                    foreach ($fileTranslations as $key => $value) {
                        if (is_string($value) && $this->containsRussianText($value)) {
                            $texts[] = [
                                'text' => $value,
                                'source' => "lang/$lang/$fileName.php",
                                'key' => $key,
                                'language' => $lang
                            ];
                        }
                    }
                }
            }
        }

        return $texts;
    }

    /**
     * Извлекает тексты из JSX файлов
     */
    protected function extractFromJsxFiles(): array
    {
        $texts = [];
        $jsPath = resource_path('js');
        
        if (!is_dir($jsPath)) {
            return $texts;
        }

        $files = File::allFiles($jsPath);
        
        foreach ($files as $file) {
            if ($file->getExtension() !== 'jsx') continue;
            
            $content = File::get($file->getPathname());
            $extracted = $this->extractRussianTextsFromContent($content);
            
            foreach ($extracted as $text) {
                $texts[] = [
                    'text' => $text,
                    'source' => 'js/' . $file->getRelativePathname(),
                    'type' => 'jsx'
                ];
            }
        }

        return $texts;
    }

    /**
     * Извлекает тексты из Blade файлов
     */
    protected function extractFromBladeFiles(): array
    {
        $texts = [];
        $viewsPath = resource_path('views');
        
        if (!is_dir($viewsPath)) {
            return $texts;
        }

        $files = File::allFiles($viewsPath);
        
        foreach ($files as $file) {
            if ($file->getExtension() !== 'blade.php') continue;
            
            $content = File::get($file->getPathname());
            $extracted = $this->extractRussianTextsFromContent($content);
            
            foreach ($extracted as $text) {
                $texts[] = [
                    'text' => $text,
                    'source' => 'views/' . $file->getRelativePathname(),
                    'type' => 'blade'
                ];
            }
        }

        return $texts;
    }

    /**
     * Извлекает тексты из PHP файлов
     */
    protected function extractFromPhpFiles(): array
    {
        $texts = [];
        $appPath = app_path();
        
        if (!is_dir($appPath)) {
            return $texts;
        }

        $files = File::allFiles($appPath);
        
        foreach ($files as $file) {
            if ($file->getExtension() !== 'php') continue;
            
            $content = File::get($file->getPathname());
            $extracted = $this->extractRussianTextsFromContent($content);
            
            foreach ($extracted as $text) {
                $texts[] = [
                    'text' => $text,
                    'source' => 'app/' . $file->getRelativePathname(),
                    'type' => 'php'
                ];
            }
        }

        return $texts;
    }

    /**
     * Извлекает русские тексты из содержимого файла
     */
    protected function extractRussianTextsFromContent(string $content): array
    {
        $texts = [];
        
        // Паттерны для поиска русских текстов
        $patterns = [
            // Строки в кавычках с русскими символами
            '/["\']([^"\']*[а-яё][^"\']*)["\']/ui',
            // Текст в JSX
            '/>{([^}]*[а-яё][^}]*)</ui',
            // Текст в комментариях
            '/\/\*([^*]*[а-яё][^*]*)\*\//ui',
            '/\/\/([^\n]*[а-яё][^\n]*)/ui',
            // Текст в HTML атрибутах
            '/title=["\']([^"\']*[а-яё][^"\']*)["\']/ui',
            '/alt=["\']([^"\']*[а-яё][^"\']*)["\']/ui',
            '/placeholder=["\']([^"\']*[а-яё][^"\']*)["\']/ui',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match_all($pattern, $content, $matches)) {
                foreach ($matches[1] as $match) {
                    $text = trim($match);
                    if ($this->containsRussianText($text) && mb_strlen($text) > 1) {
                        $texts[] = $text;
                    }
                }
            }
        }

        return array_unique($texts);
    }

    /**
     * Проверяет, содержит ли текст русские символы
     */
    protected function containsRussianText(string $text): bool
    {
        return preg_match('/[а-яё]/ui', $text);
    }
}
