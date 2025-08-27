# Система "Клиники" для nrchd.kz

## Обзор

Полноценная система управления клиниками для сайта nrchd.kz, включающая публичные страницы и админ-панель для управления контентом.

## Технологический стек

- **Backend**: Laravel 10, PHP 8.2, MariaDB
- **Frontend**: Inertia.js, React, Tailwind CSS
- **Интернационализация**: Многоязычная поддержка (ru/kk/en)
- **SEO**: Мета-теги, Open Graph, JSON-LD структурированные данные

## Структура базы данных

### Таблица `clinics`
- `id` - первичный ключ
- `slug` - уникальный URL-идентификатор (автогенерация из name_ru)
- `name_ru`, `name_kk`, `name_en` - названия клиники
- `short_desc_ru`, `short_desc_kk`, `short_desc_en` - краткие описания
- `full_desc_ru`, `full_desc_kk`, `full_desc_en` - полные описания
- `city_ru`, `city_kk`, `city_en` - города
- `address_ru`, `address_kk`, `address_en` - адреса
- `phone`, `email`, `website` - контактная информация
- `working_hours` - JSON с рабочими часами
- `specialties` - JSON массив специализаций
- `services` - JSON массив услуг
- `accreditations` - JSON массив аккредитаций
- `equipment` - JSON массив оборудования
- `map_lat`, `map_lng` - координаты для карты
- `logo_path`, `hero_path` - пути к изображениям
- `gallery` - JSON массив путей к галерее
- `is_published` - статус публикации
- `publish_at` - дата публикации
- `seo_title_ru`, `seo_title_kk`, `seo_title_en` - SEO заголовки
- `seo_desc_ru`, `seo_desc_kk`, `seo_desc_en` - SEO описания
- `created_at`, `updated_at` - временные метки

### Таблица `clinic_doctors`
- `id` - первичный ключ
- `clinic_id` - внешний ключ к клинике
- `name_ru`, `name_kk`, `name_en` - имена врачей
- `position_ru`, `position_kk`, `position_en` - должности
- `photo_path` - путь к фото
- `contacts` - JSON с контактами
- `is_featured` - признак избранного врача
- `created_at`, `updated_at` - временные метки

## Установка и настройка

### 1. Миграции
```bash
php artisan migrate
```

### 2. Сидеры
```bash
php artisan db:seed --class=ClinicSeeder
```

### 3. Сборка фронтенда
```bash
npm install
npm run build
```

### 4. Создание папки для изображений
```bash
mkdir -p public/img/clinics
chmod 755 public/img/clinics
```

## Маршруты

### Публичные маршруты
- `GET /clinics` - список клиник с фильтрами
- `GET /clinics/{slug}` - детальная страница клиники

### Админские маршруты
- `GET /admin/clinics` - список клиник в админке
- `GET /admin/clinics/create` - создание клиники
- `POST /admin/clinics` - сохранение клиники
- `GET /admin/clinics/{clinic}` - просмотр клиники
- `GET /admin/clinics/{clinic}/edit` - редактирование клиники
- `PUT /admin/clinics/{clinic}` - обновление клиники
- `DELETE /admin/clinics/{clinic}` - удаление клиники
- `POST /admin/clinics/{clinic}/images` - загрузка изображений
- `DELETE /admin/clinics/{clinic}/images` - удаление изображений
- `PUT /admin/clinics/{clinic}/gallery/reorder` - изменение порядка галереи

## Компоненты

### React компоненты
- `Clinics/Index.jsx` - страница списка клиник
- `Clinics/Show.jsx` - страница детального просмотра
- `ClinicCard.jsx` - карточка клиники в списке
- `ClinicDetail.jsx` - детальный компонент клиники (переиспользуемый)
- `Chips.jsx` - компонент для отображения тегов
- `MediaGallery.jsx` - галерея изображений
- `ContactModal.jsx` - модальное окно с контактами
- `KeyValue.jsx` - компонент ключ-значение
- `SearchInput.jsx` - поле поиска
- `Select.jsx` - выпадающий список
- `Pagination.jsx` - пагинация

