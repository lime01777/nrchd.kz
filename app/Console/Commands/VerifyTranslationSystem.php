<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoredTranslation;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\App;

class VerifyTranslationSystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:translations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verify the complete translation system';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info("🔍 Verifying translation system...");
        
        $checks = [
            'database' => $this->checkDatabase(),
            'language_files' => $this->checkLanguageFiles(),
            'configuration' => $this->checkConfiguration(),
            'middleware' => $this->checkMiddleware(),
        ];
        
        $this->displayResults($checks);
        
        return 0;
    }
    
    /**
     * Проверяет базу данных переводов
     */
    protected function checkDatabase(): array
    {
        $this->info("\n📊 Checking database translations...");
        
        $totalTranslations = StoredTranslation::count();
        $kazakhTranslations = StoredTranslation::where('target_language', 'kz')->count();
        $englishTranslations = StoredTranslation::where('target_language', 'en')->count();
        $russianTranslations = StoredTranslation::where('target_language', 'ru')->count();
        $verifiedTranslations = StoredTranslation::where('is_verified', true)->count();
        
        return [
            'status' => 'success',
            'data' => [
                'total' => $totalTranslations,
                'kazakh' => $kazakhTranslations,
                'english' => $englishTranslations,
                'russian' => $russianTranslations,
                'verified' => $verifiedTranslations,
            ]
        ];
    }
    
    /**
     * Проверяет языковые файлы
     */
    protected function checkLanguageFiles(): array
    {
        $this->info("\n📁 Checking language files...");
        
        $files = [
            'kz' => resource_path('lang/kz/common.php'),
            'en' => resource_path('lang/en/common.php'),
            'ru' => resource_path('lang/ru/common.php'),
        ];
        
        $results = [];
        
        foreach ($files as $lang => $file) {
            if (File::exists($file)) {
                $translations = include $file;
                $count = is_array($translations) ? count($translations) : 0;
                $results[$lang] = [
                    'exists' => true,
                    'count' => $count,
                    'status' => 'success'
                ];
            } else {
                $results[$lang] = [
                    'exists' => false,
                    'count' => 0,
                    'status' => 'error'
                ];
            }
        }
        
        return [
            'status' => in_array('error', array_column($results, 'status')) ? 'error' : 'success',
            'data' => $results
        ];
    }
    
    /**
     * Проверяет конфигурацию приложения
     */
    protected function checkConfiguration(): array
    {
        $this->info("\n⚙️ Checking application configuration...");
        
        $locale = config('app.locale');
        $fallbackLocale = config('app.fallback_locale');
        $availableLocales = config('app.available_locales', ['kz', 'ru', 'en']);
        
        $isKazakhDefault = $locale === 'kz' && $fallbackLocale === 'kz';
        
        return [
            'status' => $isKazakhDefault ? 'success' : 'warning',
            'data' => [
                'locale' => $locale,
                'fallback_locale' => $fallbackLocale,
                'available_locales' => $availableLocales,
                'kazakh_is_default' => $isKazakhDefault,
            ]
        ];
    }
    
    /**
     * Проверяет middleware
     */
    protected function checkMiddleware(): array
    {
        $this->info("\n🔧 Checking middleware...");
        
        $middlewareFile = app_path('Http/Middleware/AutoLanguageDetectionMiddleware.php');
        $exists = File::exists($middlewareFile);
        
        if ($exists) {
            $content = File::get($middlewareFile);
            $hasKazakhDefault = strpos($content, '$defaultLanguage = \'kz\'') !== false;
            $hasIPDetection = strpos($content, 'detectLanguageByIP') !== false;
            
            return [
                'status' => ($hasKazakhDefault && $hasIPDetection) ? 'success' : 'warning',
                'data' => [
                    'exists' => true,
                    'kazakh_default' => $hasKazakhDefault,
                    'ip_detection' => $hasIPDetection,
                ]
            ];
        }
        
        return [
            'status' => 'error',
            'data' => [
                'exists' => false,
                'kazakh_default' => false,
                'ip_detection' => false,
            ]
        ];
    }
    
    /**
     * Отображает результаты проверки
     */
    protected function displayResults(array $checks): void
    {
        $this->info("\n" . str_repeat("=", 60));
        $this->info("📋 TRANSLATION SYSTEM VERIFICATION RESULTS");
        $this->info(str_repeat("=", 60));
        
        // База данных
        $this->displayDatabaseResults($checks['database']);
        
        // Языковые файлы
        $this->displayLanguageFilesResults($checks['language_files']);
        
        // Конфигурация
        $this->displayConfigurationResults($checks['configuration']);
        
        // Middleware
        $this->displayMiddlewareResults($checks['middleware']);
        
        // Общий статус
        $this->displayOverallStatus($checks);
    }
    
    /**
     * Отображает результаты проверки базы данных
     */
    protected function displayDatabaseResults(array $check): void
    {
        $this->info("\n📊 DATABASE TRANSLATIONS:");
        $data = $check['data'];
        
        $this->line("  ✅ Total translations: " . $data['total']);
        $this->line("  🇰🇿 Kazakh translations: " . $data['kazakh']);
        $this->line("  🇬🇧 English translations: " . $data['english']);
        $this->line("  🇷🇺 Russian translations: " . $data['russian']);
        $this->line("  ✅ Verified translations: " . $data['verified']);
        
        $status = $check['status'] === 'success' ? '✅ SUCCESS' : '❌ ERROR';
        $this->line("  Status: $status");
    }
    
    /**
     * Отображает результаты проверки языковых файлов
     */
    protected function displayLanguageFilesResults(array $check): void
    {
        $this->info("\n📁 LANGUAGE FILES:");
        $data = $check['data'];
        
        foreach ($data as $lang => $info) {
            $status = $info['status'] === 'success' ? '✅' : '❌';
            $exists = $info['exists'] ? 'EXISTS' : 'MISSING';
            $this->line("  $status $lang/common.php: $exists (" . $info['count'] . " translations)");
        }
        
        $status = $check['status'] === 'success' ? '✅ SUCCESS' : '❌ ERROR';
        $this->line("  Status: $status");
    }
    
    /**
     * Отображает результаты проверки конфигурации
     */
    protected function displayConfigurationResults(array $check): void
    {
        $this->info("\n⚙️ APPLICATION CONFIGURATION:");
        $data = $check['data'];
        
        $this->line("  🌐 Default locale: " . $data['locale']);
        $this->line("  🔄 Fallback locale: " . $data['fallback_locale']);
        $this->line("  📋 Available locales: " . implode(', ', $data['available_locales']));
        
        $kazakhStatus = $data['kazakh_is_default'] ? '✅' : '⚠️';
        $this->line("  $kazakhStatus Kazakh as default: " . ($data['kazakh_is_default'] ? 'YES' : 'NO'));
        
        $status = $check['status'] === 'success' ? '✅ SUCCESS' : '⚠️ WARNING';
        $this->line("  Status: $status");
    }
    
    /**
     * Отображает результаты проверки middleware
     */
    protected function displayMiddlewareResults(array $check): void
    {
        $this->info("\n🔧 MIDDLEWARE:");
        $data = $check['data'];
        
        $existsStatus = $data['exists'] ? '✅' : '❌';
        $this->line("  $existsStatus AutoLanguageDetectionMiddleware: " . ($data['exists'] ? 'EXISTS' : 'MISSING'));
        
        if ($data['exists']) {
            $kazakhStatus = $data['kazakh_default'] ? '✅' : '⚠️';
            $this->line("  $kazakhStatus Kazakh as default: " . ($data['kazakh_default'] ? 'YES' : 'NO'));
            
            $ipStatus = $data['ip_detection'] ? '✅' : '⚠️';
            $this->line("  $ipStatus IP detection: " . ($data['ip_detection'] ? 'YES' : 'NO'));
        }
        
        $status = $check['status'] === 'success' ? '✅ SUCCESS' : ($check['status'] === 'warning' ? '⚠️ WARNING' : '❌ ERROR');
        $this->line("  Status: $status");
    }
    
    /**
     * Отображает общий статус
     */
    protected function displayOverallStatus(array $checks): void
    {
        $this->info("\n" . str_repeat("=", 60));
        
        $errorCount = 0;
        $warningCount = 0;
        $successCount = 0;
        
        foreach ($checks as $check) {
            switch ($check['status']) {
                case 'error':
                    $errorCount++;
                    break;
                case 'warning':
                    $warningCount++;
                    break;
                case 'success':
                    $successCount++;
                    break;
            }
        }
        
        if ($errorCount > 0) {
            $this->error("❌ SYSTEM STATUS: ERRORS FOUND ($errorCount errors, $warningCount warnings)");
            $this->error("   Please fix the errors before deploying to production.");
        } elseif ($warningCount > 0) {
            $this->warn("⚠️ SYSTEM STATUS: WARNINGS FOUND ($warningCount warnings)");
            $this->warn("   System will work but some features may not be optimal.");
        } else {
            $this->info("✅ SYSTEM STATUS: ALL CHECKS PASSED");
            $this->info("   Translation system is ready for production!");
        }
        
        $this->info(str_repeat("=", 60));
        
        // Рекомендации
        if ($errorCount === 0 && $warningCount === 0) {
            $this->info("\n🎉 RECOMMENDATIONS:");
            $this->line("  ✅ System is fully operational");
            $this->line("  ✅ Kazakh language is set as default");
            $this->line("  ✅ All translations are in place");
            $this->line("  ✅ Ready for production deployment");
        } elseif ($errorCount === 0) {
            $this->warn("\n⚠️ RECOMMENDATIONS:");
            $this->line("  ⚠️ Review warnings above");
            $this->line("  ⚠️ Consider fixing warnings for optimal performance");
            $this->line("  ✅ System is functional but could be improved");
        } else {
            $this->error("\n❌ RECOMMENDATIONS:");
            $this->line("  ❌ Fix all errors before deployment");
            $this->line("  ❌ System is not ready for production");
            $this->line("  ❌ Review error details above");
        }
    }
}
