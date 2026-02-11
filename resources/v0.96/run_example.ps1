# Пример скрипта для запуска анализа

Write-Host "=== Запуск анализатора протоколов ===" -ForegroundColor Cyan

# Активация виртуального окружения
if (Test-Path .venv\Scripts\Activate.ps1) {
    & .\.venv\Scripts\Activate.ps1
    Write-Host "✓ Виртуальное окружение активировано" -ForegroundColor Green
} else {
    Write-Host "✗ Виртуальное окружение не найдено!" -ForegroundColor Red
    Write-Host "Запустите: .\setup_venv.ps1" -ForegroundColor Yellow
    exit 1
}

# Выбор файла для анализа
$availableFiles = Get-ChildItem "data\inputs\*.docx" | Where-Object { $_.Length -gt 0 } | Select-Object -First 1

if (-not $availableFiles) {
    Write-Host "✗ Нет доступных файлов для анализа в data/inputs/" -ForegroundColor Red
    exit 1
}

$inputFile = $availableFiles.FullName
$fileName = $availableFiles.BaseName

Write-Host "`nВыбран файл: $($availableFiles.Name)" -ForegroundColor Yellow
Write-Host "Размер: $([math]::Round($availableFiles.Length/1KB, 1)) KB" -ForegroundColor Yellow

# Определение индикации на основе имени файла
$indicationMap = @{
    "КП Вр кистозн трансф" = "Врожденная кистозная трансформация"
    "КП Кисты поджел" = "Кисты поджелудочной железы"
    "КП Легочная гипертензия" = "Легочная гипертензия"
    "КП Остр вос забол матки" = "Острое воспалительное заболевание матки"
    "КП Откр переломы верх и ниж" = "Открытые переломы верхних и нижних конечностей"
    "КП Рестриктивная кардио" = "Рестриктивная кардиомиопатия"
    "КП Токсич действ хим оружия" = "Токсическое действие химического оружия"
    "КП Эрозия" = "Эрозия"
    "КП Язвенная болезнь" = "Язвенная болезнь желудка и двенадцатиперстной кишки"
}

$indication = if ($indicationMap.ContainsKey($fileName)) {
    $indicationMap[$fileName]
} else {
    "Общее заболевание"  # Fallback
}

Write-Host "Индикация: $indication" -ForegroundColor Yellow

# Путь к выходному файлу
$outputFile = "data\outputs\report_$fileName.xlsx"

Write-Host "`nВыходной файл: $outputFile" -ForegroundColor Yellow

# Запуск анализа
Write-Host "`nЗапуск анализа..." -ForegroundColor Cyan
Write-Host "Это может занять несколько минут..." -ForegroundColor Yellow

python main.py -i "$inputFile" -o "$outputFile" --indication "$indication" --max-workers 8 --word

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Анализ завершен успешно! ===" -ForegroundColor Green
    if (Test-Path $outputFile) {
        Write-Host "Excel отчет: $outputFile" -ForegroundColor Green
    }
    $wordFile = $outputFile -replace '\.xlsx$', '.docx'
    if (Test-Path $wordFile) {
        Write-Host "Word отчет: $wordFile" -ForegroundColor Green
    }
} else {
    Write-Host "`n=== Ошибка при выполнении анализа ===" -ForegroundColor Red
    exit 1
}

