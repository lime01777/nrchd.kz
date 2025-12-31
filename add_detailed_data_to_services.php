<?php

/**
 * Скрипт для добавления базовой структуры детальных данных для всех сервисов
 * Использует универсальные шаблоны на основе патологии и модальности
 */

$json = file_get_contents('ai_services_full_catalog.json');
$data = json_decode($json, true);

// Функция для генерации базового описания на основе патологии и модальности
function generateDescription($name, $pathology, $modality, $area, $company) {
    $pathologyText = is_array($pathology) ? implode(', ', $pathology) : $pathology;
    $modalityText = is_array($modality) ? implode(', ', $modality) : $modality;
    $areaText = is_array($area) ? implode(', ', $area) : $area;
    
    return "Сервис {$name} предназначен для автоматического анализа {$modalityText} исследований {$areaText} с целью выявления признаков {$pathologyText}. Сервис разработан компанией {$company}.";
}

// Функция для генерации базовых преимуществ
function generateAdvantages($pathology, $modality) {
    $pathologyText = is_array($pathology) ? $pathology[0] : $pathology;
    return [
        "Автоматическое выявление признаков {$pathologyText}",
        "Ускорение процесса анализа медицинских изображений",
        "Повышение точности диагностики"
    ];
}

// Функция для генерации базового назначения
function generatePurpose($pathology, $modality, $area) {
    $pathologyText = is_array($pathology) ? implode(', ', $pathology) : $pathology;
    $modalityText = is_array($modality) ? implode(', ', $modality) : $modality;
    $areaText = is_array($area) ? implode(', ', $area) : $area;
    
    return [
        "Автоматический анализ {$modalityText} исследований {$areaText} для выявления признаков {$pathologyText}"
    ];
}

// Функция для генерации базовой таблицы валидации
function generateValidationTable($pathology) {
    $pathologyText = is_array($pathology) ? implode(', ', $pathology) : $pathology;
    
    return [
        'providerLabel' => 'Валидация поставщика сервиса',
        'standardLabel' => 'Валидация на эталонном наборе данных',
        'rows' => [
            ['parameter' => 'Патология', 'providerValue' => $pathologyText, 'standardValue' => $pathologyText],
            ['parameter' => 'Точность', 'providerValue' => 'Данные будут добавлены', 'standardValue' => 'Данные будут добавлены']
        ]
    ];
}

// Функция для генерации базовых рисков
function generateRisks() {
    return [
        'Сервис используется только в исследовательских целях',
        'Заключение ИИ-сервиса не является альтернативой заключения врача',
        'Обязательна проверка результатов врачом-рентгенологом'
    ];
}

// Функция для генерации базовых ограничений
function generateLimitations($modality) {
    $modalityText = is_array($modality) ? $modality[0] : $modality;
    
    return [
        'demographic' => [],
        'personal' => [
            'Неанонимизированные данные (наличие ФИО пациента)'
        ],
        'technical' => [
            "Модальность исследования, отличающаяся от {$modalityText}",
            'Данные вне формата DICOM 3.0'
        ]
    ];
}

// Функция для генерации базовых причин прекращения
function generateDiscontinuationReasons() {
    return [
        'В случае превышения % технологических дефектов установленному нормативным документам порогу',
        'По запросу медицинской организации'
    ];
}

// Читаем routes/web.php
$routesFile = 'routes/web.php';
$content = file_get_contents($routesFile);

// Генерируем PHP код для каждого сервиса, который еще не имеет детальной информации
$phpCode = "\n        // Добавлена базовая структура детальных данных для сервисов\n";

$services = $data['services'];

// Список сервисов, которые уже имеют детальную информацию (полные данные)
$existingDetailedServices = [
    'trio-dm',
    'tsels-mmg',
    'prosvet-kt-ogk-covid',
    'prosvet-kt-ogk-tuberculosis',
    'prosvet-kt-brain-stroke',
    'prosvet-rg-spine-fractures',
    'prosvet-mri-brain-sclerosis',
    'prosvet-mmg-breast-cancer',
    'prosvet-kt-abd-kidney',
    'prosvet-rg-knee',
    'prosvet-kt-ogk-complex',
    'prosvet-rg-face-sinusitis',
    'prosvet-kt-abd-gallstones'
];