### PHP классы
- `Clinic` - модель клиники
- `ClinicDoctor` - модель врача клиники
- `ClinicController` - публичный контроллер
- `Admin\ClinicController` - админский контроллер
- `StoreClinicRequest` - валидация создания
- `UpdateClinicRequest` - валидация обновления
- `ClinicsResource` - API ресурс для списка
- `ClinicResource` - API ресурс для деталей
- `ClinicSeeder` - сидер с демо-данными

## Функциональность

### Публичная часть
- **Список клиник** с фильтрацией по:
  - Городу
  - Специализации
  - Поиску по названию
- **Пагинация** (12 клиник на страницу)
- **Детальная страница** с:
  - Полной информацией о клинике
  - Списком врачей
  - Галереей изображений
  - Контактной информацией
  - Рабочими часами
  - Картой (заглушка)

### Админская часть
- **CRUD операции** для клиник
- **Управление изображениями**:
  - Загрузка логотипа и главного изображения
  - Галерея с drag-and-drop
  - Изменение порядка изображений
- **Локализация** всех полей (ru/kk/en)
- **SEO настройки** для каждой страницы
- **Управление врачами** клиники

## Интернационализация

### Файлы переводов
- `resources/lang/ru/clinics.php`
- `resources/lang/kk/clinics.php`
- `resources/lang/en/clinics.php`

### Использование в компонентах
```javascript
const { translations } = usePage().props;
const t = (key, fallback = '') => {
    return translations?.[key] || fallback;
};
```

## SEO оптимизация

### Мета-теги
- Динамические title и description
- Open Graph теги
- Canonical ссылки

### JSON-LD структурированные данные
```javascript
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Название клиники",
  "description": "Описание клиники",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Город",
    "addressCountry": "KZ"
  },
  "telephone": "+7-xxx-xxx-xxxx",
  "email": "email@example.com"
}
```

## Переиспользование компонента ClinicDetail

Компонент `ClinicDetail` можно использовать на других страницах:

```javascript
import ClinicDetail from '@/Components/ClinicDetail';

// В компоненте
<ClinicDetail clinic={clinicData} />
```

## Тестирование

### Запуск тестов
```bash
php artisan test --filter=ClinicBasicTest
```

### Тестируемые функции
- Загрузка страниц
- Существование маршрутов
- Существование моделей и контроллеров
- Валидация данных
- Отношения между моделями

## Производительность

### Оптимизации
- Eager loading для связанных данных
- Пагинация результатов
- Lazy loading изображений
- Responsive изображения с srcset
- Кэширование переводов

### Рекомендации
- Использовать CDN для изображений
- Настроить кэширование страниц
- Оптимизировать размеры изображений
- Использовать WebP формат

## Безопасность

### Защита админских маршрутов
- Middleware `admin` для всех админских маршрутов
- Gate `manage-content` для проверки прав
- Валидация всех входных данных
- Защита от XSS и CSRF атак

### Валидация файлов
- Проверка типов файлов
- Ограничение размеров
- Безопасные имена файлов
- Проверка содержимого изображений

## Расширение функциональности

### Возможные улучшения
- Интеграция с картами (Google Maps, Yandex Maps)
- Система отзывов и рейтингов
- Онлайн-запись к врачу
- Интеграция с календарем
- Система уведомлений
- API для мобильных приложений

### Добавление новых полей
1. Создать миграцию для новых полей
2. Обновить модель с новыми полями
3. Добавить валидацию в Request классы
4. Обновить Resource классы
5. Добавить поля в админские формы
6. Обновить компоненты отображения

## Поддержка

При возникновении проблем:
1. Проверить логи Laravel (`storage/logs/laravel.log`)
2. Проверить права доступа к папкам
3. Убедиться в корректности настроек базы данных
4. Проверить сборку фронтенда

## Лицензия

Система разработана для nrchd.kz и является частью основного проекта.
