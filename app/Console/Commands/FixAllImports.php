<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixAllImports extends Command
{
    protected $signature = 'fix:all-imports';
    protected $description = 'Fix all import statement variations in JSX files';

    public function handle()
    {
        $this->info('🔧 Fixing all import statements...');
        
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
        
        // Исправляем все варианты неправильных импортов
        $replacements = [
            'import { { Head }, usePage }' => 'import { Head, usePage }',
            'import { { Link }, usePage }' => 'import { Link, usePage }',
            'import { { router }, usePage }' => 'import { router, usePage }',
            'import { { Head, Link }, usePage }' => 'import { Head, Link, usePage }',
            'import { { Head, Link, usePage }, usePage }' => 'import { Head, Link, usePage }',
            'import { { Head, router }, usePage }' => 'import { Head, router, usePage }',
            'import { { Link, router }, usePage }' => 'import { Link, router, usePage }',
        ];
        
        foreach ($replacements as $wrong => $correct) {
            if (str_contains($content, $wrong)) {
                $content = str_replace($wrong, $correct, $content);
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
