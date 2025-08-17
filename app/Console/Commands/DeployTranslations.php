<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class DeployTranslations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deploy:translations {--force : Принудительное выполнение}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Безопасное развертывание таблиц переводов на хостинге';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Начинаем безопасное развертывание таблиц переводов...');

        // Проверяем существование таблиц
        $translationsExists = Schema::hasTable('translations');
        $storedTranslationsExists = Schema::hasTable('stored_translations');

        $this->info("📊 Статус таблиц:");
        $this->info("   - translations: " . ($translationsExists ? "✅ Существует" : "❌ Не существует"));
        $this->info("   - stored_translations: " . ($storedTranslationsExists ? "✅ Существует" : "❌ Не существует"));

        // Создаем таблицу translations если её нет
        if (!$translationsExists) {
            $this->info('📝 Создаем таблицу translations...');
            Schema::create('translations', function ($table) {
                $table->id();
                $table->text('original_text');
                $table->text('translated_text');
                $table->string('source_language', 10)->default('ru');
                $table->string('target_language', 10);
                $table->string('content_type')->nullable();
                $table->unsignedBigInteger('content_id')->nullable();
                $table->timestamps();
                
                // Индексы для быстрого поиска
                $table->index(['original_text', 'source_language', 'target_language']);
                $table->index(['content_type', 'content_id']);
            });
            $this->info('✅ Таблица translations создана');
        } else {
            $this->info('ℹ️ Таблица translations уже существует');
        }

        // Создаем таблицу stored_translations если её нет
        if (!$storedTranslationsExists) {
            $this->info('📝 Создаем таблицу stored_translations...');
            Schema::create('stored_translations', function ($table) {
                $table->id();
                $table->text('original_text');
                $table->text('translated_text');
                $table->string('target_language', 10);
                $table->string('page_url')->nullable();
                $table->string('hash', 32)->unique();
                $table->boolean('is_verified')->default(false);
                $table->timestamps();
                
                // Индексы для быстрого поиска
                $table->index(['hash']);
                $table->index(['target_language']);
                $table->index(['page_url']);
            });
            $this->info('✅ Таблица stored_translations создана');
        } else {
            $this->info('ℹ️ Таблица stored_translations уже существует');
        }

        // Отмечаем миграции как выполненные
        $this->info('📋 Отмечаем миграции как выполненные...');
        
        $migrations = [
            '2025_08_15_125231_create_translations_table',
            '2025_08_15_125236_create_stored_translations_table',
            '2025_08_17_173456_fix_translations_tables'
        ];

        foreach ($migrations as $migration) {
            $exists = DB::table('migrations')->where('migration', $migration)->exists();
            if (!$exists) {
                DB::table('migrations')->insert([
                    'migration' => $migration,
                    'batch' => DB::table('migrations')->max('batch') + 1
                ]);
                $this->info("✅ Миграция {$migration} отмечена как выполненная");
            } else {
                $this->info("ℹ️ Миграция {$migration} уже отмечена как выполненная");
            }
        }

        $this->info('🎉 Развертывание таблиц переводов завершено успешно!');
        
        return Command::SUCCESS;
    }
}
