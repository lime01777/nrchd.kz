#!/usr/bin/env bash
set -e

# Очистка кешей для корректной диагностики
php artisan config:clear
php artisan route:clear

# Прогон миграций (включая новые изменения)
php artisan migrate --force

# Генерация отчётов диагностики
php artisan news:diagnose --report=json > /dev/null || true
php artisan news:diagnose --report=markdown > /dev/null || true

# Запуск feature-тестов
./vendor/bin/phpunit --testsuite=Feature --colors=always

# Результаты
echo "OK: отчёты сохранены по путям:"
echo " - storage/logs/news_diagnose.json"
echo " - storage/logs/news_checklist.md"
