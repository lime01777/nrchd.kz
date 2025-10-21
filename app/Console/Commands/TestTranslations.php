<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

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
        
        // Проверяем таблицу переводов
        if (!Schema::hasTable('stored_translations')) {
            $this->error("❌ Table 'stored_translations' does not exist");
            return 1;
        }
        
        // Получаем переводы из базы данных
        $translationsCount = DB::table('stored_translations')
            ->where('target_language', $locale)
            ->count();
        
        $this->info("📊 Total translations in database: {$translationsCount}");
        
        // Тестируем основные ключи через функцию trans()
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
        
        $this->info("\n📋 Testing Laravel translation keys:");
        $this->line("┌─────────────────┬─────────────────┬─────────────────┐");
        $this->line("│ Key             │ Expected        │ Actual          │");
        $this->line("├─────────────────┼─────────────────┼─────────────────┤");
        
        foreach ($testKeys as $key => $expected) {
            // Пробуем получить перевод через trans()
            $actual = trans("common.{$key}", [], $locale);
            $status = $actual !== "common.{$key}" ? '✅' : '❌';
            
            $this->line(sprintf(
                "│ %-15s │ %-15s │ %-15s │ %s",
                substr($key, 0, 15),
                substr($expected, 0, 15),
                substr($actual, 0, 15),
                $status
            ));
        }
        
        $this->line("└─────────────────┴─────────────────┴─────────────────┘");
        
        // Показываем примеры переводов из базы данных
        $this->info("\n🎯 Sample translations from database:");
        $samples = DB::table('stored_translations')
            ->where('target_language', $locale)
            ->limit(10)
            ->get(['original_text', 'translated_text']);
        
        foreach ($samples as $sample) {
            $original = mb_substr($sample->original_text, 0, 30);
            $translated = mb_substr($sample->translated_text, 0, 30);
            $this->line("  {$original} => {$translated}");
        }
        
        // Проверяем пустые переводы
        $emptyCount = DB::table('stored_translations')
            ->where('target_language', $locale)
            ->where(function($query) {
                $query->whereNull('translated_text')
                      ->orWhere('translated_text', '');
            })
            ->count();
        
        if ($emptyCount > 0) {
            $this->warn("\n⚠️  Found {$emptyCount} empty translations");
        }
        
        $this->info("\n✅ Translation test completed!");
        
        return 0;
    }
}
