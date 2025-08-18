<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TranslationService;

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
        
        // Получаем переводы
        $translations = TranslationService::getForPage('/', 'kz');
        
        $this->info('📊 TranslationService results:');
        $this->info('Total translations: ' . count($translations));
        
        // Показываем несколько примеров
        $this->info('Sample translations:');
        $sampleKeys = ['home', 'about', 'news', 'directions', 'services'];
        foreach ($sampleKeys as $key) {
            $value = $translations[$key] ?? 'NOT FOUND';
            $this->info("  {$key}: {$value}");
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
