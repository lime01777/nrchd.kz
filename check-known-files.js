const fs = require('fs');
const path = require('path');

// Список файлов для проверки
const filesToCheck = [
    'resources/js/Pages/Direction/StrategicInitiatives.jsx',
    'resources/js/Pages/Direction/MedicalRating.jsx',
    'resources/js/Pages/Direction/MedicalEducation.jsx',
    'resources/js/Pages/Direction/HumanResources.jsx',
    'resources/js/Pages/Direction/ElectronicHealth.jsx',
    'resources/js/Pages/Direction/MedicalAccreditation.jsx',
    'resources/js/Pages/Direction/HealthRate.jsx',
    'resources/js/Pages/Direction/ClinicalProtocols.jsx',
    'resources/js/Pages/Direction/MedicalScience.jsx',
    'resources/js/Pages/Direction/Bioethics.jsx',
    'resources/js/Pages/Direction/DrugPolicy.jsx',
    'resources/js/Pages/Direction/PrimaryHealthcare.jsx',
    'resources/js/Pages/Direction/HealthAccounts.jsx',
    'resources/js/Pages/Direction/MedicalStatistics.jsx',
    'resources/js/Pages/Direction/DirectionTechCompetence.jsx',
    'resources/js/Pages/Direction/CenterPrevention.jsx',
    'resources/js/Pages/Direction/MedicalTourism.jsx',
    'resources/js/Pages/Direction/QualityCommission.jsx'
];

console.log('🔍 Проверка известных файлов на ошибки с const и функциями t...\n');

let totalIssues = 0;
const results = [];

filesToCheck.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const issues = [];
        
        // Проверяем на наличие layout функции
        const hasLayout = content.includes('.layout =');
        
        // Проверяем на наличие функции t внутри компонента
        const hasTFunction = /const\s+t\s*=\s*\(.*\)\s*=>/.test(content);
        
        // Проверяем на использование t в layout
        const usesTInLayout = hasLayout && /\.layout\s*=\s*.*t\(/.test(content);
        
        // Проверяем на наличие глобальной функции t
        const hasGlobalT = /const\s+t\s*=\s*\(.*\)\s*=>\s*\{[\s\S]*?window\.__INERTIA_PROPS__/.test(content);
        
        if (hasLayout && usesTInLayout && !hasGlobalT) {
            issues.push('❌ Функция t используется в layout, но не определена глобально');
        }
        
        if (hasTFunction && hasLayout) {
            issues.push('⚠️ Функция t определена внутри компонента - может вызвать проблемы с layout');
        }
        
        if (issues.length > 0) {
            results.push({
                file: filePath,
                issues: issues,
                hasLayout,
                hasTFunction,
                hasGlobalT,
                usesTInLayout
            });
            totalIssues += issues.length;
        }
    }
});

if (results.length === 0) {
    console.log('✅ Все проверенные файлы в порядке!');
} else {
    console.log(`❌ Найдено ${results.length} файлов с проблемами:\n`);
    
    results.forEach(result => {
        console.log(`📁 ${result.file}`);
        console.log(`   Layout: ${result.hasLayout ? '✅' : '❌'}`);
        console.log(`   Глобальная t: ${result.hasGlobalT ? '✅' : '❌'}`);
        console.log(`   Локальная t: ${result.hasTFunction ? '✅' : '❌'}`);
        console.log(`   Использование t в layout: ${result.usesTInLayout ? '✅' : '❌'}`);
        
        result.issues.forEach(issue => {
            console.log(`   ${issue}`);
        });
        console.log('');
    });
    
    console.log(`💡 Всего найдено ${totalIssues} проблем`);
    console.log('🔧 Для исправления используйте тот же подход, что и с MedicalRating.jsx');
}

console.log('✅ Проверка завершена!');
