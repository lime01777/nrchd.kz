<?php
/**
 * Скрипт для исправления синтаксических ошибок в JSX файлах
 * Исправляет ошибку: const внутри параметров функции
 */

$filesToFix = [
    'resources/js/Pages/AboutCentre/Vacancy.jsx',
    'resources/js/Pages/Services/Training.jsx',
    'resources/js/Pages/Services/PostAccreditationMonitoring.jsx',
    'resources/js/Pages/Services/MedicalExpertise.jsx',
    'resources/js/Pages/Services/HealthTechAssessment.jsx',
    'resources/js/Pages/Services/EducationPrograms.jsx',
    'resources/js/Pages/Services/DrugExpertise.jsx',
    'resources/js/Pages/Services/AdsEvaluation.jsx',
    'resources/js/Pages/Services/Accreditation.jsx',
    'resources/js/Pages/News/Show.jsx',
    'resources/js/Pages/News/Index.jsx',
    'resources/js/Pages/Examples/TabDocumentsExample.jsx',
    'resources/js/Pages/Direction/TechCompetence.jsx',
    'resources/js/Pages/Direction/StrategicInitiatives.jsx',
    'resources/js/Pages/Direction/PrimaryHealthCare.jsx',
    'resources/js/Pages/Direction/NationalHealthAccounts.jsx',
    'resources/js/Pages/Direction/MedicalTourism.jsx',
    'resources/js/Pages/Direction/MedicalStatistics.jsx',
    'resources/js/Pages/Direction/MedicalScience.jsx',
    'resources/js/Pages/Direction/MedicalRating.jsx',
    'resources/js/Pages/Direction/MedicalOrganizationsRating.jsx',
    'resources/js/Pages/Direction/MedicalEducation.jsx',
    'resources/js/Pages/Direction/MedicalAccreditation.jsx',
    'resources/js/Pages/Direction/HumanResources.jsx',
    'resources/js/Pages/Direction/HealthRate.jsx',
    'resources/js/Pages/Direction/HealthAccounts.jsx',
    'resources/js/Pages/Direction/ElectronicHealth.jsx',
    'resources/js/Pages/Direction/DrugPolicy.jsx',
    'resources/js/Pages/Direction/ClinicalProtocols.jsx',
    'resources/js/Pages/Direction/CenterPrevention.jsx',
    'resources/js/Pages/Direction/Bioethics.jsx',
    'resources/js/Pages/Auth/ResetPassword.jsx',
    'resources/js/Pages/Auth/Register.jsx',
];

echo "=== Исправление синтаксических ошибок в JSX файлах ===\n\n";

$fixedCount = 0;
$errorCount = 0;

foreach ($filesToFix as $file) {
    if (!file_exists($file)) {
        echo "⚠️  Файл не найден: {$file}\n";
        $errorCount++;
        continue;
    }
    
    $content = file_get_contents($file);
    $originalContent = $content;
    
    // Проверяем, есть ли ошибка в файле
    if (preg_match('/export default function.*\(.*\n.*const.*usePage.*\n.*\n.*\{/', $content)) {
        echo "🔧 Исправляю: {$file}\n";
        
        // Исправляем импорт usePage
        if (!strpos($content, 'import {') || !strpos($content, 'usePage')) {
            // Добавляем usePage в импорт
            $content = preg_replace(
                '/import \{ ([^}]+) \} from \'@inertiajs\/react\';/',
                'import { $1, usePage } from \'@inertiajs/react\';',
                $content
            );
        }
        
        // Исправляем структуру функции
        $content = preg_replace(
            '/export default function (\w+)\(([^)]*)\)\s*\n\s*const \{ translations \} = usePage\(\)\.props;\s*\n\s*\/\/ Функция для получения перевода\s*\n\s*const t = \(key, fallback = \'\'\) => \{\s*\n\s*return translations\?\.[key\] \|\| fallback;\s*\n\s*\};/',
            'export default function $1($2) {\n    const { translations } = usePage().props;\n    \n    // Функция для получения перевода\n    const t = (key, fallback = \'\') => {\n        return translations?.[key] || fallback;\n    };',
            $content
        );
        
        // Если файл изменился, сохраняем его
        if ($content !== $originalContent) {
            file_put_contents($file, $content);
            echo "✅ Исправлен: {$file}\n";
            $fixedCount++;
        } else {
            echo "⚠️  Не удалось исправить: {$file}\n";
            $errorCount++;
        }
    } else {
        echo "✓ Уже исправлен: {$file}\n";
    }
}

echo "\n=== Результаты ===\n";
echo "Исправлено файлов: {$fixedCount}\n";
echo "Ошибок: {$errorCount}\n";
echo "Всего обработано: " . count($filesToFix) . "\n";

echo "\n=== Проверка сборки ===\n";
echo "Запускаю npm run build...\n";

// Запускаем сборку
$output = shell_exec('npm run build 2>&1');
echo $output;

if (strpos($output, 'Build failed') !== false) {
    echo "\n❌ Сборка не удалась. Возможно, есть еще ошибки.\n";
} else {
    echo "\n✅ Сборка прошла успешно!\n";
}
