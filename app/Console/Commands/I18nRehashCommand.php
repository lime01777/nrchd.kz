<?php

namespace App\Console\Commands;

use App\Services\Translator;
use App\Models\Translation;
use Illuminate\Console\Command;

class I18nRehashCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'i18n:rehash 
                            {--scope=* : Пересчитать только указанные scope (можно несколько)}
                            {--all : Пересчитать все scope}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Пересчитать хеши и перегенерировать переводы';

    /**
     * Execute the console command.
     */
    public function handle(Translator $translator)
    {
        $this->info('🔄 Пересчет хешей и регенерация переводов...');

        $scopes = $this->getScopes();

        if (empty($scopes)) {
            $this->warn('⚠️  Не указаны scope для обработки. Используйте --scope=название или --all');
            return 1;
        }

        $totalUpdated = 0;
        $bar = $this->output->createProgressBar(count($scopes));
        $bar->start();

        foreach ($scopes as $scope) {
            $updated = $translator->rehashScope($scope);
            $totalUpdated += $updated;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Обработано scope: " . count($scopes));
        $this->info("✅ Обновлено переводов: {$totalUpdated}");
        
        if ($totalUpdated > 0) {
            $this->info('🔄 Задачи на перевод добавлены в очередь');
        }

        return 0;
    }

    /**
     * Получить список scope для обработки
     */
    protected function getScopes(): array
    {
        if ($this->option('all')) {
            // Получаем все уникальные scope из БД
            return Translation::select('scope')
                ->distinct()
                ->pluck('scope')
                ->toArray();
        }

        return $this->option('scope') ?: [];
    }
}
