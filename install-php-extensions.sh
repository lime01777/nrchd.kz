#!/bin/bash

# Скрипт установки расширений PHP для Laravel проекта nrchd.kz
# Запустите этот скрипт с правами sudo: sudo bash install-php-extensions.sh

set -e

echo "=========================================="
echo "Установка расширений PHP для Laravel"
echo "=========================================="
echo ""

# Проверка версии PHP
PHP_VERSION=$(php -r "echo PHP_VERSION;" | cut -d. -f1,2)
echo "Обнаружена версия PHP: $PHP_VERSION"

# Определение версии PHP пакета
if [[ "$PHP_VERSION" == "8.3" ]]; then
    PHP_PKG="php8.3"
elif [[ "$PHP_VERSION" == "8.2" ]]; then
    PHP_PKG="php8.2"
elif [[ "$PHP_VERSION" == "8.1" ]]; then
    PHP_PKG="php8.1"
else
    echo "Ошибка: Неподдерживаемая версия PHP $PHP_VERSION"
    exit 1
fi

echo "Используется пакет: $PHP_PKG"
echo ""

# Установка необходимых расширений PHP для Laravel
echo "Установка расширений PHP..."
apt install -y \
    ${PHP_PKG}-sqlite3 \
    ${PHP_PKG}-pdo-sqlite \
    ${PHP_PKG}-xml \
    ${PHP_PKG}-dom \
    ${PHP_PKG}-curl \
    ${PHP_PKG}-mbstring \
    ${PHP_PKG}-gd \
    ${PHP_PKG}-zip \
    ${PHP_PKG}-bcmath \
    ${PHP_PKG}-intl \
    ${PHP_PKG}-redis \
    ${PHP_PKG}-mysql

echo ""
echo "Проверка установленных расширений..."

# Проверка критических расширений
echo -n "pdo_sqlite: "
php -m | grep -q pdo_sqlite && echo "✓ установлено" || echo "✗ НЕ установлено"

echo -n "sqlite3: "
php -m | grep -q sqlite3 && echo "✓ установлено" || echo "✗ НЕ установлено"

echo -n "xml: "
php -m | grep -q xml && echo "✓ установлено" || echo "✗ НЕ установлено"

echo -n "dom: "
php -m | grep -q dom && echo "✓ установлено" || echo "✗ НЕ установлено"

echo -n "curl: "
php -m | grep -q curl && echo "✓ установлено" || echo "✗ НЕ установлено"

echo -n "mbstring: "
php -m | grep -q mbstring && echo "✓ установлено" || echo "✗ НЕ установлено"

echo ""
echo "=========================================="
echo "Установка завершена!"
echo "=========================================="
echo ""
echo "Теперь можно запустить проект:"
echo "1. cd /home/lime/Документы/nrchd.kz/nrchd.kz"
echo "2. php artisan migrate"
echo "3. composer run dev"
echo ""
