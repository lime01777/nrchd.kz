# Скрипт для автоматического исправления файлов с ошибками const и функций t

Write-Host "🔧 Автоматическое исправление файлов с ошибками const и функций t..." -ForegroundColor Green
Write-Host ""

# Список всех файлов, которые нужно исправить
$filesToFix = @(
    # Страницы направлений (Direction)
    "resources\js\Pages\Direction\MedicalEducation.jsx",
    "resources\js\Pages\Direction\HumanResources.jsx",
    "resources\js\Pages\Direction\ElectronicHealth.jsx",
    "resources\js\Pages\Direction\MedicalAccreditation.jsx",
    "resources\js\Pages\Direction\HealthRate.jsx",
    "resources\js\Pages\Direction\ClinicalProtocols.jsx",
    "resources\js\Pages\Direction\MedicalScience.jsx",
    "resources\js\Pages\Direction\Bioethics.jsx",
    "resources\js\Pages\Direction\DrugPolicy.jsx",
    "resources\js\Pages\Direction\PrimaryHealthCare.jsx",
    "resources\js\Pages\Direction\HealthAccounts.jsx",
    "resources\js\Pages\Direction\CenterPrevention.jsx",
    "resources\js\Pages\Direction\TechCompetence.jsx",
    
    # Страницы услуг (Services)
    "resources\js\Pages\Services\Training.jsx",
    "resources\js\Pages\Services\MedicalExpertise.jsx",
    "resources\js\Pages\Services\HealthTechAssessment.jsx",
    "resources\js\Pages\Services\DrugExpertise.jsx",
    "resources\js\Pages\Services\AdsEvaluation.jsx",
    
    # Страницы новостей (News)
    "resources\js\Pages\News\Show.jsx",
    "resources\js\Pages\News\Index.jsx",
    
    # Страницы о центре (AboutCentre)
    "resources\js\Pages\AboutCentre\Vacancy.jsx",
    "resources\js\Pages\AboutCentre\Vacancies.jsx",
    "resources\js\Pages\AboutCentre\SalidatKairbekova.jsx",
    "resources\js\Pages\AboutCentre\Partners.jsx",
    "resources\js\Pages\AboutCentre\FAQ.jsx",
    "resources\js\Pages\AboutCentre\Contacts.jsx"
)

# Функция для исправления файла
function Fix-File {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ Файл не найден: $FilePath" -ForegroundColor Red
        return @{ Success = $false; Error = "File not found" }
    }
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        $lines = Get-Content $FilePath -Encoding UTF8
        
        # Проверяем, нужно ли исправление
        $hasLayout = $content -match "\.layout\s*="
        $hasGlobalT = $content -match "const\s+t\s*=\s*\(.*\)\s*=>\s*\{[\s\S]*?window\.__INERTIA_PROPS__"
        $usesTInLayout = $hasLayout -and ($content -match "\.layout\s*=\s*.*t\(")
        
        if (-not $hasLayout -or $hasGlobalT -or -not $usesTInLayout) {
            return @{ Success = $false; Error = "No fix needed" }
        }
        
        # Находим последний импорт
        $lastImportIndex = -1
        for ($i = $lines.Count - 1; $i -ge 0; $i--) {
            if ($lines[$i].Trim().StartsWith("import")) {
                $lastImportIndex = $i
                break
            }
        }
        
        if ($lastImportIndex -eq -1) {
            return @{ Success = $false; Error = "No imports found" }
        }
        
        # Создаем новое содержимое
        $newLines = @($lines)
        
        # Добавляем глобальную функцию t после импортов
        $globalTFunction = @(
            "",
            "// Глобальная функция для получения перевода",
            "const t = (key, fallback = '') => {",
            "    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;",
            "};",
            ""
        )
        
        $newLines = $newLines[0..$lastImportIndex] + $globalTFunction + $newLines[($lastImportIndex + 1)..($newLines.Count - 1)]
        
        # Объединяем строки
        $newContent = $newLines -join "`n"
        
        # Заменяем локальную функцию t на tComponent (если есть)
        $newContent = $newContent -replace "const\s+t\s*=\s*\(.*?\)\s*=>\s*\{[\s\S]*?translations\?\.[^\}]*\|\|.*?\};", "// Функция для получения перевода внутри компонента`n    const tComponent = (key, fallback = '') => {`n        return translations?.[key] || fallback;`n    };"
        
        # Заменяем использование t внутри компонента на tComponent (но не в layout)
        $componentParts = $newContent -split "export default function"
        if ($componentParts.Count -gt 1) {
            $beforeComponent = $componentParts[0]
            $afterComponent = $componentParts[1]
            
            # Заменяем только внутри компонента
            $fixedAfterComponent = $afterComponent -replace "(?<!\.layout\s*=.*)t\(", "tComponent("
            
            $newContent = $beforeComponent + "export default function" + $fixedAfterComponent
        }
        
        # Записываем исправленный файл
        Set-Content -Path $FilePath -Value $newContent -Encoding UTF8
        
        return @{ Success = $true; FilePath = $FilePath }
        
    } catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Основная логика
