<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AutoTranslationService;
use Illuminate\Support\Facades\Log;

class TranslateAllTexts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translate:all 
                            {--from=kz : Source language (default: kz)}
                            {--to=ru,en : Target languages (comma-separated)}
                            {--force : Force translation even if exists}
                            {--dry-run : Show what would be translated without doing it}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Translate all texts from Kazakh to other languages';

    /**
     * The translation service
     *
     * @var AutoTranslationService
     */
    protected $translationService;

    /**
     * Create a new command instance.
     *
     * @param AutoTranslationService $translationService
     * @return void
     */
    public function __construct(AutoTranslationService $translationService)
    {
        parent::__construct();
        $this->translationService = $translationService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sourceLanguage = $this->option('from');
        $targetLanguages = explode(',', $this->option('to'));
        $force = $this->option('force');
        $dryRun = $this->option('dry-run');

        $this->info("🚀 Starting translation process...");
        $this->info("Source language: $sourceLanguage");
        $this->info("Target languages: " . implode(', ', $targetLanguages));
        
        if ($dryRun) {
            $this->warn("DRY RUN MODE - No actual translations will be performed");
        }

        $totalResults = [
            'translated' => 0,
            'errors' => 0,
            'skipped' => 0
        ];

        foreach ($targetLanguages as $targetLanguage) {
            $targetLanguage = trim($targetLanguage);
            
            if ($targetLanguage === $sourceLanguage) {
                $this->warn("Skipping $targetLanguage (same as source)");
                continue;
            }

            $this->info("\n📝 Processing translations to: $targetLanguage");
            
            if ($dryRun) {
                $results = $this->dryRunTranslations($sourceLanguage, $targetLanguage);
            } else {
                $results = $this->translationService->translateMissingTexts($targetLanguage, $sourceLanguage);
            }

            $this->displayResults($results, $targetLanguage);
            
            $totalResults['translated'] += $results['translated'];
            $totalResults['errors'] += $results['errors'];
            $totalResults['skipped'] += $results['skipped'];
        }

        $this->info("\n🎉 Translation process completed!");
        $this->displayTotalResults($totalResults);

        return 0;
    }

    /**
     * Perform a dry run to show what would be translated
     *
     * @param string $sourceLanguage
     * @param string $targetLanguage
     * @return array
     */
    protected function dryRunTranslations($sourceLanguage, $targetLanguage)
    {
        $results = [
            'translated' => 0,
            'errors' => 0,
            'skipped' => 0
        ];

        $kazakhTranslations = $this->translationService->getLanguageFileTranslations($sourceLanguage);
        
        $this->info("Found " . count($kazakhTranslations) . " texts to check");

        foreach ($kazakhTranslations as $key => $kazakhText) {
            $existingTranslation = $this->translationService->getStoredTranslation($kazakhText, $sourceLanguage, $targetLanguage);
            
            if ($existingTranslation) {
                $results['skipped']++;
                $this->line("  ⏭️  Skipped: $key (already exists)");
            } else {
                $results['translated']++;
                $this->line("  ➡️  Would translate: $key");
                $this->line("     From: $kazakhText");
                $this->line("     To: [Would be translated]");
            }
        }

        return $results;
    }

    /**
     * Display results for a specific language
     *
     * @param array $results
     * @param string $language
     * @return void
     */
    protected function displayResults($results, $language)
    {
        $this->info("Results for $language:");
        $this->line("  ✅ Translated: " . $results['translated']);
        $this->line("  ⏭️  Skipped: " . $results['skipped']);
        $this->line("  ❌ Errors: " . $results['errors']);
    }

    /**
     * Display total results
     *
     * @param array $totalResults
     * @return void
     */
    protected function displayTotalResults($totalResults)
    {
        $this->info("\n📊 Total Results:");
        $this->line("  ✅ Total translated: " . $totalResults['translated']);
        $this->line("  ⏭️  Total skipped: " . $totalResults['skipped']);
        $this->line("  ❌ Total errors: " . $totalResults['errors']);
        
        $total = $totalResults['translated'] + $totalResults['skipped'] + $totalResults['errors'];
        if ($total > 0) {
            $successRate = round((($totalResults['translated'] + $totalResults['skipped']) / $total) * 100, 2);
            $this->info("  📈 Success rate: $successRate%");
        }
    }
}
