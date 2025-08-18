<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CheckHeaderTranslations extends Command
{
    protected $signature = 'check:header-translations';
    protected $description = 'Check and add missing translations for Header component';

    public function handle()
    {
        $this->info('🔍 Checking Header component translations...');
        
        // Читаем Header компонент
        $headerContent = File::get('resources/js/Components/Header.jsx');
        
        // Извлекаем все t() вызовы
        preg_match_all('/t\([\'"]([^\'"]+)[\'"][^)]*\)/', $headerContent, $matches);
        
        $translationKeys = array_unique($matches[1]);
        
        $this->info('Found ' . count($translationKeys) . ' translation keys in Header');
        
        // Проверяем переводы для каждого языка
        $languages = ['kz', 'ru', 'en'];
        
        foreach ($languages as $lang) {
            $this->info("\n📋 Checking {$lang} translations:");
            
            $langFile = "resources/lang/{$lang}/common.php";
            if (!File::exists($langFile)) {
                $this->error("Language file {$langFile} not found!");
                continue;
            }
            
            $translations = include $langFile;
            $missing = [];
            
            foreach ($translationKeys as $key) {
                if (!isset($translations[$key])) {
                    $missing[] = $key;
                }
            }
            
            if (empty($missing)) {
                $this->info("✅ All translations found for {$lang}");
            } else {
                $this->warn("❌ Missing " . count($missing) . " translations for {$lang}:");
                foreach ($missing as $key) {
                    $this->line("  - {$key}");
                }
            }
        }
        
        // Показываем все найденные ключи
        $this->info("\n📝 All translation keys found in Header:");
        foreach ($translationKeys as $key) {
            $this->line("  - {$key}");
        }
        
        return 0;
    }
}
