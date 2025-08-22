<?php

require_once 'vendor/autoload.php';

// Загружаем Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\OtzApplication;

echo "=== Проверка данных ОТЗ ===\n";

// Проверяем количество записей
$count = OtzApplication::count();
echo "Всего записей в таблице otz_applications: {$count}\n";

// Проверяем активные записи
$activeCount = OtzApplication::where('is_active', true)->count();
echo "Активных записей: {$activeCount}\n";

if ($activeCount > 0) {
    echo "\n=== Примеры активных записей ===\n";
    $applications = OtzApplication::where('is_active', true)->take(3)->get();
    
    foreach ($applications as $app) {
        echo "ID: {$app->id}\n";
        echo "Application ID: {$app->application_id}\n";
        echo "Title: {$app->title}\n";
        echo "Category: {$app->category}\n";
        echo "Current Stage: {$app->current_stage}\n";
        echo "Is Active: " . ($app->is_active ? 'Yes' : 'No') . "\n";
        echo "---\n";
    }
} else {
    echo "\nНет активных записей. Создаем тестовые данные...\n";
    
    // Создаем тестовые данные
    $testData = [
        [
            'title' => 'Тестовая заявка ОТЗ 1',
            'category' => 'Комплексная',
            'current_stage' => 'Подача заявки',
            'description' => 'Описание тестовой заявки 1',
            'responsible_person' => 'Иванов И.И.',
            'phone' => '+7 777 123 45 67',
            'email' => 'test1@example.com',
            'is_active' => true
        ],
        [
            'title' => 'Тестовая заявка ОТЗ 2',
            'category' => 'Простая',
            'current_stage' => 'Проверка документов',
            'description' => 'Описание тестовой заявки 2',
            'responsible_person' => 'Петров П.П.',
            'phone' => '+7 777 234 56 78',
            'email' => 'test2@example.com',
            'is_active' => true
        ],
        [
            'title' => 'Тестовая заявка ОТЗ 3',
            'category' => 'Комплексная',
            'current_stage' => 'Проведение ОТЗ',
            'description' => 'Описание тестовой заявки 3',
            'responsible_person' => 'Сидоров С.С.',
            'phone' => '+7 777 345 67 89',
            'email' => 'test3@example.com',
            'is_active' => true
        ]
    ];
    
    foreach ($testData as $data) {
        $application = OtzApplication::create($data);
        echo "Создана заявка: {$application->application_id} - {$application->title}\n";
    }
    
    echo "\nТестовые данные созданы!\n";
}

echo "\n=== Проверка методов модели ===\n";
echo "Категории: " . implode(', ', OtzApplication::getCategories()) . "\n";
echo "Этапы: " . implode(', ', OtzApplication::getStages()) . "\n";
