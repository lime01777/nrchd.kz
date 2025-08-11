<?php

namespace App\Console\Commands;

use App\Services\TranslationExceptionsService;
use Illuminate\Console\Command;

class ManageTranslationExceptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translations:exceptions 
                            {action : add|remove|list|clear-cache}
                            {--original= : Original text for add/remove actions}
                            {--translated= : Translated text for add action}
                            {--language= : Target language for add action}
                            {--category=names : Category for the exception}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage translation exceptions for proper names and terms';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'add':
                $this->addException();
                break;
            case 'remove':
                $this->removeException();
                break;
            case 'list':
                $this->listExceptions();
                break;
            case 'clear-cache':
                $this->clearCache();
                break;
            default:
                $this->error("Unknown action: $action");
                return 1;
        }

        return 0;
    }

    /**
     * Добавить исключение
     */
    private function addException()
    {
        $original = $this->option('original');
        $translated = $this->option('translated');
        $language = $this->option('language');
        $category = $this->option('category');

        if (!$original || !$translated || !$language) {
            $this->error('Для добавления исключения необходимо указать --original, --translated и --language');
            return;
        }

        $translations = [$language => $translated];

        if (TranslationExceptionsService::addException($original, $translations, $category)) {
            $this->info("Исключение добавлено: '$original' -> '$translated' ($language)");
        } else {
            $this->error('Ошибка при добавлении исключения');
        }
    }

    /**
     * Удалить исключение
     */
    private function removeException()
    {
        $original = $this->option('original');
        $category = $this->option('category');

        if (!$original) {
            $this->error('Для удаления исключения необходимо указать --original');
            return;
        }

        if (TranslationExceptionsService::removeException($original, $category)) {
            $this->info("Исключение удалено: '$original'");
        } else {
            $this->error('Исключение не найдено или ошибка при удалении');
        }
    }

    /**
     * Показать список исключений
     */
    private function listExceptions()
    {
        $exceptions = TranslationExceptionsService::getExceptions();
        
        if (empty($exceptions)) {
            $this->info('Исключения не найдены');
            return;
        }

        $this->info('Список исключений переводов:');
        $this->newLine();

        foreach ($exceptions as $category => $categoryData) {
            $this->info("Категория: $category");
            $this->line('─' . str_repeat('─', strlen($category) + 10));
            
            if (isset($categoryData['ru'])) {
                foreach ($categoryData['ru'] as $original => $translations) {
                    $this->line("  Оригинал: $original");
                    foreach ($translations as $lang => $translated) {
                        $this->line("    $lang: $translated");
                    }
                    $this->newLine();
                }
            }
        }
    }

    /**
     * Очистить кэш исключений
     */
    private function clearCache()
    {
        if (TranslationExceptionsService::clearCache()) {
            $this->info('Кэш исключений очищен');
        } else {
            $this->error('Ошибка при очистке кэша');
        }
    }
}
