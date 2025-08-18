<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixAllComponentSyntax extends Command
{
    protected $signature = 'fix:all-component-syntax';
    protected $description = 'Fix all component syntax errors';

    public function handle()
    {
        $this->info('🔧 Fixing all component syntax errors...');
        
        $jsxFiles = $this->findJsxFiles();
        $this->info("Found " . count($jsxFiles) . " JSX files to check");
        
        $totalFixes = 0;
        
        foreach ($jsxFiles as $file) {
            $fixes = $this->fixFile($file);
            $totalFixes += $fixes;
            
            if ($fixes > 0) {
                $this->line("  ✅ {$file}: {$fixes} fixes");
            }
        }
        
        $this->info("✅ Completed! Fixed {$totalFixes} syntax errors.");
        
        return 0;
    }
    
    protected function findJsxFiles()
    {
        $files = [];
        $directories = [
            'resources/js/Components',
            'resources/js/Pages',
            'resources/js/Layouts'
        ];
        
        foreach ($directories as $dir) {
            if (File::exists($dir)) {
                $jsxFiles = File::glob($dir . '/**/*.jsx');
                $files = array_merge($files, $jsxFiles);
            }
        }
        
        return $files;
    }
    
    protected function fixFile($filePath)
    {
        $content = File::get($filePath);
        $originalContent = $content;
        $fixes = 0;
        
        // Исправляем неправильный импорт: import { { Head }, usePage }
        $content = preg_replace('/import\s+\{\s*\{\s*([^}]+)\s*\}\s*,\s*usePage\s*\}\s+from/', 'import { $1, usePage } from', $content);
        if ($content !== $originalContent) {
            $fixes++;
            $originalContent = $content;
        }
        
        // Исправляем дублированные функции t
        $content = preg_replace('/\/\/ Функция для получения перевода\s+const t = \(key, fallback = \'\'\) => \{\s+return translations\?\.[key\] \|\| fallback;\s+\};\s+\/\/ Функция для получения перевода\s+const t = \(key, fallback = \'\'\) => \{\s+return translations\?\.[key\] \|\| fallback;\s+\};\s+\)\s*\{/', '// Функция для получения перевода
    const t = (key, fallback = \'\') => {
        return translations?.[key] || fallback;
    };', $content);
        if ($content !== $originalContent) {
            $fixes++;
            $originalContent = $content;
        }
        
        // Исправляем неправильное закрытие функции
        $content = preg_replace('/\)\s*\{(\s*return)/', '$1', $content);
        if ($content !== $originalContent) {
            $fixes++;
            $originalContent = $content;
        }
        
        // Убираем лишние скобки в конце функции
        $content = preg_replace('/\)\s*\{(\s*return\s*<)/', '$1', $content);
        if ($content !== $originalContent) {
            $fixes++;
            $originalContent = $content;
        }
        
        // Сохраняем файл если есть изменения
        if ($fixes > 0) {
            File::put($filePath, $content);
        }
        
        return $fixes;
    }
}
