# 🚀 Быстрое развертывание переводов на хостинг

## ⚡ Быстрые команды для развертывания

### 1. Подготовка (выполнить на локальном сервере)
```bash
# Проверка системы
php artisan verify:translations

# Создание финальных файлов
php artisan create:kazakh-lang --force
php artisan create:english-lang --force
php artisan create:russian-lang --force
```

### 2. Загрузка на хостинг
```bash
# Через Git (рекомендуется)
git add .
git commit -m "Complete translation system with Kazakh as default"
git push origin main

# На хостинге
git pull origin main
```

### 3. Настройка на хостинге
```bash
# Установка зависимостей
composer install --optimize-autoloader --no-dev

# Миграции БД
php artisan migrate

# Очистка кэша
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Перезагрузка конфигурации
php artisan config:cache
php artisan route:cache
```

### 4. Проверка
```bash
# Проверка системы переводов
php artisan verify:translations

# Открыть сайт: https://your-domain.com (должен быть на казахском)
```

## 🔧 Критически важные настройки .env

```env
APP_LOCALE=kz
APP_FALLBACK_LOCALE=kz
APP_ENV=production
APP_DEBUG=false
```

## ✅ Что должно работать

- ✅ Главная страница на казахском: `https://your-domain.com`
- ✅ Русская версия: `https://your-domain.com/ru`
- ✅ Английская версия: `https://your-domain.com/en`
- ✅ Автоопределение языка по IP для пользователей из Казахстана

## 🚨 Если что-то не работает

```bash
# Проверка прав доступа
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Проверка логов
tail -f storage/logs/laravel.log

# Пересоздание языковых файлов
php artisan create:kazakh-lang --force
```

**🎯 Готово! Ваш сайт теперь работает с казахским языком как основным!**
