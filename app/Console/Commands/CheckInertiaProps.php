<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CheckInertiaProps extends Command
{
    protected $signature = 'check:inertia-props';
    protected $description = 'Check how Inertia props are being passed';

    public function handle()
    {
        $this->info('🔍 Checking Inertia props...');
        
        // Симулируем запрос
        $request = \Illuminate\Http\Request::create('/kz', 'GET');
        
        // Устанавливаем локаль
        app()->setLocale('kz');
        
        // Проверяем переводы из базы данных
        if (Schema::hasTable('stored_translations')) {
            $translationsCount = DB::table('stored_translations')
                ->where('target_language', 'kz')
                ->count();
            
            $this->info('📊 Translation system status:');
            $this->info("Total translations in database for 'kz': {$translationsCount}");
            
            // Получаем несколько примеров
            $samples = DB::table('stored_translations')
                ->where('target_language', 'kz')
                ->limit(5)
                ->get(['original_text', 'translated_text']);
            
            $this->info('Sample translations:');
            foreach ($samples as $sample) {
                $original = mb_substr($sample->original_text, 0, 30);
                $translated = mb_substr($sample->translated_text, 0, 30);
                $this->info("  {$original} => {$translated}");
            }
        } else {
            $this->error('❌ Table stored_translations not found');
        }
        
        // Проверяем HandleInertiaRequests
        $this->info("\n🔧 Testing HandleInertiaRequests middleware...");
        
        try {
            $middleware = new \App\Http\Middleware\HandleInertiaRequests();
            $reflection = new \ReflectionClass($middleware);
            $method = $reflection->getMethod('share');
            $method->setAccessible(true);
            
            $props = $method->invoke($middleware, $request);
            
            $this->info('✅ Middleware executed successfully');
            $this->info('Props keys: ' . implode(', ', array_keys($props)));
            
            if (isset($props['translations'])) {
                $this->info('✅ Translations prop found');
                $this->info('Translations count: ' . count($props['translations']));
            } else {
                $this->error('❌ Translations prop NOT found');
            }
            
            if (isset($props['locale'])) {
                $this->info('✅ Locale prop found: ' . $props['locale']);
            } else {
                $this->error('❌ Locale prop NOT found');
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Error testing middleware: ' . $e->getMessage());
        }
        
        return 0;
    }
}
