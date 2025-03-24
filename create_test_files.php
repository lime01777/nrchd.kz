<?php

// Создаем директории, если они еще не существуют
$directories = [
    'storage/app/public/documents/научно-медицинская-экспертиза',
    'storage/app/public/documents/повышение-квалификации',
    'storage/app/public/documents/нормативные-документы'
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
        echo "Создана директория: $dir\n";
    } else {
        echo "Директория уже существует: $dir\n";
    }
}

// Создаем тестовые файлы
$files = [
    [
        'path' => 'storage/app/public/documents/научно-медицинская-экспертиза/приказ-о-научно-медицинской-экспертизе.pdf',
        'content' => 'Тестовый PDF файл - Приказ о научно-медицинской экспертизе'
    ],
    [
        'path' => 'storage/app/public/documents/научно-медицинская-экспертиза/методические-рекомендации.doc',
        'content' => 'Тестовый DOC файл - Методические рекомендации по оформлению НМР'
    ],
    [
        'path' => 'storage/app/public/documents/повышение-квалификации/программа-обучения.pdf',
        'content' => 'Тестовый PDF файл - Программа обучения для повышения квалификации'
    ],
    [
        'path' => 'storage/app/public/documents/повышение-квалификации/расписание-занятий.xlsx',
        'content' => 'Тестовый XLSX файл - Расписание занятий'
    ],
    [
        'path' => 'storage/app/public/documents/нормативные-документы/положение-о-центре.pdf',
        'content' => 'Тестовый PDF файл - Положение о центре'
    ],
    [
        'path' => 'storage/app/public/documents/нормативные-документы/правила-внутреннего-распорядка.doc',
        'content' => 'Тестовый DOC файл - Правила внутреннего распорядка'
    ]
];

foreach ($files as $file) {
    file_put_contents($file['path'], $file['content']);
    echo "Создан файл: {$file['path']}\n";
}

echo "Все тестовые файлы успешно созданы!\n";
