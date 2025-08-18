<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TranslationService;
use Illuminate\Support\Facades\App;

class TestTranslations extends Command
{
    protected $signature = 'test:translations {--locale=kz : Language to test}';
    protected $description = 'Test translation system for a specific locale';

    public function handle()
    {
        $locale = $this->option('locale');
        
        if (!in_array($locale, ['kz', 'ru', 'en'])) {
            $this->error("Invalid locale. Use: kz, ru, or en");
            return 1;
        }

        $this->info("🔍 Testing translations for locale: {$locale}");
        
        // Устанавливаем локаль
        App::setLocale($locale);
        
        // Получаем переводы
        $translations = TranslationService::getForPage('home', $locale);
        
        $this->info("📊 Total translations loaded: " . count($translations));
        
        // Тестируем основные ключи
        $testKeys = [
            'home' => 'Домой',
            'about' => 'О нас',
            'contacts' => 'Контакты',
            'news' => 'Новости',
            'documents' => 'Документы',
            'services' => 'Услуги',
            'center_name' => 'Название центра',
            'language' => 'Язык',
            'login' => 'Войти',
            'logout' => 'Выйти'
        ];
        
        $this->info("\n📋 Testing key translations:");
        $this->line("┌─────────────────┬─────────────────┬─────────────────┐");
        $this->line("│ Key             │ Expected        │ Actual          │");
        $this->line("├─────────────────┼─────────────────┼─────────────────┤");
        
        foreach ($testKeys as $key => $expected) {
            $actual = $translations[$key] ?? 'NOT FOUND';
            $status = isset($translations[$key]) ? '✅' : '❌';
            
            $this->line(sprintf(
                "│ %-15s │ %-15s │ %-15s │ %s",
                substr($key, 0, 15),
                substr($expected, 0, 15),
                substr($actual, 0, 15),
                $status
            ));
        }
        
        $this->line("└─────────────────┴─────────────────┴─────────────────┘");
        
        // Показываем несколько примеров переводов
        $this->info("\n🎯 Sample translations:");
        $sampleKeys = array_slice(array_keys($translations), 0, 10);
        
        foreach ($sampleKeys as $key) {
            $translation = $translations[$key];
            $this->line("  {$key}: {$translation}");
        }
        
        // Проверяем, что переводы не пустые
        $emptyTranslations = array_filter($translations, function($value) {
            if (is_array($value)) return false;
            return empty(trim($value));
        });
        
        if (count($emptyTranslations) > 0) {
            $this->warn("\n⚠️  Found " . count($emptyTranslations) . " empty translations:");
            foreach (array_keys($emptyTranslations) as $key) {
                $this->line("  - {$key}");
            }
        }
        
        $this->info("\n✅ Translation test completed!");
        
        return 0;
    }
}
