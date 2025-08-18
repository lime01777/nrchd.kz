<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixImports extends Command
{
    protected $signature = 'fix:imports';
    protected $description = 'Fix import statements in JSX files';

    public function handle()
    {
        $this->info('🔧 Fixing import statements...');
        
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
        
        $this->info("✅ Completed! Fixed {$totalFixes} import errors.");
        
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
        $content = str_replace('import { { Head }, usePage }', 'import { Head, usePage }', $content);
        if ($content !== $originalContent) {
            $fixes++;
            $originalContent = $content;
        }
        
        // Исправляем другие варианты неправильных импортов
        $content = str_replace('import { { Link }, usePage }', 'import { Link, usePage }', $content);
        if ($content !== $originalContent) {
            $fixes++;
            $originalContent = $content;
        }
        
        $content = str_replace('import { { router }, usePage }', 'import { router, usePage }', $content);
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
