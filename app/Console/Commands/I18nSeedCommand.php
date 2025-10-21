<?php

namespace App\Console\Commands;

use App\Models\GlossaryTerm;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class I18nSeedCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'i18n:seed 
                            {--employees : Импортировать ФИО сотрудников из базы данных}
                            {--table=employees : Название таблицы с сотрудниками}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Наполнить глоссарий терминами и именами собственными';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🌱 Наполнение глоссария терминами...');

        // Добавляем базовые термины
        $this->seedBaseTerms();

        // Импортируем ФИО сотрудников если указано
        if ($this->option('employees')) {
            $this->seedEmployees();
        }

        $this->info('✅ Глоссарий успешно наполнен!');
        
        // Показываем статистику
        $this->displayStats();
    }

    /**
     * Добавить базовые термины
     */
    protected function seedBaseTerms(): void
    {
        $this->info('Добавление базовых терминов...');

        // Салидат Каирбекова
        GlossaryTerm::addTermForAllLocales('Салидат Каирбекова', ['person', 'name']);
        GlossaryTerm::addTermForAllLocales('Каирбекова', ['person', 'surname']);
        GlossaryTerm::addTermForAllLocales('Салидат', ['person', 'firstname']);

        $this->line('  ✓ Добавлены базовые имена');
    }

    /**
     * Импортировать ФИО сотрудников
     */
    protected function seedEmployees(): void
    {
        $table = $this->option('table');
        
        $this->info("Импорт сотрудников из таблицы '{$table}'...");

        try {
            // Проверяем существование таблицы
            if (!DB::getSchemaBuilder()->hasTable($table)) {
                $this->warn("⚠️  Таблица '{$table}' не найдена. Пропускаем.");
                return;
            }

            // Получаем сотрудников
            $employees = DB::table($table)
                ->whereNotNull('first_name')
                ->whereNotNull('last_name')
                ->select('first_name', 'last_name', 'middle_name')
                ->get();

            if ($employees->isEmpty()) {
                $this->warn('⚠️  Сотрудники не найдены в таблице.');
                return;
            }

            $count = 0;
            $bar = $this->output->createProgressBar($employees->count());
            $bar->start();

            foreach ($employees as $employee) {
                GlossaryTerm::addFullName(
                    $employee->last_name,
                    $employee->first_name,
                    $employee->middle_name
                );
                $count++;
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->line("  ✓ Импортировано ФИО: {$count}");

        } catch (\Exception $e) {
            $this->error("Ошибка импорта: {$e->getMessage()}");
        }
    }

    /**
     * Показать статистику глоссария
     */
    protected function displayStats(): void
    {
        $this->newLine();
        $this->info('📊 Статистика глоссария:');

        foreach (['ru', 'kk', 'en'] as $locale) {
            $count = GlossaryTerm::where('locale', $locale)
                ->where('active', true)
                ->count();
            
            $this->line("  {$locale}: {$count} терминов");
        }
    }
}
