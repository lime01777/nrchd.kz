<?php

require_once 'vendor/autoload.php';

// Загружаем Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Inertia\Inertia;

// Моковые данные для тестирования
$mockApplications = [
    [
        'id' => 1,
        'application_id' => 'OT3-2025-0001',
        'title' => 'Тестовая заявка ОТЗ 1',
        'category' => 'Комплексная',
        'current_stage' => 'Подача заявки',
        'description' => 'Описание тестовой заявки 1',
        'responsible_person' => 'Иванов И.И.',
        'phone' => '+7 777 123 45 67',
        'email' => 'test1@example.com',
        'stage_start_date' => '2025-01-01',
        'stage_end_date' => '2025-01-31',
        'is_active' => true
    ],
    [
        'id' => 2,
        'application_id' => 'OT3-2025-0002',
        'title' => 'Тестовая заявка ОТЗ 2',
        'category' => 'Простая',
        'current_stage' => 'Проверка документов',
        'description' => 'Описание тестовой заявки 2',
        'responsible_person' => 'Петров П.П.',
        'phone' => '+7 777 234 56 78',
        'email' => 'test2@example.com',
        'stage_start_date' => '2025-02-01',
        'stage_end_date' => '2025-02-28',
        'is_active' => true
    ]
];

$categories = ['Комплексная', 'Простая'];
$stages = [
    'Подача заявки',
    'Проверка документов',
    'Проведение ОТЗ',
    'Рассмотрение комиссиями',
    'Бюджетное одобрение',
    'Формирование тарифов'
];

echo "=== Тестирование страницы отчетов ОТЗ ===\n";
echo "Количество тестовых заявок: " . count($mockApplications) . "\n";
echo "Категории: " . implode(', ', $categories) . "\n";
echo "Этапы: " . implode(', ', $stages) . "\n";

// Проверяем, что роут существует
try {
    $route = route('health.rate.otz.reports');
    echo "Роут health.rate.otz.reports: {$route}\n";
} catch (Exception $e) {
    echo "Ошибка с роутом: " . $e->getMessage() . "\n";
}

// Проверяем родительский роут
try {
    $parentRoute = route('health.rate');
    echo "Родительский роут health.rate: {$parentRoute}\n";
} catch (Exception $e) {
    echo "Ошибка с родительским роутом: " . $e->getMessage() . "\n";
}

echo "\n=== Тест завершен ===\n";
