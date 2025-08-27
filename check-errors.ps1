# Скрипт для проверки ошибок с const и функциями t в JSX файлах

Write-Host "🔍 Проверка файлов на ошибки с const и функциями t..." -ForegroundColor Green
Write-Host ""

# Функция для поиска всех JSX файлов
function Get-JSXFiles {
    param([string]$Path)
    
    $files = @()
    Get-ChildItem -Path $Path -Recurse -Include "*.jsx", "*.js" | ForEach-Object {
        # Пропускаем системные папки
        if ($_.FullName -notmatch "node_modules|\.git|vendor|storage|bootstrap") {
            $files += $_.FullName
        }
    }
    return $files
}

# Функция для проверки файла
function Test-FileForErrors {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    $lines = Get-Content $FilePath -Encoding UTF8
    $issues = @()
    
    # Проверяем на наличие layout функции
    $hasLayout = $content -match "\.layout\s*="
    
    # Проверяем на наличие функции t внутри компонента
    $hasTFunction = $content -match "const\s+t\s*=\s*\("
    
    # Проверяем на использование t в layout
    $usesTInLayout = $hasLayout -and ($content -match "\.layout\s*=\s*.*t\(")
    
    # Проверяем на наличие глобальной функции t
    $hasGlobalT = $content -match "const\s+t\s*=\s*\(.*\)\s*=>\s*\{[\s\S]*?window\.__INERTIA_PROPS__"
    
    # Проверяем на использование t вне компонента
    $usesTOutsideComponent = $content -match "t\("
    
    # Проверяем на наличие export default function
    $hasExportDefault = $content -match "export\s+default\s+function"
    
    # Анализируем каждую строку
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        $lineNumber = $i + 1
        
        # Проверяем на использование t в layout функции
        if ($line -match "\.layout\s*=" -and $line -match "t\(" -and -not $hasGlobalT) {
            $issues += [PSCustomObject]@{
                Line = $lineNumber
                Type = "ERROR"
                Message = "Функция t используется в layout, но не определена глобально"
                Code = $line.Trim()
            }
        }
        
        # Проверяем на определение t внутри компонента
        if ($line -match "const\s+t\s*=" -and $hasExportDefault) {
            $issues += [PSCustomObject]@{
                Line = $lineNumber
                Type = "WARNING"
                Message = "Функция t определена внутри компонента - может вызвать проблемы с layout"
                Code = $line.Trim()
            }
        }
        
        # Проверяем на использование t без определения
        if ($line -match "t\(" -and -not $hasTFunction -and -not $hasGlobalT -and $line -notmatch "//") {
            $issues += [PSCustomObject]@{
                Line = $lineNumber
                Type = "ERROR"
                Message = "Функция t используется, но не определена"
                Code = $line.Trim()
            }
        }
    }
    
    # Проверяем общую структуру файла
    if ($hasLayout -and -not $hasGlobalT -and $usesTOutsideComponent) {
        $issues += [PSCustomObject]@{
            Line = "GLOBAL"
            Type = "ERROR"
            Message = "Файл имеет layout функцию и использует t, но глобальная функция t не определена"
            Code = "Нужно добавить глобальную функцию t"
        }
    }
    
    return [PSCustomObject]@{
        FilePath = $FilePath
        Issues = $issues
        HasLayout = $hasLayout
        HasTFunction = $hasTFunction
        HasGlobalT = $hasGlobalT
        UsesTInLayout = $usesTInLayout
    }
}

# Основная логика
$jsxFiles = Get-JSXFiles ".\resources\js"
$results = @()

Write-Host "📁 Найдено $($jsxFiles.Count) JSX файлов для проверки" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $jsxFiles) {
    $result = Test-FileForErrors $file
    if ($result.Issues.Count -gt 0) {
        $results += $result
    }
}

# Выводим результаты
if ($results.Count -eq 0) {
    Write-Host "✅ Все файлы проверены. Ошибок не найдено!" -ForegroundColor Green
    exit
}

Write-Host "❌ Найдено $($results.Count) файлов с проблемами:" -ForegroundColor Red
Write-Host ""

foreach ($result in $results) {
    $relativePath = $result.FilePath.Replace((Get-Location).Path + "\", "")
    Write-Host "📁 $relativePath" -ForegroundColor Cyan
    Write-Host "   Layout: $(if ($result.HasLayout) { '✅' } else { '❌' })"
    Write-Host "   Глобальная t: $(if ($result.HasGlobalT) { '✅' } else { '❌' })"
    Write-Host "   Локальная t: $(if ($result.HasTFunction) { '✅' } else { '❌' })"
    Write-Host "   Использование t в layout: $(if ($result.UsesTInLayout) { '✅' } else { '❌' })"
    
    foreach ($issue in $result.Issues) {
        $icon = if ($issue.Type -eq "ERROR") { "❌" } else { "⚠️" }
        Write-Host "   $icon Строка $($issue.Line): $($issue.Message)" -ForegroundColor $(if ($issue.Type -eq "ERROR") { "Red" } else { "Yellow" })
        if ($issue.Code -and $issue.Code -ne "Нужно добавить глобальную функцию t") {
            Write-Host "      Код: $($issue.Code)" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# Показываем файлы, которые можно исправить автоматически
$fixableFiles = $results | Where-Object { $_.HasLayout -and $_.UsesTInLayout -and -not $_.HasGlobalT }

if ($fixableFiles.Count -gt 0) {
    Write-Host "🔧 Файлы, которые можно исправить автоматически:" -ForegroundColor Green
    foreach ($file in $fixableFiles) {
        $relativePath = $file.FilePath.Replace((Get-Location).Path + "\", "")
        Write-Host "   - $relativePath" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "💡 Для автоматического исправления используйте скрипт fix-errors.ps1" -ForegroundColor Blue
}

Write-Host "✅ Проверка завершена!" -ForegroundColor Green
