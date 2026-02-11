#!/bin/bash

# Скрипт для запуска проекта Laravel + Vite
# Использование: bash START_PROJECT.sh

set -e

echo "=========================================="
echo "Запуск проекта nrchd.kz"
echo "=========================================="
echo ""

cd /home/lime/Документы/nrchd.kz/nrchd.kz

# Проверка PHP расширений
echo "Проверка PHP расширений..."
MISSING_EXTENSIONS=()

if ! php -m | grep -q pdo_sqlite; then
    MISSING_EXTENSIONS+=("pdo_sqlite")
fi

if ! php -m | grep -q dom; then
    MISSING_EXTENSIONS+=("dom/xml")
fi

if [ ${#MISSING_EXTENSIONS[@]} -gt 0 ]; then
    echo "⚠️  ВНИМАНИЕ: Отсутствуют PHP расширения: ${MISSING_EXTENSIONS[*]}"
    echo ""
    echo "Для установки выполните:"
    echo "  sudo bash install-php-extensions.sh"
    echo ""
    echo "Продолжить запуск без миграций? (y/n)"
    read -r answer
    if [ "$answer" != "y" ]; then
        echo "Запуск отменен."
        exit 1
    fi
    SKIP_MIGRATIONS=true
else
    SKIP_MIGRATIONS=false
fi

# Запуск миграций (если расширения установлены)
if [ "$SKIP_MIGRATIONS" = false ]; then
    echo ""
    echo "Запуск миграций базы данных..."
    php artisan migrate --force || {
        echo "⚠️  Ошибка при запуске миграций, продолжаем без них..."
    }
fi

# Запуск проекта через composer run dev
echo ""
echo "Запуск проекта (Laravel + Vite + Queue + Logs)..."
echo "Серверы будут доступны:"
echo "  - Laravel: http://127.0.0.1:8000"
echo "  - Vite:    http://127.0.0.1:5173"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

composer run dev
