#!/bin/bash

# Скрипт установки зависимостей для Laravel проекта nrchd.kz
# Запустите этот скрипт с правами sudo: sudo bash install-dependencies.sh

set -e

echo "=========================================="
echo "Установка зависимостей для Laravel проекта"
echo "=========================================="
echo ""

# Обновление списка пакетов
echo "1. Обновление списка пакетов..."
apt update

# Установка curl (необходим для установки Composer)
echo ""
echo "1.1. Установка curl..."
apt install -y curl

# Установка PHP 8.2 и необходимых расширений для Laravel
echo ""
echo "2. Установка PHP 8.2 и расширений..."
apt install -y php8.2-cli \
    php8.2-fpm \
    php8.2-common \
    php8.2-mysql \
    php8.2-zip \
    php8.2-gd \
    php8.2-mbstring \
    php8.2-curl \
    php8.2-xml \
    php8.2-bcmath \
    php8.2-sqlite3 \
    php8.2-intl \
    php8.2-redis \
    unzip

# Установка Composer
echo ""
echo "3. Установка Composer..."
if ! command -v composer &> /dev/null; then
    cd /tmp
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
    chmod +x /usr/local/bin/composer
    echo "Composer установлен успешно"
else
    echo "Composer уже установлен"
fi

# Проверка версий
echo ""
echo "4. Проверка установленных версий..."
php --version
composer --version
node --version
npm --version

echo ""
echo "=========================================="
echo "Установка системных зависимостей завершена!"
echo "=========================================="
echo ""
echo "Следующие шаги:"
echo "1. Перейдите в директорию проекта: cd /home/lime/Документы/nrchd.kz/nrchd.kz"
echo "2. Установите PHP зависимости: composer install"
echo "   (Примечание: npm зависимости уже установлены)"
echo "3. Скопируйте .env.example в .env (если нужно): cp .env.example .env"
echo "4. Сгенерируйте ключ приложения: php artisan key:generate"
echo "5. Создайте файл базы данных SQLite: touch database/database.sqlite"
echo "6. Запустите миграции: php artisan migrate"
echo ""
