const fs = require('fs');
const path = require('path');

// Список всех файлов, которые нужно исправить
const filesToFix = [
    // Страницы направлений (Direction)
    'resources/js/Pages/Direction/MedicalEducation.jsx',
    'resources/js/Pages/Direction/HumanResources.jsx',
    'resources/js/Pages/Direction/ElectronicHealth.jsx',
    'resources/js/Pages/Direction/MedicalAccreditation.jsx',
    'resources/js/Pages/Direction/HealthRate.jsx',
    'resources/js/Pages/Direction/ClinicalProtocols.jsx',
    'resources/js/Pages/Direction/MedicalScience.jsx',
    'resources/js/Pages/Direction/Bioethics.jsx',
    'resources/js/Pages/Direction/DrugPolicy.jsx',
    'resources/js/Pages/Direction/PrimaryHealthCare.jsx',
    'resources/js/Pages/Direction/HealthAccounts.jsx',
    'resources/js/Pages/Direction/CenterPrevention.jsx',
    'resources/js/Pages/Direction/TechCompetence.jsx',
    
    // Страницы услуг (Services)
    'resources/js/Pages/Services/Training.jsx',
    'resources/js/Pages/Services/MedicalExpertise.jsx',
    'resources/js/Pages/Services/HealthTechAssessment.jsx',
    'resources/js/Pages/Services/DrugExpertise.jsx',
    'resources/js/Pages/Services/AdsEvaluation.jsx',
    
    // Страницы новостей (News)
    'resources/js/Pages/News/Show.jsx',
    'resources/js/Pages/News/Index.jsx',
    
    // Страницы о центре (AboutCentre)
    'resources/js/Pages/AboutCentre/Vacancy.jsx',
    'resources/js/Pages/AboutCentre/Vacancies.jsx',
    'resources/js/Pages/AboutCentre/SalidatKairbekova.jsx',
    'resources/js/Pages/AboutCentre/Partners.jsx',
    'resources/js/Pages/AboutCentre/FAQ.jsx',
    'resources/js/Pages/AboutCentre/Contacts.jsx'
];

// Функция для исправления файла
function fixFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Файл не найден: ${filePath}`);
        return { success: false, error: 'File not found' };
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Проверяем, нужно ли исправление
        const hasLayout = content.includes('.layout =');
        const hasGlobalT = /const\s+t\s*=\s*\(.*\)\s*=>\s*\{[\s\S]*?window\.__INERTIA_PROPS__/.test(content);
        const usesTInLayout = hasLayout && /\.layout\s*=\s*.*t\(/.test(content);
        
        if (!hasLayout || hasGlobalT || !usesTInLayout) {
            return { success: false, error: 'No fix needed' };
        }

        // Шаг 1: Добавляем глобальную функцию t после импортов
        const lines = content.split('\n');
        const lastImportIndex = lines.findLastIndex(line => line.trim().startsWith('import'));
        
        if (lastImportIndex === -1) {
            return { success: false, error: 'No imports found' };
        }

        // Добавляем глобальную функцию t
        const globalTFunction = [
            '',
            '// Глобальная функция для получения перевода',
            'const t = (key, fallback = \'\') => {',
            '    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;',
            '};',
            ''
        ];
        
        lines.splice(lastImportIndex + 1, 0, ...globalTFunction);
        content = lines.join('\n');

        // Шаг 2: Заменяем локальную функцию t на tComponent
        content = content.replace(
            /const\s+t\s*=\s*\(.*?\)\s*=>\s*\{[\s\S]*?translations\?\.[^\}]*\|\|.*?\};/g,
            '// Функция для получения перевода внутри компонента\n    const tComponent = (key, fallback = \'\') => {\n        return translations?.[key] || fallback;\n    };'
        );

        // Шаг 3: Заменяем использование t внутри компонента на tComponent (но не в layout)
        // Разделяем файл на части
        const parts = content.split('export default function');
        if (parts.length > 1) {
            const beforeComponent = parts[0];
            const afterComponent = parts[1];
            
            // Находим конец компонента (до layout)
            const layoutIndex = afterComponent.indexOf('.layout =');
            if (layoutIndex !== -1) {
                const componentContent = afterComponent.substring(0, layoutIndex);
                const layoutContent = afterComponent.substring(layoutIndex);
                
                // Заменяем t на tComponent только в содержимом компонента
                const fixedComponentContent = componentContent.replace(/t\(/g, 'tComponent(');
                
                content = beforeComponent + 'export default function' + fixedComponentContent + layoutContent;
            } else {
                // Если layout не найден, заменяем во всем после export default function
                const fixedAfterComponent = afterComponent.replace(/t\(/g, 'tComponent(');
                content = beforeComponent + 'export default function' + fixedAfterComponent;
            }
        }

        // Записываем исправленный файл
        fs.writeFileSync(filePath, content, 'utf8');
        
        return { success: true, filePath };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Основная функция
function main() {
    console.log('🔧 Улучшенное автоматическое исправление файлов с ошибками const и функций t...\n');
    
    let successCount = 0;
    let errorCount = 0;
    const results = [];
    
    // Создаем папку для резервных копий
    const backupDir = './backups_improved_' + new Date().toISOString().replace(/[:.]/g, '-');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    
    console.log(`📁 Создана папка для резервных копий: ${backupDir}\n`);
    
    filesToFix.forEach((filePath, index) => {
        console.log(`[${index + 1}/${filesToFix.length}] Обработка: ${filePath}`);
        
        // Создаем резервную копию
        if (fs.existsSync(filePath)) {
            const backupPath = path.join(backupDir, path.basename(filePath) + '.backup');
            try {
                fs.copyFileSync(filePath, backupPath);
            } catch (error) {
                console.log(`   ⚠️ Не удалось создать резервную копию: ${error.message}`);
            }
        }
        
        // Исправляем файл
        const result = fixFile(filePath);
        
        if (result.success) {
            console.log(`   ✅ Исправлен: ${filePath}`);
            successCount++;
            results.push({ filePath, status: 'success' });
        } else {
            console.log(`   ❌ Ошибка: ${filePath} - ${result.error}`);
            errorCount++;
            results.push({ filePath, status: 'error', error: result.error });
        }
    });
    
    // Выводим итоговую статистику
    console.log('\n📊 Итоговая статистика:');
    console.log(`✅ Успешно исправлено: ${successCount}`);
    console.log(`❌ Ошибок: ${errorCount}`);
    console.log(`📁 Всего обработано: ${filesToFix.length}`);
    
    // Выводим список исправленных файлов
    if (successCount > 0) {
        console.log('\n✅ Успешно исправленные файлы:');
        results.filter(r => r.status === 'success').forEach(result => {
            console.log(`   - ${result.filePath}`);
        });
    }
    
    // Выводим список файлов с ошибками
    if (errorCount > 0) {
        console.log('\n❌ Файлы с ошибками:');
        results.filter(r => r.status === 'error').forEach(result => {
            console.log(`   - ${result.filePath}: ${result.error}`);
        });
    }
    
    console.log(`\n💾 Резервные копии сохранены в: ${backupDir}`);
    console.log('🔍 Проверьте исправленные файлы в браузере!');
    console.log('✅ Улучшенное автоматическое исправление завершено!');
}

// Запускаем исправление
main();
