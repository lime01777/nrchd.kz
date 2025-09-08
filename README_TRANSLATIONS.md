# Система переводов с DeepL API

## Описание

Модуль переводов для Laravel-проекта nrchd.kz с автоматическим переводом отсутствующих строк через DeepL API.

## Архитектура

### Основные компоненты

1. **Модель `App\Models\Translation`** - Eloquent-модель для хранения переводов
2. **Сервис `App\Services\Translation\DeepLClient`** - HTTP-клиент для DeepL API
3. **Сервис `App\Services\Translation\TranslationService`** - основной сервис переводов
4. **Middleware `App\Http\Middleware\SetLocale`** - установка локали
5. **Контроллер `App\Http\Controllers\TranslationController`** - API для переводов
6. **Хелпер `t()`** - функция для получения переводов

### Принцип работы

1. **Кеш** → Проверка кеша (forever)
2. **БД** → Поиск в базе данных
3. **DeepL** → Автоматический перевод отсутствующих строк
4. **Сохранение** → Сохранение в БД и обновление кеша

## Установка

### 1. Переменные окружения

Добавьте в `.env`:

```env
APP_LOCALE=kk
APP_FALLBACK_LOCALE=kk
DEEPL_API_KEY=your_deepl_key_here
DEEPL_API_BASE=https://api-free.deepl.com
```

### 2. Миграции

```bash
php artisan migrate
```

### 3. Сидеры

```bash
php artisan db:seed --class=TranslationSeeder
```

### 4. Перезагрузка автозагрузчика

```bash
composer dump-autoload
```

## Использование

### Хелпер t()

```php
// Базовое использование
echo t('site.name');

// С параметрами замены
echo t('welcome.message', ['name' => 'John']);

// С указанием локали
echo t('site.name', [], 'ru');

// С namespace и context
echo t('news.title', [], null, 'news', 'homepage');
```

### API маршруты

#### GET /api/i18n/{locale}

Получение словаря переводов для локали:

```bash
GET /api/i18n/ru?namespace=site
```

Ответ:
```json
{
    "locale": "ru",
    "data": {
        "site.name": "Национальный центр развития здравоохранения",
        "menu.home": "Главная"
    }
}
```

#### POST /api/translate/ensure

Массовое создание недостающих переводов:

```bash
POST /api/translate/ensure
Content-Type: application/json

{
    "keys": ["menu.contacts", "menu.about"],
    "locale": "ru",
    "namespace": "site"
}
```

### Middleware SetLocale

Автоматически устанавливает локаль в следующем порядке:

1. `?lang=ru` - параметр URL
2. `session('lang')` - сессия
3. `X-Locale` - заголовок HTTP
4. `config('app.locale')` - конфигурация (по умолчанию 'kk')

Поддерживаемые языки: `kk`, `ru`, `en`

## Структура базы данных

### Таблица `translations`

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | bigint | Первичный ключ |
| `key` | varchar(191) | Ключ перевода |
| `locale` | varchar(10) | Локаль (kk, ru, en) |
| `value` | text | Значение перевода |
| `namespace` | varchar(64) | Пространство имён |
| `context` | varchar(64) | Контекст |
| `timestamps` | timestamps | Время создания/обновления |

**Уникальный индекс**: `(key, locale, namespace, context)`

## Тестирование

Запустите тестовый файл:

```bash
php test_translation_system.php
```

## Приёмочные критерии

- ✅ `php artisan migrate` создаёт таблицу `translations`
- ✅ `POST /api/translate/ensure` с `["menu.contacts"]` и локалью `ru` создаёт запись и кеш
- ✅ `GET /api/i18n/ru?namespace=site` возвращает словарь
- ✅ `{{ t('news.read_more', [], null, 'site') }}` в Blade выводит текст для активной локали
- ✅ Смена языка через `?lang=ru` меняет локаль сессии

## Безопасность

- DeepL API ключ хранится в переменных окружения
- Валидация входных данных в API
- Кеширование для производительности
- Логирование ошибок перевода

## Производительность

- Forever кеширование переводов
- Индексы в базе данных
- Массовые операции для множественных ключей
- Автоматическое обновление кеша при изменении

## Поддержка

При возникновении проблем:

1. Проверьте логи Laravel
2. Убедитесь в корректности DeepL API ключа
3. Проверьте доступность DeepL API
4. Запустите тестовый файл для диагностики
