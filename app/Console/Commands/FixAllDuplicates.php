<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixAllDuplicates extends Command
{
    protected $signature = 'fix:all-duplicates';
    protected $description = 'Исправляет все дублированные импорты и объявления в JSX файлах';

    public function handle()
    {
        $this->info('🔧 Исправление всех дублированных элементов...');
        
        $jsxFiles = File::glob(resource_path('js/**/*.jsx'));
        $fixedCount = 0;
        
        foreach ($jsxFiles as $file) {
            $content = File::get($file);
            $originalContent = $content;
            
            // Исправляем дублированные импорты usePage
            $content = $this->removeDuplicateUsePageImports($content);
            
            // Исправляем дублированные объявления вне компонентов
            $content = $this->removeDuplicateDeclarations($content);
            
            if ($content !== $originalContent) {
                File::put($file, $content);
                $fixedCount++;
                $this->info("✅ Исправлен: " . basename($file));
            }
        }
        
        $this->info("🎉 Исправлено файлов: {$fixedCount}");
        
        return 0;
    }
    
    private function removeDuplicateUsePageImports($content)
    {
        $lines = explode("\n", $content);
        $newLines = [];
        $usePageFound = false;
        
        foreach ($lines as $line) {
            $trimmedLine = trim($line);
            
            // Если это импорт usePage и мы его уже нашли, пропускаем
            if (str_contains($trimmedLine, 'import') && str_contains($trimmedLine, 'usePage')) {
                if (!$usePageFound) {
                    $newLines[] = $line;
                    $usePageFound = true;
                }
                continue;
            }
            
            // Если это объявление translations или t() вне компонента, пропускаем
            if ((str_contains($trimmedLine, 'const { translations }') || str_contains($trimmedLine, 'const t = ')) && 
                !str_contains($trimmedLine, 'function') && !str_contains($trimmedLine, '=>')) {
                continue;
            }
            
            $newLines[] = $line;
        }
        
        return implode("\n", $newLines);
    }
    
    private function removeDuplicateDeclarations($content)
    {
        // Удаляем дублированные объявления translations
        $content = preg_replace('/const \{ translations \} = usePage\(\)\.props;\s*\n\s*const \{ translations \} = usePage\(\)\.props;/', 'const { translations } = usePage().props;', $content);
        
        // Удаляем дублированные объявления t() функции
        $content = preg_replace('/const t = \(key, fallback = \'\'\) => translations\?\.[key\] \|\| fallback;\s*\n\s*const t = \(key, fallback = \'\'\) => translations\?\.[key\] \|\| fallback;/', 'const t = (key, fallback = \'\') => translations?.[key] || fallback;', $content);
        
        return $content;
    }
}