$successCount = 0
$errorCount = 0
$results = @()

# Создаем папку для резервных копий
$backupDir = ".\backups_" + (Get-Date -Format "yyyy-MM-dd_HH-mm-ss")
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

Write-Host "📁 Создана папка для резервных копий: $backupDir" -ForegroundColor Yellow
Write-Host ""

for ($i = 0; $i -lt $filesToFix.Count; $i++) {
    $filePath = $filesToFix[$i]
    Write-Host "[$($i + 1)/$($filesToFix.Count)] Обработка: $filePath" -ForegroundColor Cyan
    
    # Создаем резервную копию
    if (Test-Path $filePath) {
        $backupPath = Join-Path $backupDir (Split-Path $filePath -Leaf) + ".backup"
        try {
            Copy-Item $filePath $backupPath
        } catch {
            Write-Host "   ⚠️ Не удалось создать резервную копию: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    # Исправляем файл
    $result = Fix-File $filePath
    
    if ($result.Success) {
        Write-Host "   ✅ Исправлен: $filePath" -ForegroundColor Green
        $successCount++
        $results += @{ FilePath = $filePath; Status = "success" }
    } else {
        Write-Host "   ❌ Ошибка: $filePath - $($result.Error)" -ForegroundColor Red
        $errorCount++
        $results += @{ FilePath = $filePath; Status = "error"; Error = $result.Error }
    }
}

# Выводим итоговую статистику
Write-Host ""
Write-Host "📊 Итоговая статистика:" -ForegroundColor Magenta
Write-Host "✅ Успешно исправлено: $successCount" -ForegroundColor Green
Write-Host "❌ Ошибок: $errorCount" -ForegroundColor Red
Write-Host "📁 Всего обработано: $($filesToFix.Count)" -ForegroundColor Blue

# Выводим список исправленных файлов
if ($successCount -gt 0) {
    Write-Host ""
    Write-Host "✅ Успешно исправленные файлы:" -ForegroundColor Green
    $results | Where-Object { $_.Status -eq "success" } | ForEach-Object {
        Write-Host "   - $($_.FilePath)" -ForegroundColor White
    }
}

# Выводим список файлов с ошибками
if ($errorCount -gt 0) {
    Write-Host ""
    Write-Host "❌ Файлы с ошибками:" -ForegroundColor Red
    $results | Where-Object { $_.Status -eq "error" } | ForEach-Object {
        Write-Host "   - $($_.FilePath): $($_.Error)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "💾 Резервные копии сохранены в: $backupDir" -ForegroundColor Yellow
Write-Host "🔍 Проверьте исправленные файлы в браузере!" -ForegroundColor Blue
Write-Host "✅ Автоматическое исправление завершено!" -ForegroundColor Green

# Ждем нажатия клавиши
Write-Host ""
Read-Host "Нажмите Enter для завершения"
