# Быстрый старт: Казахский язык как основной

## 🚀 Быстрая настройка (5 минут)

### 1. Настройка переменных окружения

Добавьте в `.env`:

```env
APP_LOCALE=kz
APP_FALLBACK_LOCALE=kz
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

### 2. Запуск миграций

```bash
php artisan migrate
```

### 3. Тестирование системы

```bash
php test_kazakh_translation.php
```

### 4. Автоматический перевод всех текстов

```bash
# Сначала посмотрите что будет переведено
php artisan translate:all --dry-run

# Затем выполните перевод
php artisan translate:all --from=kz --to=ru,en
```

### 5. Подключение JavaScript

Добавьте в ваш основной JS файл:

```javascript
import './Utils/TranslationHelper.js';
```

## ✅ Проверка работы

1. **Откройте сайт** - должен автоматически определиться казахский язык
2. **Проверьте компонент MediaSlider** - все тексты должны быть на казахском
3. **Проверьте логи** - `tail -f storage/logs/laravel.log`

## 🔧 Основные команды

```bash
# Перевод всех текстов
php artisan translate:all

# Перевод только на русский
php artisan translate:all --to=ru

# Принудительный перевод
php artisan translate:all --force

# Тестирование системы
php test_kazakh_translation.php
```

## 📁 Ключевые файлы

- `app/Http/Middleware/AutoLanguageDetectionMiddleware.php` - определение языка
- `app/Services/AutoTranslationService.php` - сервис переводов
- `resources/js/Utils/TranslationHelper.js` - фронтенд утилита
- `resources/js/Components/MediaSlider.jsx` - пример компонента с переводами

## 🆘 Если что-то не работает

1. **Проверьте API ключ** Google Translate
2. **Запустите тест** `php test_kazakh_translation.php`
3. **Проверьте логи** `storage/logs/laravel.log`
4. **Прочитайте документацию** `KAZAKH_TRANSLATION_SETUP.md`

## 📞 Поддержка

- Документация: `KAZAKH_TRANSLATION_SETUP.md`
- Тестовый скрипт: `test_kazakh_translation.php`
- Логи: `storage/logs/laravel.log`
