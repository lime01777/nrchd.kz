#!/bin/bash

# Скрипт для запуска окружения AI Протоколов
# Этот скрипт активирует виртуальное окружение и запускает очередь Laravel

PROJECT_DIR="/home/lime/Документы/nrchd.kz/nrchd.kz"
VENV_DIR="$PROJECT_DIR/resources/v0.96/.venv_linux"

echo "--- Инициализация AI сервиса ---"

# 1. Проверка виртуального окружения
if [ ! -d "$VENV_DIR" ]; then
    echo "Создание виртуального окружения..."
    python3 -m venv "$VENV_DIR"
fi

# 2. Обновление зависимостей (опционально)
echo "Проверка зависимостей..."
source "$VENV_DIR/bin/activate"
pip install -q -r "$PROJECT_DIR/resources/v0.96/requirements.txt"

# 3. Запуск воркера Laravel
echo "Запуск Laravel Queue Worker (обработка протоколов)..."
cd "$PROJECT_DIR"
php artisan queue:work --timeout=3600

echo "Сервис активен. Не закрывайте это окно."
