# Руководство по развертыванию переводов на хостинге

## 📋 Подготовка к развертыванию

### 1. Проверка готовности системы
Перед развертыванием убедитесь, что все компоненты готовы:

```bash
# Проверка системы переводов
php artisan verify:translations

# Создание финальных языковых файлов
php artisan create:kazakh-lang --force
php artisan create:english-lang --force
php artisan create:russian-lang --force
```

### 2. Файлы для загрузки на хостинг

**Обязательные файлы и папки:**
- `resources/lang/` - все языковые файлы
- `app/Http/Middleware/AutoLanguageDetectionMiddleware.php` - middleware для автоопределения языка
- `config/app.php` - конфигурация приложения
- `database/migrations/2025_08_15_125236_create_stored_translations_table.php` - миграция БД
- `app/Models/StoredTranslation.php` - модель для переводов
- `app/Services/AutoTranslationService.php` - сервис переводов

## 🚀 Процесс развертывания

### Шаг 1: Загрузка файлов на хостинг

1. **Через FTP/SFTP:**
   - Подключитесь к хостингу через FileZilla или другой FTP-клиент
   - Загрузите все файлы проекта в корневую папку сайта
   - Убедитесь, что права доступа установлены правильно (755 для папок, 644 для файлов)

2. **Через Git (рекомендуется):**
   ```bash
   # На локальном сервере
   git add .
   git commit -m "Add complete translation system with Kazakh as default"
   git push origin main
   
   # На хостинге
   git pull origin main
   ```

### Шаг 2: Настройка базы данных

1. **Создание таблицы переводов:**
   ```bash
   php artisan migrate
   ```

2. **Проверка структуры БД:**
   ```bash
   php artisan migrate:status
   ```

### Шаг 3: Настройка окружения

1. **Файл .env на хостинге:**
   ```env
   APP_NAME="Your Site Name"
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   
   # Настройки языка (ОБЯЗАТЕЛЬНО!)
   APP_LOCALE=kz
   APP_FALLBACK_LOCALE=kz
   
   # Настройки БД
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   
   # Google Translate API (если используется)
   GOOGLE_TRANSLATE_API_KEY=your_api_key
   ```

### Шаг 4: Очистка кэша

```bash
# Очистка всех кэшей
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Перезагрузка конфигурации
php artisan config:cache
php artisan route:cache
```

### Шаг 5: Проверка работы

1. **Проверка системы переводов:**
   ```bash
   php artisan verify:translations
   ```

2. **Тестирование языков:**
   - Откройте сайт: `https://your-domain.com` (должен быть на казахском)
   - Проверьте переключение языков: `https://your-domain.com/ru`, `https://your-domain.com/en`

## 🔧 Дополнительные настройки

### Настройка веб-сервера (Apache)

**Файл .htaccess в корне сайта:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**Файл public/.htaccess:**
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### Настройка веб-сервера (Nginx)

**Конфигурация сайта:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/project/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 🎯 Проверка результата

### Что должно работать после развертывания:

1. **Главная страница на казахском языке**
   - При открытии `https://your-domain.com` сайт должен отображаться на казахском

2. **Автоопределение языка по IP**
   - Пользователи из Казахстана автоматически видят казахскую версию
   - Пользователи из других стран видят казахскую версию по умолчанию

3. **Переключение языков**
   - `https://your-domain.com/ru` - русская версия
   - `https://your-domain.com/en` - английская версия
   - `https://your-domain.com/kz` - казахская версия

4. **Все тексты переведены**
   - Кнопки, меню, ссылки, заголовки - все на казахском языке
   - Возможность переключения на другие языки

## 🚨 Возможные проблемы и решения

### Проблема 1: Сайт не отображается на казахском
**Решение:**
```bash
# Проверьте настройки в .env
APP_LOCALE=kz
APP_FALLBACK_LOCALE=kz

# Очистите кэш
php artisan config:clear
php artisan cache:clear
```

### Проблема 2: Ошибки 500 при загрузке страниц
**Решение:**
```bash
# Проверьте права доступа
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# Проверьте логи ошибок
tail -f storage/logs/laravel.log
```

### Проблема 3: Переводы не работают
**Решение:**
```bash
# Проверьте систему переводов
php artisan verify:translations

# Пересоздайте языковые файлы
php artisan create:kazakh-lang --force
```

## 📞 Поддержка

Если возникли проблемы при развертывании:

1. Проверьте логи ошибок в `storage/logs/laravel.log`
2. Убедитесь, что все файлы загружены корректно
3. Проверьте настройки базы данных
4. Убедитесь, что права доступа установлены правильно

## ✅ Чек-лист развертывания

- [ ] Все файлы загружены на хостинг
- [ ] База данных настроена и миграции выполнены
- [ ] Файл .env настроен с правильными параметрами языка
- [ ] Кэш очищен и перезагружен
- [ ] Система переводов проверена командой `verify:translations`
- [ ] Главная страница отображается на казахском языке
- [ ] Переключение языков работает корректно
- [ ] Все тексты переведены и отображаются правильно

**🎉 Поздравляем! Ваш сайт теперь полностью переведен и готов к работе с казахским языком как основным!**
