<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use DOMDocument;
use DOMXPath;

/**
 * Команда для парсинга клиник, аккредитованных Joint Commission International (JCI) в Казахстане
 * 
 * Использование:
 * php artisan parse:jci-clinics
 */
class ParseJointCommissionClinics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'parse:jci-clinics {--save-json : Сохранить данные в JSON файл для последующего использования}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Парсит список клиник, аккредитованных Joint Commission International в Казахстане';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Начинаю парсинг клиник Joint Commission International в Казахстане...');
        
        $url = 'https://www.jointcommission.org/en/about-us/recognizing-excellence/find-accredited-international-organizations?rfkid_7:content_filters=country:eq:Kazakhstan&rfkid_7:content_page=1&rfkid_7:content_limit=100';
        
        try {
            // Попытка получить HTML
            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language' => 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                ])
                ->get($url);
            
            if (!$response->successful()) {
                $this->error("Ошибка при загрузке страницы: HTTP {$response->status()}");
                $this->warn('Сайт Joint Commission использует динамическую загрузку через JavaScript.');
                $this->warn('Рекомендуется вручную скопировать данные со страницы и добавить их в сидер MedicalTourismClinicsSeeder.');
                return Command::FAILURE;
            }
            
            $html = $response->body();
            
            // Парсим HTML
            libxml_use_internal_errors(true);
            $dom = new DOMDocument();
            @$dom->loadHTML('<?xml encoding="UTF-8">' . $html);
            libxml_clear_errors();
            
            $xpath = new DOMXPath($dom);
            
            // Пытаемся найти данные о клиниках
            // Примечание: структура сайта может изменяться, поэтому это базовая попытка
            $clinics = [];
            
            // Ищем элементы с информацией о клиниках
            // Это пример - реальные селекторы нужно определить после изучения HTML структуры сайта
            $items = $xpath->query("//div[contains(@class, 'organization')] | //div[contains(@class, 'clinic')] | //article");
            
            if ($items->length === 0) {
                $this->warn('Не удалось найти данные о клиниках в HTML. Возможно, данные загружаются динамически через JavaScript.');
                $this->warn('Рекомендуется:');
                $this->warn('1. Откройте страницу в браузере с отключенным JavaScript');
                $this->warn('2. Или используйте инструменты разработчика для просмотра сетевых запросов (Network tab)');
                $this->warn('3. Или вручную скопируйте данные и добавьте их в database/seeders/MedicalTourismClinicsSeeder.php');
                
                if ($this->option('save-json')) {
                    file_put_contents(storage_path('app/jci_clinics_raw.html'), $html);
                    $this->info('HTML страницы сохранен в: ' . storage_path('app/jci_clinics_raw.html'));
                }
                
                return Command::FAILURE;
            }
            
            $this->info("Найдено {$items->length} клиник");
            
            foreach ($items as $index => $item) {
                // Извлекаем данные из каждого элемента
                // Это пример - нужно адаптировать под реальную структуру сайта
                $nameNode = $xpath->query(".//h2 | .//h3 | .//span[contains(@class, 'name')]", $item)->item(0);
                $name = $nameNode ? trim($nameNode->textContent) : "Клиника #" . ($index + 1);
                
                $clinics[] = [
                    'name_en' => $name,
                    'name_ru' => $name, // Нужно перевести
                    'name_kk' => $name, // Нужно перевести
                ];
            }
            
            if ($this->option('save-json')) {
                $jsonFile = storage_path('app/jci_clinics_parsed.json');
                file_put_contents($jsonFile, json_encode($clinics, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                $this->info("Данные сохранены в: {$jsonFile}");
            }
            
            $this->info('Парсинг завершен!');
            $this->table(['Название'], array_map(fn($c) => [$c['name_en']], $clinics));
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            $this->error("Ошибка: {$e->getMessage()}");
            Log::error('Ошибка парсинга JCI клиник', ['error' => $e->getMessage()]);
            return Command::FAILURE;
        }
    }
}
