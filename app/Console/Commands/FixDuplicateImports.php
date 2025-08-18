<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixDuplicateImports extends Command
{
    protected $signature = 'fix:duplicate-imports';
    protected $description = 'Исправляет дублированные импорты и объявления в JSX файлах';

    public function handle()
    {
        $this->info('🔧 Исправление дублированных импортов...');
        
        $jsxFiles = File::glob(resource_path('js/**/*.jsx'));
        $fixedCount = 0;
        
        foreach ($jsxFiles as $file) {
            $content = File::get($file);
            $originalContent = $content;
            
            // Исправление дублированных импортов usePage
            $content = $this->fixDuplicateUsePageImports($content);
            
            // Исправление дублированных объявлений t() функции
            $content = $this->fixDuplicateTFunction($content);
            
            // Исправление дублированных объявлений translations
            $content = $this->fixDuplicateTranslations($content);
            
            if ($content !== $originalContent) {
                File::put($file, $content);
                $fixedCount++;
                $this->info("✅ Исправлен: " . basename($file));
            }
        }
        
        $this->info("🎉 Исправлено файлов: {$fixedCount}");
        
        return 0;
    }
    
    private function fixDuplicateUsePageImports($content)
    {
        // Удаляем дублированные импорты usePage
        $lines = explode("\n", $content);
        $usePageImports = [];
        $otherImports = [];
        $inertiaImports = [];
        
        foreach ($lines as $line) {
            $trimmedLine = trim($line);
            
            if (str_contains($trimmedLine, 'import') && str_contains($trimmedLine, 'usePage')) {
                $usePageImports[] = $trimmedLine;
            } elseif (str_contains($trimmedLine, 'import') && str_contains($trimmedLine, '@inertiajs')) {
                $inertiaImports[] = $trimmedLine;
            } elseif (str_contains($trimmedLine, 'import')) {
                $otherImports[] = $trimmedLine;
            }
        }
        
        // Создаем новый контент
        $newLines = [];
        $usePageAdded = false;
        
        foreach ($lines as $line) {
            $trimmedLine = trim($line);
            
            // Пропускаем дублированные импорты usePage
            if (str_contains($trimmedLine, 'import') && str_contains($trimmedLine, 'usePage')) {
                if (!$usePageAdded) {
                    // Добавляем usePage к существующему импорту из @inertiajs/react
                    foreach ($inertiaImports as $inertiaImport) {
                        if (str_contains($inertiaImport, '{') && str_contains($inertiaImport, '}')) {
                            // Уже есть импорт с фигурными скобками
                            if (!str_contains($inertiaImport, 'usePage')) {
                                $newImport = str_replace('}', ', usePage }', $inertiaImport);
                                $newLines[] = $newImport;
                            } else {
                                $newLines[] = $inertiaImport;
                            }
                        } else {
                            // Добавляем новый импорт
                            $newLines[] = "import { usePage } from '@inertiajs/react';";
                        }
                    }
                    $usePageAdded = true;
                }
                continue;
            }
            
            // Пропускаем строки с объявлениями t() и translations вне компонента
            if (str_contains($trimmedLine, 'const { translations }') && !str_contains($trimmedLine, 'function')) {
                continue;
            }
            if (str_contains($trimmedLine, 'const t = ') && !str_contains($trimmedLine, 'function')) {
                continue;
            }
            
            $newLines[] = $line;
        }
        
        return implode("\n", $newLines);
    }
    
    private function fixDuplicateTFunction($content)
    {
        // Удаляем дублированные объявления t() функции
        $pattern = '/const t = \(key, fallback = \'\'\) => translations\?\.[key\] \|\| fallback;\s*\n\s*const t = \(key, fallback = \'\'\) => translations\?\.[key\] \|\| fallback;/';
        $replacement = 'const t = (key, fallback = \'\') => translations?.[key] || fallback;';
        
        return preg_replace($pattern, $replacement, $content);
    }
    
    private function fixDuplicateTranslations($content)
    {
        // Удаляем дублированные объявления translations
        $pattern = '/const \{ translations \} = usePage\(\)\.props;\s*\n\s*const \{ translations \} = usePage\(\)\.props;/';
        $replacement = 'const { translations } = usePage().props;';
        
        return preg_replace($pattern, $replacement, $content);
    }
}
