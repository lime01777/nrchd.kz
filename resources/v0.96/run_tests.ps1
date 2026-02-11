# Скрипт для запуска тестов

Write-Host "=== Запуск тестов ===" -ForegroundColor Cyan

# Активация виртуального окружения
if (Test-Path .venv\Scripts\Activate.ps1) {
    & .\.venv\Scripts\Activate.ps1
} else {
    Write-Host "ОШИБКА: Виртуальное окружение не найдено!" -ForegroundColor Red
    Write-Host "Запустите: .\setup_venv.ps1" -ForegroundColor Yellow
    exit 1
}

# Запуск тестов
Write-Host "Запуск pytest..." -ForegroundColor Yellow
pytest

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== Все тесты пройдены! ===" -ForegroundColor Green
} else {
    Write-Host "`n=== Некоторые тесты не прошли ===" -ForegroundColor Red
}

