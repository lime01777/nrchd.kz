const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска файлов
function findFiles(dir, extensions = ['.jsx', '.js']) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
            // Пропускаем node_modules и другие системные папки
            if (!['node_modules', '.git', 'vendor', 'storage', 'bootstrap'].includes(file)) {
                results = results.concat(findFiles(filePath, extensions));
            }
        } else {
            const ext = path.extname(file);
            if (extensions.includes(ext)) {
                results.push(filePath);
            }
        }
    });
    
    return results;
}

// Функция для проверки файла на ошибки
function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    // Проверяем на наличие layout функции
    const hasLayout = content.includes('.layout =');
    
    // Проверяем на наличие функции t внутри компонента
    const hasTFunction = /const\s+t\s*=\s*\(.*\)\s*=>/.test(content);
    
    // Проверяем на использование t в layout
    const usesTInLayout = hasLayout && /\.layout\s*=\s*.*t\(/.test(content);
    
    // Проверяем на наличие глобальной функции t
    const hasGlobalT = /const\s+t\s*=\s*\(.*\)\s*=>\s*\{[\s\S]*?window\.__INERTIA_PROPS__/.test(content);
    
    // Проверяем на использование t вне компонента
    const usesTOutsideComponent = /t\(/g.test(content);
    
    // Проверяем на наличие export default function
    const hasExportDefault = /export\s+default\s+function/.test(content);
    
    // Проверяем на наличие usePage
    const hasUsePage = /usePage\(\)/.test(content);
    
    // Проверяем на наличие window.__INERTIA_PROPS__
    const hasInertiaProps = /window\.__INERTIA_PROPS__/.test(content);
    
    // Анализируем каждую строку
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        
        // Проверяем на использование t в layout функции
        if (line.includes('.layout =') && line.includes('t(') && !hasGlobalT) {
            issues.push({
                line: lineNumber,
                type: 'ERROR',
                message: 'Функция t используется в layout, но не определена глобально',
                code: line.trim()
            });
        }
        
        // Проверяем на определение t внутри компонента
        if (line.includes('const t =') && hasExportDefault) {
            issues.push({
                line: lineNumber,
                type: 'WARNING',
                message: 'Функция t определена внутри компонента - может вызвать проблемы с layout',
                code: line.trim()
            });
        }
        
        // Проверяем на использование t без определения
        if (line.includes('t(') && !hasTFunction && !hasGlobalT && !line.includes('//')) {
            issues.push({
                line: lineNumber,
                type: 'ERROR',
                message: 'Функция t используется, но не определена',
                code: line.trim()
            });
        }
    });
    
    // Проверяем общую структуру файла
    if (hasLayout && !hasGlobalT && usesTOutsideComponent) {
        issues.push({
            line: 'GLOBAL',
            type: 'ERROR',
            message: 'Файл имеет layout функцию и использует t, но глобальная функция t не определена',
            code: 'Нужно добавить глобальную функцию t'
        });
    }
    
    return {
        filePath,
        issues,
        hasLayout,
        hasTFunction,
        hasGlobalT,
        usesTInLayout
    };
}

// Функция для исправления файла
function fixFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let newContent = content;
    let fixed = false;
    
    // Проверяем, нужно ли исправление
    const hasLayout = content.includes('.layout =');
    const hasGlobalT = /const\s+t\s*=\s*\(.*\)\s*=>\s*\{[\s\S]*?window\.__INERTIA_PROPS__/.test(content);
    const usesTInLayout = hasLayout && /\.layout\s*=\s*.*t\(/.test(content);
    
    if (hasLayout && usesTInLayout && !hasGlobalT) {
        // Находим импорты
        const importIndex = lines.findIndex(line => line.startsWith('import'));
        const lastImportIndex = lines.findLastIndex(line => line.startsWith('import'));
        
        // Находим export default function
        const exportIndex = lines.findIndex(line => line.includes('export default function'));
        
        if (importIndex !== -1 && exportIndex !== -1) {
            // Добавляем глобальную функцию t после импортов
            const globalTFunction = `
// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};`;
            
            // Вставляем глобальную функцию после импортов
            lines.splice(lastImportIndex + 1, 0, globalTFunction);
            
            // Заменяем локальную функцию t на tComponent
            newContent = lines.join('\n');
            newContent = newContent.replace(
                /const\s+t\s*=\s*\(.*?\)\s*=>\s*\{[\s\S]*?translations\?\.[^\}]*\|\|.*?\};/g,
                '// Функция для получения перевода внутри компонента\n    const tComponent = (key, fallback = \'\') => {\n        return translations?.[key] || fallback;\n    };'
            );
            
            // Заменяем использование t внутри компонента на tComponent
            newContent = newContent.replace(
                /(?<!\.layout\s*=.*)t\(/g,
                'tComponent('
            );
            
            fixed = true;
        }
    }
    
    return { fixed, newContent };
}

// Основная функция
function main() {
    console.log('🔍 Проверка файлов на ошибки с const и функциями t...\n');
    
    const jsxFiles = findFiles('./resources/js', ['.jsx', '.js']);
    const results = [];
    const fixedFiles = [];
    
    jsxFiles.forEach(filePath => {
        const result = checkFile(filePath);
        if (result.issues.length > 0) {
            results.push(result);
        }
    });
    
    // Выводим результаты
    if (results.length === 0) {
        console.log('✅ Все файлы проверены. Ошибок не найдено!');
        return;
    }
    
    console.log(`❌ Найдено ${results.length} файлов с проблемами:\n`);
    
    results.forEach(result => {
        console.log(`📁 ${result.filePath}`);
        console.log(`   Layout: ${result.hasLayout ? '✅' : '❌'}`);
        console.log(`   Глобальная t: ${result.hasGlobalT ? '✅' : '❌'}`);
        console.log(`   Локальная t: ${result.hasTFunction ? '✅' : '❌'}`);
        console.log(`   Использование t в layout: ${result.usesTInLayout ? '✅' : '❌'}`);
        
        result.issues.forEach(issue => {
            const icon = issue.type === 'ERROR' ? '❌' : '⚠️';
            console.log(`   ${icon} Строка ${issue.line}: ${issue.message}`);
            if (issue.code && issue.code !== 'Нужно добавить глобальную функцию t') {
                console.log(`      Код: ${issue.code}`);
            }
        });
        console.log('');
    });
    
    // Предлагаем автоматическое исправление
    console.log('🔧 Хотите автоматически исправить найденные проблемы? (y/n)');
    
    // В реальном использовании здесь был бы readline для интерактивности
    // Для демонстрации просто показываем, что можно исправить
    console.log('\n📝 Файлы, которые можно исправить автоматически:');
    results.forEach(result => {
        if (result.hasLayout && result.usesTInLayout && !result.hasGlobalT) {
            console.log(`   - ${result.filePath}`);
            const fixResult = fixFile(result.filePath);
            if (fixResult.fixed) {
                console.log(`     ✅ Может быть исправлен автоматически`);
                fixedFiles.push({ filePath: result.filePath, newContent: fixResult.newContent });
            }
        }
    });
    
    if (fixedFiles.length > 0) {
        console.log(`\n💾 Для применения исправлений раскомментируйте строки в скрипте`);
        fixedFiles.forEach(file => {
            console.log(`\n// Исправление для ${file.filePath}:`);
            console.log(`fs.writeFileSync('${file.filePath}', \`${file.newContent.replace(/`/g, '\\`')}\`);`);
        });
    }
}

// Запускаем проверку
main();
