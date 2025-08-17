# Настройка казахского языка как основного

## Обзор

Данная система обеспечивает автоматический перевод всего сайта на казахский язык как основной, с поддержкой переводов на русский и английский языки. Система автоматически определяет пользователей из Казахстана по IP адресу и показывает им контент на казахском языке.

## Основные компоненты

### 1. Middleware для автоматического определения языка
- **Файл**: `app/Http/Middleware/AutoLanguageDetectionMiddleware.php`
- **Функция**: Автоматически определяет язык пользователя по IP адресу
- **Приоритет**: Пользователи из Казахстана → казахский язык
- **Регистрация**: Добавлен в `app/Http/Kernel.php` как `autoLanguage`

### 2. Сервис автоматического перевода
- **Файл**: `app/Services/AutoTranslationService.php`
- **Функция**: Переводит тексты через Google Translate API
- **Особенности**: Кэширует переводы в базе данных

### 3. API для переводов
- **Файл**: `app/Http/Controllers/Api/TranslationAPIController.php`
- **Маршруты**: `/api/translations/{language}`, `/api/language/set`
- **Функция**: Предоставляет переводы для фронтенда

### 4. JavaScript утилита
- **Файл**: `resources/js/Utils/TranslationHelper.js`
- **Функция**: Управляет переводами на фронтенде
- **Глобальный объект**: `window.translations`

### 5. Команда Artisan
- **Файл**: `app/Console/Commands/TranslateAllTexts.php`
- **Команда**: `php artisan translate:all`
- **Функция**: Автоматически переводит все тексты

## Настройка

### 1. Переменные окружения

Добавьте в файл `.env`:

```env
# Основной язык сайта
APP_LOCALE=kz
APP_FALLBACK_LOCALE=kz

# Google Translate API ключ
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

### 2. Миграции

Убедитесь, что таблица переводов создана:

```bash
php artisan migrate
```

### 3. Регистрация middleware

Middleware уже зарегистрирован в `app/Http/Kernel.php`. Для использования добавьте в маршруты:

```php
Route::middleware(['web', 'autoLanguage'])->group(function () {
    // Ваши маршруты
});
```

### 4. Подключение JavaScript

Добавьте в ваш основной JavaScript файл:

```javascript
import TranslationHelper from './Utils/TranslationHelper.js';

// Инициализация происходит автоматически
```

## Использование

### 1. Автоматический перевод всех текстов

```bash
# Показать что будет переведено (dry run)
php artisan translate:all --dry-run

# Перевести с казахского на русский и английский
php artisan translate:all --from=kz --to=ru,en

# Принудительно перевести все тексты
php artisan translate:all --force
```

### 2. Использование в компонентах React

```jsx
// В компоненте MediaSlider
<p>{window.translations?.no_media_files || 'Нет медиа файлов для отображения'}</p>
```

### 3. Использование в Blade шаблонах

```php
{{ __('common.welcome') }}
{{ __('common.home') }}
```

### 4. Программное использование

```php
// В контроллерах
use App\Services\AutoTranslationService;

$translationService = app(AutoTranslationService::class);
$translatedText = $translationService->translateText('Привет', 'kz', 'ru');
```

## Структура языковых файлов

### Казахский (основной)
- `resources/lang/kz/common.php` - основные переводы
- `resources/lang/kz/messages.php` - сообщения
- `resources/lang/kz/localization.php` - локализация

### Русский
- `resources/lang/ru/common.php` - переводы на русский
- `resources/lang/ru/messages.php` - сообщения на русском

### Английский
- `resources/lang/en/` - переводы на английский

## База данных

### Таблица `stored_translations`

```sql
CREATE TABLE stored_translations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    page_url VARCHAR(255) NULL,
    hash VARCHAR(32) UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_hash (hash),
    INDEX idx_target_language (target_language),
    INDEX idx_page_url (page_url)
);
```

## API Endpoints

### Получить переводы
```
GET /api/translations/{language}
```

### Перевести текст
```
POST /api/translations/translate
{
    "text": "Текст для перевода",
    "target_language": "kz",
    "source_language": "ru"
}
```

### Установить язык
```
POST /api/language/set
{
    "language": "kz"
}
```

### Получить текущий язык
```
GET /api/language/current
```

## Логирование

Система ведет подробные логи:

- Определение языка по IP
- Успешные переводы
- Ошибки перевода
- Сохранение переводов в БД

Логи находятся в `storage/logs/laravel.log`

## Мониторинг

### Проверка статуса переводов

```bash
# Статистика переводов
php artisan tinker
>>> App\Models\StoredTranslation::count();

# Переводы по языкам
>>> App\Models\StoredTranslation::groupBy('target_language')->count();
```

### Проверка работы middleware

В логах Laravel ищите записи:
- `Language auto-detected for Kazakhstan user`
- `Language set from URL parameter`
- `Language set from session`

## Troubleshooting

### 1. Переводы не загружаются

Проверьте:
- API ключ Google Translate
- Подключение к базе данных
- Права доступа к файлам переводов

### 2. Язык не определяется автоматически

Проверьте:
- IP адреса в middleware
- Логи определения языка
- Настройки сессии

### 3. Компоненты не переводятся

Проверьте:
- Подключение TranslationHelper.js
- Наличие переводов в языковых файлах
- Правильность использования `window.translations`

## Расширение системы

### Добавление нового языка

1. Создайте папку `resources/lang/{new_lang}/`
2. Добавьте языковые файлы
3. Обновите `$availableLanguages` в middleware
4. Добавьте IP диапазоны в middleware (если нужно)

### Добавление новых переводов

1. Добавьте ключи в `resources/lang/kz/common.php`
2. Запустите команду перевода
3. Проверьте переводы в базе данных

### Кастомизация определения языка

Отредактируйте метод `detectLanguageByIP()` в `AutoLanguageDetectionMiddleware.php` для добавления дополнительной логики определения языка.

## Производительность

### Кэширование

- Переводы кэшируются в базе данных
- Используется хэширование для быстрого поиска
- Индексы на ключевых полях

### Оптимизация

- Ленивая загрузка переводов
- Кэширование на уровне приложения
- Минимизация API запросов к Google Translate

## Безопасность

- Валидация входных данных
- Ограничение длины текстов
- Логирование всех операций
- Защита от SQL инъекций
