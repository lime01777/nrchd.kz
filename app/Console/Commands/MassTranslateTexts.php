<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AutoTranslationService;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class MassTranslateTexts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translate:mass 
                            {--input=all_russian_texts.json : Input file with texts to translate}
                            {--from=ru : Source language}
                            {--to=kz,en : Target languages (comma-separated)}
                            {--batch-size=50 : Number of texts to translate in one batch}
                            {--delay=1000 : Delay between batches in milliseconds}
                            {--force : Force translation even if exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mass translate all Russian texts to Kazakh and English';

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
        $inputFile = $this->option('input');
        $sourceLanguage = $this->option('from');
        $targetLanguages = explode(',', $this->option('to'));
        $batchSize = (int) $this->option('batch-size');
        $delay = (int) $this->option('delay');
        $force = $this->option('force');

        $this->info("🚀 Starting mass translation process...");
        $this->info("Input file: $inputFile");
        $this->info("Source language: $sourceLanguage");
        $this->info("Target languages: " . implode(', ', $targetLanguages));
        $this->info("Batch size: $batchSize");
        $this->info("Delay between batches: {$delay}ms");

        // Проверяем существование файла
        if (!File::exists($inputFile)) {
            $this->error("❌ Input file not found: $inputFile");
            return 1;
        }

        // Загружаем данные из файла
        $this->info("\n📖 Loading texts from file...");
        $data = json_decode(File::get($inputFile), true);
        
        if (!$data || !isset($data['texts'])) {
            $this->error("❌ Invalid JSON format or no texts found");
            return 1;
        }

        $texts = $data['texts'];
        $totalTexts = count($texts);
        
        $this->info("📊 Found $totalTexts texts to process");

        // Фильтруем только уникальные русские тексты
        $uniqueTexts = [];
        $seenTexts = [];
        
        foreach ($texts as $textItem) {
            $text = is_array($textItem) ? $textItem['text'] : $textItem;
            $text = trim($text);
            
            // Проверяем, что текст содержит русские символы и достаточно длинный
            if ($this->containsRussianText($text) && mb_strlen($text) > 2 && !in_array($text, $seenTexts)) {
                $uniqueTexts[] = $text;
                $seenTexts[] = $text;
            }
        }

        $uniqueCount = count($uniqueTexts);
        $this->info("✨ Unique Russian texts: $uniqueCount");

        if ($uniqueCount === 0) {
            $this->warn("⚠️ No Russian texts found to translate");
            return 0;
        }

        // Статистика по языкам
        $stats = [];
        foreach ($targetLanguages as $lang) {
            $stats[$lang] = [
                'translated' => 0,
                'skipped' => 0,
                'errors' => 0
            ];
        }

        // Разбиваем на батчи
        $batches = array_chunk($uniqueTexts, $batchSize);
        $totalBatches = count($batches);

        $this->info("\n🔄 Starting translation in $totalBatches batches...");

        $progressBar = $this->output->createProgressBar($totalBatches);
        $progressBar->start();

        foreach ($batches as $batchIndex => $batch) {
            $this->info("\n📦 Processing batch " . ($batchIndex + 1) . "/$totalBatches (" . count($batch) . " texts)");

            foreach ($targetLanguages as $targetLanguage) {
                if ($targetLanguage === $sourceLanguage) {
                    continue;
                }

                $this->info("  🌐 Translating to $targetLanguage...");

                foreach ($batch as $text) {
                    try {
                        // Проверяем, есть ли уже перевод
                        if (!$force) {
                            $existingTranslation = $this->translationService->getStoredTranslation($text, $sourceLanguage, $targetLanguage);
                            if ($existingTranslation) {
                                $stats[$targetLanguage]['skipped']++;
                                continue;
                            }
                        }

                        // Переводим текст
                        $translatedText = $this->translationService->translateText($text, $targetLanguage, $sourceLanguage);
                        
                        if ($translatedText !== $text) {
                            $stats[$targetLanguage]['translated']++;
                            $this->line("    ✅ Translated: " . mb_substr($text, 0, 50) . "...");
                        } else {
                            $stats[$targetLanguage]['skipped']++;
                        }

                    } catch (\Exception $e) {
                        $stats[$targetLanguage]['errors']++;
                        $this->error("    ❌ Error translating: " . mb_substr($text, 0, 50) . "... - " . $e->getMessage());
                        Log::error("Translation error for text: " . mb_substr($text, 0, 100), [
                            'text' => $text,
                            'source' => $sourceLanguage,
                            'target' => $targetLanguage,
                            'error' => $e->getMessage()
                        ]);
                    }
                }
            }

            $progressBar->advance();

            // Задержка между батчами
            if ($batchIndex < $totalBatches - 1 && $delay > 0) {
                $this->info("  ⏳ Waiting {$delay}ms before next batch...");
                usleep($delay * 1000);
            }
        }

        $progressBar->finish();

        // Выводим итоговую статистику
        $this->info("\n\n🎉 Mass translation completed!");
        $this->displayFinalStats($stats, $uniqueCount);

        return 0;
    }

    /**
     * Проверяет, содержит ли текст русские символы
     */
    protected function containsRussianText(string $text): bool
    {
        return preg_match('/[а-яё]/ui', $text);
    }

    /**
     * Отображает итоговую статистику
     */
    protected function displayFinalStats(array $stats, int $totalTexts): void
    {
        $this->info("\n📊 Final Statistics:");
        
        foreach ($stats as $language => $languageStats) {
            $this->line("  🌐 $language:");
            $this->line("    ✅ Translated: " . $languageStats['translated']);
            $this->line("    ⏭️ Skipped: " . $languageStats['skipped']);
            $this->line("    ❌ Errors: " . $languageStats['errors']);
            
            $total = $languageStats['translated'] + $languageStats['skipped'] + $languageStats['errors'];
            if ($total > 0) {
                $successRate = round((($languageStats['translated'] + $languageStats['skipped']) / $total) * 100, 2);
                $this->line("    📈 Success rate: $successRate%");
            }
        }

        $this->info("\n💾 All translations have been saved to the database.");
        $this->info("🔍 You can now run 'php artisan translate:all' to update language files.");
    }
}
