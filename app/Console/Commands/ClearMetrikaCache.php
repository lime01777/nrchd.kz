<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearMetrikaCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'metrika:clear-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Очищает кэш данных Яндекс.Метрики';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Очистка кэша Яндекс.Метрики...');
        
        if (Cache::forget('yandex_metrika_stats')) {
            $this->info('✅ Кэш успешно очищен');
        } else {
            $this->warn('⚠️ Кэш уже был пуст или не найден');
        }
        
        $this->info('При следующем запросе данные будут загружены заново из API');
    }
} 