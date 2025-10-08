# Руководство по тестированию модернизированного модуля "Новости"

## 🧪 Обзор тестирования

Модуль "Новости" включает комплексное тестирование:
- **Feature тесты** - тестирование полного функционала
- **Unit тесты** - тестирование отдельных компонентов
- **E2E тесты** - тестирование пользовательских сценариев

## 🚀 Запуск тестов

### 1. Подготовка окружения

```bash
# Установка зависимостей
composer install
npm install

# Настройка тестовой БД
cp .env .env.testing
# Отредактируйте .env.testing для тестовой БД

# Создание тестовой БД
php artisan migrate --env=testing

# Создание симлинка для storage
php artisan storage:link --env=testing
```

### 2. Запуск всех тестов

```bash
# Все тесты
php artisan test

# С подробным выводом
php artisan test --verbose

# С покрытием кода
php artisan test --coverage
```

### 3. Запуск конкретных тестов

```bash
# Только тесты новостей
php artisan test tests/Feature/NewsManagementTest.php

# Конкретный тест
php artisan test --filter test_user_can_create_news_with_media

# Тесты с группой
php artisan test --group=news
```

## 📋 Тестовые сценарии

### 1. Создание новости

**Сценарий:** Пользователь создает новость с медиа файлами

```bash
php artisan test --filter test_user_can_create_news_with_media
```

**Что тестируется:**
- ✅ Валидация формы
- ✅ Загрузка изображений и видео
- ✅ Сохранение в БД
- ✅ Обработка медиа файлов
- ✅ Генерация slug

### 2. Загрузка медиа

**Сценарий:** Загрузка медиа файлов к существующей новости

```bash
php artisan test --filter test_user_can_upload_media_to_existing_news
```

**Что тестируется:**
- ✅ Загрузка файлов через API
- ✅ Валидация типов файлов
- ✅ Обновление новости
- ✅ Возврат JSON ответа

### 3. Удаление медиа

**Сценарий:** Удаление медиа файла из новости

```bash
php artisan test --filter test_user_can_delete_media_from_news
```

**Что тестируется:**
- ✅ Удаление из БД
- ✅ Удаление физического файла
- ✅ Обновление новости
- ✅ Обработка ошибок

### 4. Установка обложки

**Сценарий:** Выбор обложки из медиа файлов

```bash
php artisan test --filter test_user_can_set_cover_image
```

**Что тестируется:**
- ✅ Установка флага is_cover
- ✅ Сброс предыдущей обложки
- ✅ Обновление порядка медиа

### 5. Сортировка медиа

**Сценарий:** Изменение порядка медиа файлов

```bash
php artisan test --filter test_user_can_update_media_order
```

**Что тестируется:**
- ✅ Обновление позиций
- ✅ Сохранение нового порядка
- ✅ Валидация данных

### 6. Фильтрация новостей

**Сценарий:** Фильтрация новостей по статусу

```bash
php artisan test --filter test_user_can_filter_news_by_status
```

**Что тестируется:**
- ✅ Фильтрация по статусу
- ✅ Корректность результатов
- ✅ Пагинация

### 7. Поиск новостей

**Сценарий:** Поиск новостей по тексту

```bash
php artisan test --filter test_user_can_search_news
```

**Что тестируется:**
- ✅ Поиск по заголовку
- ✅ Поиск по содержимому
- ✅ Регистронезависимый поиск

### 8. Валидация медиа

**Сценарий:** Валидация типов и размеров файлов

```bash
php artisan test --filter test_media_service_validates_file_types
php artisan test --filter test_media_service_validates_file_size
```

**Что тестируется:**
- ✅ Разрешенные типы файлов
- ✅ Максимальный размер файла
- ✅ MIME типы
- ✅ Обработка ошибок

### 9. Планировщик публикации

**Сценарий:** Создание запланированной новости

```bash
php artisan test --filter test_news_can_be_scheduled_for_future_publication
```

**Что тестируется:**
- ✅ Статус "Запланировано"
- ✅ Дата публикации в будущем
- ✅ Сохранение в БД

### 10. Валидация форм

**Сценарий:** Валидация данных формы

```bash
php artisan test --filter test_news_validation_works_correctly
```

**Что тестируется:**
- ✅ Обязательные поля
- ✅ Длина текста
- ✅ Формат данных
- ✅ Кастомные правила

## 🔧 Настройка тестов

### 1. Тестовая база данных

Создайте отдельную БД для тестов:

```env
# .env.testing
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_news_test
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Тестовые файлы

Создайте директорию для тестовых файлов:

```bash
mkdir -p storage/app/public/news/test
chmod 755 storage/app/public/news/test
```

### 3. Моки и заглушки

Для тестирования внешних сервисов используйте моки:

```php
// В тесте
Storage::fake('public');
```

## 📊 Метрики тестирования

### 1. Покрытие кода

```bash
# Генерация отчета о покрытии
php artisan test --coverage --coverage-html=coverage

# Просмотр отчета
open coverage/index.html
```

**Целевое покрытие:**
- Backend: 90%+
- Критические компоненты: 95%+

### 2. Производительность

```bash
# Тесты производительности
php artisan test --filter=performance

# Профилирование
php artisan test --profile
```

## 🐛 Отладка тестов

### 1. Подробный вывод

```bash
# Максимальная детализация
php artisan test --verbose --debug
```

### 2. Остановка на ошибке

```bash
# Остановка на первой ошибке
php artisan test --stop-on-failure
```

### 3. Логирование

```php
// В тесте
Log::info('Test debug info', ['data' => $data]);
```

## 🔄 CI/CD интеграция

### 1. GitHub Actions

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
        
    - name: Install dependencies
      run: composer install
      
    - name: Run tests
      run: php artisan test
```

### 2. Локальная проверка

```bash
# Перед коммитом
composer test
npm test
```

## 📝 Написание новых тестов

### 1. Структура теста

```php
/** @test */
public function test_new_functionality()
{
    // Arrange - подготовка данных
    $user = User::factory()->create();
    $this->actingAs($user);
    
    // Act - выполнение действия
    $response = $this->post('/admin/news', $data);
    
    // Assert - проверка результата
    $response->assertStatus(200);
    $this->assertDatabaseHas('news', $expectedData);
}
```

### 2. Лучшие практики

- ✅ Используйте фабрики для создания данных
- ✅ Тестируйте один сценарий в одном тесте
- ✅ Используйте описательные имена тестов
- ✅ Проверяйте как успешные, так и неуспешные сценарии
- ✅ Очищайте данные после каждого теста

## 🚨 Частые проблемы

### 1. Ошибки базы данных

```bash
# Очистка тестовой БД
php artisan migrate:fresh --env=testing
```

### 2. Проблемы с файлами

```bash
# Очистка тестовых файлов
rm -rf storage/app/public/news/test/*
```

### 3. Проблемы с кэшем

```bash
# Очистка кэша
php artisan cache:clear --env=testing
php artisan config:clear --env=testing
```

## ✅ Чек-лист тестирования

### Перед релизом:
- [ ] Все тесты проходят
- [ ] Покрытие кода > 90%
- [ ] Нет утечек памяти
- [ ] Производительность в норме
- [ ] Тесты запускаются в CI/CD
- [ ] Документация обновлена

### После изменений:
- [ ] Новые тесты написаны
- [ ] Существующие тесты обновлены
- [ ] Регрессионные тесты пройдены
- [ ] Интеграционные тесты работают

---

**Готово!** Тестирование настроено и готово к использованию.
