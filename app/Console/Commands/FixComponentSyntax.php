<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixComponentSyntax extends Command
{
    protected $signature = 'fix:component-syntax';
    protected $description = 'Fix component syntax errors caused by translation updates';

    public function handle()
    {
        $this->info('🔧 Fixing component syntax errors...');
        
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
        
        // Исправляем неправильный синтаксис функции
        // Ищем pattern: function Name( const { translations } = usePage().props;
        $pattern = '/function\s+(\w+)\s*\(\s*\n\s*const\s+\{\s*translations\s*\}\s*=\s*usePage\(\)\.props;/';
        if (preg_match($pattern, $content)) {
            $content = preg_replace($pattern, 'function $1() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода
    const t = (key, fallback = \'\') => {
        return translations?.[key] || fallback;
    };', $content);
            $fixes++;
        }
        
        // Добавляем импорт usePage если его нет
        if (str_contains($content, 'usePage') && !str_contains($content, 'import.*usePage')) {
            $importPattern = '/import\s+.*?from\s+[\'"]@inertiajs\/react[\'"];?/';
            if (preg_match($importPattern, $content)) {
                // Добавляем usePage к существующему импорту
                $content = preg_replace(
                    '/import\s+(\{[^}]*\})\s+from\s+[\'"]@inertiajs\/react[\'"];?/',
                    'import { $1, usePage } from \'@inertiajs/react\';',
                    $content
                );
            } else {
                // Добавляем новый импорт
                $content = "import { usePage } from '@inertiajs/react';\n" . $content;
            }
            $fixes++;
        }
        
        // Сохраняем файл если есть изменения
        if ($fixes > 0) {
            File::put($filePath, $content);
        }
        
        return $fixes;
    }
}
