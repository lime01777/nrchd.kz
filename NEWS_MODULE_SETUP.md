# Модуль "Новости" - Инструкция по установке

## Установка зависимостей

1. Установите intervention/image:
```bash
composer require intervention/image-laravel
php artisan vendor:publish --provider="Intervention\Image\Laravel\ServiceProvider" --tag=config
```

2. Установите npm зависимости (если еще не установлены):
```bash
npm install
```

## Миграция базы данных

1. Выполните миграцию:
```bash
php artisan migrate
```

2. Создайте симлинк для storage:
```bash
php artisan storage:link
```

3. Убедитесь, что в `.env` установлен корректный `APP_URL`:
```
APP_URL=https://nrchd.kz
```

## Создание placeholder изображений

Создайте директории и placeholder изображения:
```bash
mkdir -p public/images/placeholders
```

Создайте файлы:
- `public/images/placeholders/news-cover.jpg` (1600x800px)
- `public/images/placeholders/news-cover-thumb.jpg` (800x400px)

## Заполнение тестовыми данными (опционально)

```bash
php artisan db:seed --class=NewsSeeder
```

## Права доступа

Убедитесь, что на сервере установлены правильные права:
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## Использование

### Админка

- Список новостей: `/admin/news`
- Создание новости: `/admin/news/create`
- Редактирование: `/admin/news/{id}/edit`

### Публичные страницы

- Список новостей: `/news`
- Детальная страница: `/news/{slug}`

## Особенности

1. **Автогенерация slug**: Slug автоматически генерируется из заголовка при создании/обновлении
2. **Генерация миниатюр**: При загрузке обложки автоматически создается миниатюра 800px по ширине
3. **Soft Deletes**: Новости удаляются "мягко" (можно восстановить)
4. **Политики доступа**: Только admin и editor могут создавать/редактировать новости
5. **SEO**: Поддержка SEO-полей (title, description, OpenGraph)

## Тестирование

Запустите тесты:
```bash
php artisan test --filter NewsModuleTest
```

## Диагностика

- Сгенерировать отчёт в консоль: `php artisan news:diagnose`
- Чек-лист в Markdown: `php artisan news:diagnose --report=markdown > storage/logs/news_checklist.md`
- JSON-отчёт: `php artisan news:diagnose --report=json > storage/logs/news_diagnose.json`
- Быстрая проверка перед релизом: `./scripts/check-news.sh` (не забудьте сделать файл исполняемым `chmod +x scripts/check-news.sh`)