foreach ($services as $service) {
    // Преобразуем slug
    $slug = $service['slug'];
    if (preg_match('/[а-яёА-ЯЁ]/u', $slug)) {
        // Простая транслитерация
        $translit = [
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd',
            'е' => 'e', 'ё' => 'yo', 'ж' => 'zh', 'з' => 'z', 'и' => 'i',
            'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n',
            'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
            'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'ts', 'ч' => 'ch',
            'ш' => 'sh', 'щ' => 'sch', 'ъ' => '', 'ы' => 'y', 'ь' => '',
            'э' => 'e', 'ю' => 'yu', 'я' => 'ya',
        ];
        $slug = strtr(strtolower($slug), $translit);
        $slug = preg_replace('/[^a-z0-9-]/i', '', $slug);
    }
    $slug = preg_replace('/[\s_]+/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');
    
    // Пропускаем сервисы, которые уже имеют детальную информацию
    if (in_array($slug, $existingDetailedServices)) {
        continue;
    }
    
    // Генерируем данные
    $pathology = is_array($service['pathology']) ? $service['pathology'] : [$service['pathology']];
    $modality = is_array($service['modality']) ? $service['modality'] : [$service['modality']];
    $area = is_array($service['area']) ? $service['area'] : [$service['area']];
    
    $description = generateDescription($service['name'], $pathology, $modality, $area, $service['company']);
    $briefInfo = $description;
    $advantages = generateAdvantages($pathology, $modality);
    $purpose = generatePurpose($pathology, $modality, $area);
    $validationTable = generateValidationTable($pathology);
    $risks = generateRisks();
    $limitations = generateLimitations($modality);
    $discontinuationReasons = generateDiscontinuationReasons();
    
    // Форматируем данные для PHP
    $slugEscaped = var_export($slug, true);
    $descriptionEscaped = var_export($description, true);
    $briefInfoEscaped = var_export($briefInfo, true);
    $advantagesEscaped = var_export($advantages, true);
    $purposeEscaped = var_export($purpose, true);
    $risksEscaped = var_export($risks, true);
    $limitationsEscaped = var_export($limitations, true);
    $discontinuationReasonsEscaped = var_export($discontinuationReasons, true);
    
    // Форматируем validationTable вручную
    $validationTableStr = "[\n                'providerLabel' => " . var_export($validationTable['providerLabel'], true) . ",\n";
    $validationTableStr .= "                'standardLabel' => " . var_export($validationTable['standardLabel'], true) . ",\n";
    $validationTableStr .= "                'rows' => [\n";
    foreach ($validationTable['rows'] as $row) {
        $validationTableStr .= "                    ['parameter' => " . var_export($row['parameter'], true) . ", ";
        $validationTableStr .= "'providerValue' => " . var_export($row['providerValue'], true) . ", ";
        $validationTableStr .= "'standardValue' => " . var_export($row['standardValue'], true) . "],\n";
    }
    $validationTableStr .= "                ]\n            ]";
    
    $phpCode .= "        // Обновление: {$slugEscaped}\n";
    $phpCode .= "        // Найти в файле строку: '{$slugEscaped}' => [\n";
    $phpCode .= "        // И добавить после 'company' => ... следующие поля:\n";
    $phpCode .= "            'description' => {$descriptionEscaped},\n";
    $phpCode .= "            'briefInfo' => {$briefInfoEscaped},\n";
    $phpCode .= "            'advantages' => {$advantagesEscaped},\n";
    $phpCode .= "            'purpose' => {$purposeEscaped},\n";
    $phpCode .= "            'effectiveness' => 'Сервис позволяет эффективно выявлять патологические изменения на медицинских изображениях.',\n";
    $phpCode .= "            'validationTable' => {$validationTableStr},\n";
    $phpCode .= "            'risks' => {$risksEscaped},\n";
    $phpCode .= "            'limitations' => {$limitationsEscaped},\n";
    $phpCode .= "            'discontinuationReasons' => {$discontinuationReasonsEscaped},\n\n";
}

// Записываем в файл
file_put_contents('detailed_data_template.php', $phpCode);

echo "Скрипт завершен! Сгенерирован файл detailed_data_template.php с шаблонами данных.\n";
echo "Всего обработано сервисов: " . count($services) . "\n";

