<?php

/**
 * Скрипт для добавления детальных данных к сервисам в routes/web.php
 */

$routesFile = 'routes/web.php';
$content = file_get_contents($routesFile);

$json = file_get_contents('ai_services_full_catalog.json');
$data = json_decode($json, true);

// Функции для генерации данных
function generateDescription($name, $pathology, $modality, $area, $company) {
    $pathologyText = is_array($pathology) ? implode(', ', $pathology) : $pathology;
    $modalityText = is_array($modality) ? implode(', ', $modality) : $modality;
    $areaText = is_array($area) ? implode(', ', $area) : $area;
    
    return "Сервис {$name} предназначен для автоматического анализа {$modalityText} исследований {$areaText} с целью выявления признаков {$pathologyText}. Сервис разработан компанией {$company}.";
}

function generateAdvantages($pathology, $modality) {
    $pathologyText = is_array($pathology) ? $pathology[0] : $pathology;
    return [
        "Автоматическое выявление признаков {$pathologyText}",
        "Ускорение процесса анализа медицинских изображений",
        "Повышение точности диагностики"
    ];
}

function generatePurpose($pathology, $modality, $area) {
    $pathologyText = is_array($pathology) ? implode(', ', $pathology) : $pathology;
    $modalityText = is_array($modality) ? implode(', ', $modality) : $modality;
    $areaText = is_array($area) ? implode(', ', $area) : $area;
    
    return [
        "Автоматический анализ {$modalityText} исследований {$areaText} для выявления признаков {$pathologyText}"
    ];
}

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

function generateRisks() {
    return [
        'Сервис используется только в исследовательских целях',
        'Заключение ИИ-сервиса не является альтернативой заключения врача',
        'Обязательна проверка результатов врачом-рентгенологом'
    ];
}

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

function generateDiscontinuationReasons() {
    return [
        'В случае превышения % технологических дефектов установленному нормативным документам порогу',
        'По запросу медицинской организации'
    ];
}

// Функция для форматирования массива в PHP код
function formatArrayForPHP($array, $indent = 12) {
    $spaces = str_repeat(' ', $indent);
    $result = "[\n";
    
    if (array_values($array) === $array) {
        // Индексированный массив
        foreach ($array as $value) {
            if (is_string($value)) {
                $result .= $spaces . "    " . var_export($value, true) . ",\n";
            } elseif (is_array($value)) {
                $result .= $spaces . "    " . formatArrayForPHP($value, $indent + 4) . ",\n";
            }
        }
    } else {
        // Ассоциативный массив
        foreach ($array as $key => $value) {
            if (is_string($value)) {
                $result .= $spaces . "    '{$key}' => " . var_export($value, true) . ",\n";
            } elseif (is_array($value)) {
                $result .= $spaces . "    '{$key}' => " . formatArrayForPHP($value, $indent + 4) . ",\n";
            }
        }
    }
    
    $result .= $spaces . "]";
    return $result;
}

// Функция для форматирования validationTable
function formatValidationTable($table, $indent = 12) {
    $spaces = str_repeat(' ', $indent);
    $result = "[\n";
    $result .= $spaces . "    'providerLabel' => " . var_export($table['providerLabel'], true) . ",\n";
    $result .= $spaces . "    'standardLabel' => " . var_export($table['standardLabel'], true) . ",\n";
    $result .= $spaces . "    'rows' => [\n";
    
    foreach ($table['rows'] as $row) {
        $result .= $spaces . "        ['parameter' => " . var_export($row['parameter'], true) . ", ";
        $result .= "'providerValue' => " . var_export($row['providerValue'], true) . ", ";
        $result .= "'standardValue' => " . var_export($row['standardValue'], true) . "],\n";
    }
    
    $result .= $spaces . "    ]\n";
    $result .= $spaces . "]";
    return $result;
}

// Список сервисов, которые уже имеют детальную информацию
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

$updatedCount = 0;

// Обрабатываем каждый сервис из JSON
foreach ($data['services'] as $service) {
    // Преобразуем slug
    $slug = $service['slug'];
    if (preg_match('/[а-яёА-ЯЁ]/u', $slug)) {
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
    
    // Проверяем, есть ли уже детальные данные (проверяем наличие 'description')
    $pattern = "/'{$slug}'\s*=>\s*\[[^\]]*'description'/s";
    if (preg_match($pattern, $content)) {
        continue; // Уже есть детальные данные
    }
    
    // Ищем паттерн: 'slug' => [ ... 'company' => '...' ], - заменим ], на детальные данные перед ],
    // Используем более точный паттерн: находим закрывающую скобку после 'company'
    $pattern = "/('{$slug}'\s*=>\s*\[[^\]]*'company'\s*=>\s*[^,\]]+)(\s*\],)/s";
    
    if (preg_match($pattern, $content, $matches)) {
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
        
        // Форматируем детальные данные
        $details = ",\n            'description' => " . var_export($description, true) . ",\n";
        $details .= "            'briefInfo' => " . var_export($briefInfo, true) . ",\n";
        $details .= "            'advantages' => " . formatArrayForPHP($advantages) . ",\n";
        $details .= "            'purpose' => " . formatArrayForPHP($purpose) . ",\n";
        $details .= "            'effectiveness' => 'Сервис позволяет эффективно выявлять патологические изменения на медицинских изображениях.',\n";
        $details .= "            'validationTable' => " . formatValidationTable($validationTable) . ",\n";
        $details .= "            'risks' => " . formatArrayForPHP($risks) . ",\n";
        $details .= "            'limitations' => " . formatArrayForPHP($limitations) . ",\n";
        $details .= "            'discontinuationReasons' => " . formatArrayForPHP($discontinuationReasons) . "\n";
        
        // Заменяем в содержимом
        $replacement = $matches[1] . $details . $matches[2];
        $content = str_replace($matches[0], $replacement, $content);
        
        $updatedCount++;
        echo "Обновлен сервис: {$slug}\n";
    } else {
        // Попробуем альтернативный паттерн - может быть без запятой после company
        $pattern2 = "/('{$slug}'\s*=>\s*\[[^\]]*'company'\s*=>\s*[^\]\n]+)(\s*\],)/s";
        if (preg_match($pattern2, $content, $matches2)) {
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
            
            // Форматируем детальные данные
            $details = ",\n            'description' => " . var_export($description, true) . ",\n";
            $details .= "            'briefInfo' => " . var_export($briefInfo, true) . ",\n";
            $details .= "            'advantages' => " . formatArrayForPHP($advantages) . ",\n";
            $details .= "            'purpose' => " . formatArrayForPHP($purpose) . ",\n";
            $details .= "            'effectiveness' => 'Сервис позволяет эффективно выявлять патологические изменения на медицинских изображениях.',\n";
            $details .= "            'validationTable' => " . formatValidationTable($validationTable) . ",\n";
            $details .= "            'risks' => " . formatArrayForPHP($risks) . ",\n";
            $details .= "            'limitations' => " . formatArrayForPHP($limitations) . ",\n";
            $details .= "            'discontinuationReasons' => " . formatArrayForPHP($discontinuationReasons) . "\n";
            
            // Заменяем в содержимом
            $replacement = $matches2[1] . $details . $matches2[2];
            $content = str_replace($matches2[0], $replacement, $content);
            
            $updatedCount++;
            echo "Обновлен сервис (паттерн 2): {$slug}\n";
        } else {
            echo "Не найден паттерн для сервиса: {$slug}\n";
        }
    }
}

// Сохраняем обновленный файл
file_put_contents($routesFile, $content);

echo "\nГотово! Обновлено сервисов: {$updatedCount}\n";
