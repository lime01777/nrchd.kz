#!/bin/bash

# Скрипт для быстрого запуска проекта из любой директории
# Использование: bash /home/lime/Документы/nrchd.kz/nrchd.kz/RUN.sh [команда]

SCRIPT_DIR="/home/lime/Документы/nrchd.kz/nrchd.kz"
cd "$SCRIPT_DIR" || exit 1

COMMAND="${1:-dev}"

case "$COMMAND" in
    dev)
        echo "Запуск Vite dev server..."
        echo "Сервер будет доступен на http://localhost:5173"
        npm run dev
        ;;
    build)
        echo "Сборка проекта для продакшена..."
        npm run build
        echo ""
        echo "✓ Сборка завершена! Файлы находятся в public/build/"
        ;;
    serve)
        echo "Запуск Laravel сервера..."
        echo "Сервер будет доступен на http://127.0.0.1:8000"
        php artisan serve
        ;;
    migrate)
        echo "Запуск миграций..."
        php artisan migrate --force
        ;;
    full)
        echo "Запуск полного проекта (Laravel + Vite + Queue + Logs)..."
        echo "Серверы будут доступны:"
        echo "  - Laravel: http://127.0.0.1:8000"
        echo "  - Vite:    http://127.0.0.1:5173"
        composer run dev
        ;;
    *)
        echo "Использование: $0 [dev|build|serve|migrate|full]"
        echo ""
        echo "Команды:"
        echo "  dev     - Запустить Vite dev server (npm run dev)"
        echo "  build   - Собрать проект для продакшена (npm run build)"
        echo "  serve   - Запустить Laravel сервер (php artisan serve)"
        echo "  migrate - Запустить миграции базы данных"
        echo "  full    - Запустить полный проект (composer run dev)"
        exit 1
        ;;
esac
