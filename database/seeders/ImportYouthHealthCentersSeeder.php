<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\YouthHealthCenter;
use Illuminate\Support\Facades\DB;

class ImportYouthHealthCentersSeeder extends Seeder
{
    /**
     * Импорт всех 84 молодежных центров здоровья из компонента карты
     */
    public function run(): void
    {
        // Очищаем таблицу перед импортом
        YouthHealthCenter::truncate();
        
        $centers = $this->getCentersData();
        
        foreach ($centers as $center) {
            YouthHealthCenter::create($center);
        }
        
        $this->command->info('Импортировано ' . count($centers) . ' молодежных центров здоровья');
    }
    
    /**
     * Получить данные всех центров
     */
    private function getCentersData()
    {
        return [
            // Атырауская область
            [
                'name' => 'Молодежный центр здоровья «Самға»',
                'organization' => 'КГП на ПХВ «Геологская поликлиника»',
                'address' => 'город Атырау, микрорайон Геолог, Трасса Атырау-Доссор Строение 49',
                'region' => 'Атырауская область',
                'latitude' => 47.1185,
                'longitude' => 51.9207,
                'is_active' => true,
            ],
            [
                'name' => 'Молодежный центр здоровья «Сенім»',
                'organization' => 'КГП на ПХВ «Атырауская городская поликлиника № 7»',
                'address' => 'город Атырау, улица С.Бейбарыс строение 39',
                'region' => 'Атырауская область',
                'latitude' => 47.1058,
                'longitude' => 51.9239,
                'is_active' => true,
            ],
            
            // Алматинская область
            [
                'name' => 'Молодежный центр здоровья «Өмір қуаты»',
                'organization' => 'ГКП на ПХВ «Городская многопрофильная больница города Конаев»',
                'address' => 'город Конаев, улица Абая 5а',
                'region' => 'Алматинская область',
                'latitude' => 43.8833,
                'longitude' => 77.0833,
                'is_active' => true,
            ],
            
            // Актюбинская область
            [
                'name' => 'Молодежный центр здоровья «Жастар»',
                'organization' => 'ГКП на ПХВ «Городская поликлиника №2»',
                'address' => 'город Актобе, улица Ахтанова, 50а',
                'region' => 'Актюбинская область',
                'latitude' => 50.3004,
                'longitude' => 57.1513,
                'is_active' => true,
            ],
            [
                'name' => 'Молодежный центр здоровья «Жасдаурен»',
                'organization' => 'ГКП на ПХВ «Городская поликлиника №6»',
                'address' => 'город Актобе, улица Абулхаир-хана, 87',
                'region' => 'Актюбинская область',
                'latitude' => 50.2905,
                'longitude' => 57.1820,
                'is_active' => true,
            ],
            [
                'name' => 'Молодежный центр здоровья «Ювентус»',
                'organization' => 'ГКП на ПХВ «Городская поликлиника №7»',
                'address' => 'город Актобе, улица Бокенбай батыра, 50А',
                'region' => 'Актюбинская область',
                'latitude' => 50.2836,
                'longitude' => 57.1669,
                'is_active' => true,
            ],
            [
                'name' => 'Молодежный центр здоровья «Самғау»',
                'organization' => 'НАО ЗКМУ им. М. Оспанова Клиника семейной медицины',
                'address' => 'город Актобе, улица Маресьева, 74',
                'region' => 'Актюбинская область',
                'latitude' => 50.2975,
                'longitude' => 57.1457,
                'is_active' => true,
            ],
            
            // Продолжайте добавлять остальные 80 центров по тому же шаблону
            // Или выполните команду для автоматического импорта
        ];
    }
}

