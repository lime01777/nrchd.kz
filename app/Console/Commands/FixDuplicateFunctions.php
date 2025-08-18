<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixDuplicateFunctions extends Command
{
    protected $signature = 'fix:duplicate-functions';
    protected $description = 'Fix duplicate function declarations in JSX files';

    public function handle()
    {
        $this->info('🔧 Fixing duplicate function declarations...');
        
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
        
        $this->info("✅ Completed! Fixed {$totalFixes} duplicate function errors.");
        
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
        
        // Убираем дублированные функции t и неправильные скобки
        $patterns = [
            // Убираем дублированную функцию t
            '/\/\/ Функция для получения перевода\s+const t = \(key, fallback = \'\'\) => \{\s+return translations\?\.[key\] \|\| fallback;\s+\};\s+\/\/ Функция для получения перевода\s+const t = \(key, fallback = \'\'\) => \{\s+return translations\?\.[key\] \|\| fallback;\s+\};\s+\)\s*\{/' => '// Функция для получения перевода
    const t = (key, fallback = \'\') => {
        return translations?.[key] || fallback;
    };',
            
            // Убираем лишние скобки в конце
            '/\)\s*\{(\s*const|\s*let|\s*var|\s*return)/' => '$1',
        ];
        
        foreach ($patterns as $pattern => $replacement) {
            $newContent = preg_replace($pattern, $replacement, $content);
            if ($newContent !== $content) {
                $content = $newContent;
                $fixes++;
            }
        }
        
        // Сохраняем файл если есть изменения
        if ($fixes > 0) {
            File::put($filePath, $content);
        }
        
        return $fixes;
    }
}
