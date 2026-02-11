# Скрипт для активации виртуального окружения

if (Test-Path .venv\Scripts\Activate.ps1) {
    & .\.venv\Scripts\Activate.ps1
    Write-Host "Виртуальное окружение активировано" -ForegroundColor Green
} else {
    Write-Host "ОШИБКА: Виртуальное окружение не найдено!" -ForegroundColor Red
    Write-Host "Запустите: .\setup_venv.ps1" -ForegroundColor Yellow
}

