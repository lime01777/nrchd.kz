<?php

/**
 * Прямое обновление routes/web.php - добавляем детальные данные к сервисам
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

function generateAdvantages($pathology) {
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
    
    // Проверяем, есть ли уже детальные данные
    if (strpos($content, "'{$slug}' => [") !== false) {
        $serviceStart = strpos($content, "'{$slug}' => [");
        $serviceEnd = strpos($content, "],", $serviceStart);
        if ($serviceEnd === false) {
            continue;
        }
        $serviceBlock = substr($content, $serviceStart, $serviceEnd - $serviceStart + 2);
        
        // Проверяем, есть ли уже 'description'
        if (strpos($serviceBlock, "'description'") !== false) {
            continue; // Уже есть детальные данные
        }
        
        // Генерируем данные
        $pathology = is_array($service['pathology']) ? $service['pathology'] : [$service['pathology']];
        $modality = is_array($service['modality']) ? $service['modality'] : [$service['modality']];
        $area = is_array($service['area']) ? $service['area'] : [$service['area']];
        
        $description = generateDescription($service['name'], $pathology, $modality, $area, $service['company']);
        $briefInfo = $description;
        $advantages = generateAdvantages($pathology);
        $purpose = generatePurpose($pathology, $modality, $area);
        $validationTable = generateValidationTable($pathology);
        $risks = generateRisks();
        $limitations = generateLimitations($modality);
        $discontinuationReasons = generateDiscontinuationReasons();
        
        // Находим последнюю строку перед закрывающей скобкой (обычно это 'company' => ...)
        $lines = explode("\n", $serviceBlock);
        $lastLineIndex = count($lines) - 1;
        
        // Находим индекс строки с 'company'
        $companyLineIndex = -1;
        for ($i = count($lines) - 1; $i >= 0; $i--) {
            if (strpos($lines[$i], "'company'") !== false) {
                $companyLineIndex = $i;
                break;
            }
        }
        
        if ($companyLineIndex >= 0) {
            // Формируем строки с детальными данными
            $details = ",\n            'description' => " . var_export($description, true) . ",\n";
            $details .= "            'briefInfo' => " . var_export($briefInfo, true) . ",\n";
            $details .= "            'advantages' => [\n";
            foreach ($advantages as $adv) {
                $details .= "                " . var_export($adv, true) . ",\n";
            }
            $details .= "            ],\n";
            $details .= "            'purpose' => [\n";
            foreach ($purpose as $purp) {
                $details .= "                " . var_export($purp, true) . ",\n";
            }
            $details .= "            ],\n";
            $details .= "            'effectiveness' => 'Сервис позволяет эффективно выявлять патологические изменения на медицинских изображениях.',\n";
            $details .= "            'validationTable' => [\n";
            $details .= "                'providerLabel' => " . var_export($validationTable['providerLabel'], true) . ",\n";
            $details .= "                'standardLabel' => " . var_export($validationTable['standardLabel'], true) . ",\n";
            $details .= "                'rows' => [\n";
            foreach ($validationTable['rows'] as $row) {
                $details .= "                    ['parameter' => " . var_export($row['parameter'], true) . ", ";
                $details .= "'providerValue' => " . var_export($row['providerValue'], true) . ", ";
                $details .= "'standardValue' => " . var_export($row['standardValue'], true) . "],\n";
            }
            $details .= "                ]\n";
            $details .= "            ],\n";
            $details .= "            'risks' => [\n";
            foreach ($risks as $risk) {
                $details .= "                " . var_export($risk, true) . ",\n";
            }
            $details .= "            ],\n";
            $details .= "            'limitations' => [\n";
            $details .= "                'demographic' => [],\n";
            $details .= "                'personal' => [\n";
            foreach ($limitations['personal'] as $pers) {
                $details .= "                    " . var_export($pers, true) . ",\n";
            }
            $details .= "                ],\n";
            $details .= "                'technical' => [\n";
            foreach ($limitations['technical'] as $tech) {
                $details .= "                    " . var_export($tech, true) . ",\n";
            }
            $details .= "                ]\n";
            $details .= "            ],\n";
            $details .= "            'discontinuationReasons' => [\n";
            foreach ($discontinuationReasons as $reason) {
                $details .= "                " . var_export($reason, true) . ",\n";
            }
            $details .= "            ]\n";
            
            // Вставляем детальные данные после строки с 'company'
            $newLines = [];
            for ($i = 0; $i <= $companyLineIndex; $i++) {
                $newLines[] = $lines[$i];
            }
            $newLines[] = $details;
            for ($i = $companyLineIndex + 1; $i < count($lines); $i++) {
                $newLines[] = $lines[$i];
            }
            
            $newServiceBlock = implode("\n", $newLines);
            $content = substr_replace($content, $newServiceBlock, $serviceStart, strlen($serviceBlock));
            
            $updatedCount++;
            echo "Обновлен сервис: {$slug}\n";
        }
    }
}

// Сохраняем обновленный файл
file_put_contents($routesFile, $content);

echo "\nГотово! Обновлено сервисов: {$updatedCount}\n";

