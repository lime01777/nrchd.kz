# 🔄 ИНСТРУКЦИЯ ДЛЯ ОБНОВЛЕНИЯ НА ХОСТИНГЕ

**ПРОБЛЕМА**: На хостинге все еще используются старые пути `/storage/news/` вместо новых `/img/news/`

## 📋 Что нужно обновить на хостинге

### 1. Критически важные файлы для загрузки:

#### Контроллеры:
- ✅ `app/Http/Controllers/Admin/NewsController.php` - обновлен
- ✅ `app/Http/Controllers/Admin/OptimizedNewsController.php` - **КРИТИЧНО** - используется для создания новостей, **НОВОЕ** - поддержка медиа файлов
- ✅ `app/Http/Controllers/Api/ImageController.php` - обновлен
- ✅ `app/Http/Controllers/NewsController.php` - обновлен

#### React компоненты:
- ✅ `resources/js/Components/NewsImageSlider.jsx` - обновлен
- ✅ `resources/js/Components/NewsSliderWithMain.jsx` - обновлен
- ✅ `resources/js/Components/FileManager/SimpleImageManager.jsx` - обновлен
- ✅ `resources/js/Components/SimpleFileDisplay.jsx` - обновлен
- ✅ `resources/js/Components/FileManager.jsx` - обновлен
- ✅ `resources/js/Components/FileManager/ImagePreview.jsx` - обновлен
- ✅ `resources/js/Pages/Admin/News/Edit.jsx` - обновлен
- ✅ `resources/js/Components/Header.jsx` - обновлен (сбалансированное меню)
- ✅ `resources/js/Components/Directions.jsx` - **НОВОЕ** - добавлены все направления

#### **НОВЫЕ компоненты медиа:**
- ✅ `resources/js/Components/FileManager/MediaManager.jsx` - **НОВЫЙ** - универсальный медиа менеджер
- ✅ `resources/js/Components/CompactMediaGallery.jsx` - **НОВЫЙ** - галерея медиа
- ✅ `resources/js/Components/NewsMediaDisplay.jsx` - **НОВЫЙ** - отображение медиа в новостях
- ✅ `resources/js/Pages/Admin/News/Create.jsx` - **ОБНОВЛЕН** - поддержка медиа

#### Страницы биоэтики:
- ✅ `resources/js/Pages/Direction/Bioethics/Expertise.jsx` - **ОБНОВЛЕНО** - добавлена кнопка "Назад"
- ✅ `resources/js/Pages/Direction/Bioethics/Certification.jsx` - **ОБНОВЛЕНО** - добавлена кнопка "Назад"
- ✅ `resources/js/Pages/Direction/Bioethics/Biobanks.jsx` - **ОБНОВЛЕНО** - добавлена кнопка "Назад"
- ✅ `resources/js/Pages/Direction/Bioethics/LocalCommissions.jsx` - **ОБНОВЛЕНО** - добавлена кнопка "Назад"

#### Страницы первичной медико-санитарной помощи:
- ✅ `resources/js/Pages/Direction/PrimaryHealthCare/Prevention.jsx` - **ОБНОВЛЕНО** - добавлена кнопка "Назад"
- ✅ `resources/js/Pages/Direction/PrimaryHealthCare/Outpatient.jsx` - **ОБНОВЛЕНО** - добавлена кнопка "Назад"

#### Маршруты:
- ✅ `routes/web.php` - **ОБНОВЛЕН** - убрано "direction" из путей биоэтики

#### Миграция:
- ✅ `database/migrations/2025_08_12_043147_update_news_image_paths_to_img_folder.php` - **ИСПРАВЛЕНА** - теперь проверяет существование колонок

#### Документация:
- ✅ `LAYOUT_STANDARDS.md` - **НОВЫЙ** - единый стандарт для LayoutFolderChlank
- ✅ `MEDIA_FUNCTIONALITY.md` - **НОВЫЙ** - документация по медиа функциональности

## �� КРИТИЧЕСКАЯ ПРОБЛЕМА

В логах видно, что новые новости создаются со старыми путями:
```
[2025-08-12 04:44:44] local.INFO: Original image path {"path":"/storage/news/1754973882_0.jpg"}
```

Это означает, что на хостинге используется **СТАРАЯ ВЕРСИЯ** `OptimizedNewsController.php`.

## 🎥 НОВАЯ ФУНКЦИОНАЛЬНОСТЬ: МЕДИА В НОВОСТЯХ

### Что добавлено:
- ✅ **Поддержка видео** в новостях (MP4, AVI, MOV, WMV, FLV, WebM)
- ✅ **Автоматическое определение типа контента**:
  - Одно изображение → основное изображение
  - Несколько изображений → слайдер
  - Видео → видео плеер
- ✅ **Универсальный медиа менеджер** с табами для изображений и видео
- ✅ **Загрузка файлов** до 50MB для видео, 5MB для изображений
- ✅ **До 10 файлов** на новость

### Новые папки:
```
public/
├── img/news/          # Изображения (существующая)
└── videos/news/       # Видео (НОВАЯ)
```

## 🔧 Шаги для исправления

### Шаг 1: Загрузить обновленные файлы
```bash
# Загрузить все обновленные файлы на хостинг
# Особенно важно:
- app/Http/Controllers/Admin/OptimizedNewsController.php
- app/Http/Controllers/Admin/NewsController.php
- app/Http/Controllers/Api/ImageController.php
- app/Http/Controllers/NewsController.php
- database/migrations/2025_08_12_043147_update_news_image_paths_to_img_folder.php
- routes/web.php
- resources/js/Components/Directions.jsx
- resources/js/Components/Header.jsx
- resources/js/Pages/Direction/Bioethics/*.jsx
- resources/js/Pages/Direction/PrimaryHealthCare/*.jsx

# НОВЫЕ файлы медиа:
- resources/js/Components/FileManager/MediaManager.jsx
- resources/js/Components/CompactMediaGallery.jsx
- resources/js/Components/NewsMediaDisplay.jsx
- resources/js/Pages/Admin/News/Create.jsx
```

### Шаг 2: Создать папки для медиа
```bash
# На хостинге создать папки
mkdir -p public/img/news
mkdir -p public/videos/news
chmod 755 public/img/news
chmod 755 public/videos/news
```

### Шаг 3: Запустить миграцию
```bash
php artisan migrate
```

### Шаг 4: Пересобрать фронтенд
```bash
npm run build
```

### Шаг 5: Скопировать существующие изображения
```bash
# Скопировать изображения из старой папки в новую
cp -r public/storage/news/* public/img/news/
```

## 📊 Проверка после обновления

### 1. Проверить создание новой новости:
- Создать новость с изображением
- Проверить логи - должен быть путь `/img/news/`
- Проверить, что файл сохранился в `public/img/news/`

### 2. Проверить создание новости с видео:
- Создать новость с видео файлом
- Проверить, что видео сохранилось в `public/videos/news/`
- Проверить отображение видео на странице новости

### 3. Проверить медиа менеджер:
- Открыть создание новости
- Нажать "Выбрать медиа из библиотеки"
- Проверить табы "Изображения" и "Видео"
- Проверить кнопку "Загрузить файлы"

### 4. Проверить отображение существующих новостей:
- Открыть страницу любой новости
- Проверить консоль браузера - не должно быть ошибок 404
- Изображения должны загружаться

### 5. Проверить редактирование:
- Отредактировать существующую новость
- Проверить, что не зависает при сохранении

### 6. Проверить новое меню:
- Открыть выпадающее меню "Направления"
- Проверить, что "Центральная комиссия по биоэтике" находится в правой колонке
- Проверить, что колонки сбалансированы (по 8 ссылок в каждой)

### 7. Проверить главную страницу:
- Открыть главную страницу
- Проверить секцию "Направления"
- Убедиться, что все 16 направлений отображаются (включая биоэтику)
- Проверить кнопку "Все направления"

### 8. Проверить страницы биоэтики:
- Открыть `/bioethics` - главная страница биоэтики
- Открыть `/bioethics/expertise` - проверить кнопку "Назад" в левом верхнем углу
- Открыть `/bioethics/certification` - проверить кнопку "Назад"
- Открыть `/bioethics/biobanks` - проверить кнопку "Назад"
- Открыть `/bioethics/local-commissions` - проверить кнопку "Назад"

### 9. Проверить навигацию:
- На всех подстраницах биоэтики должна быть кнопка "Назад"
- Кнопка должна вести на главную страницу биоэтики
- Кнопка должна иметь синий цвет и hover-эффект
- На страницах первичной медико-санитарной помощи кнопка должна быть зеленой

### 10. Проверить медиа функциональность:
- Создать новость с одним изображением - должно отображаться как основное
- Создать новость с несколькими изображениями - должен появиться слайдер
- Создать новость с видео - должен появиться видео плеер
- Проверить, что старые новости продолжают работать

## 🔍 Диагностика

### Если проблема остается:

1. **Проверить кэш**:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

2. **Проверить права доступа**:
```bash
chmod -R 755 public/img/news/
chmod -R 755 public/videos/news/
chown -R www-data:www-data public/img/news/
chown -R www-data:www-data public/videos/news/
```

3. **Проверить логи Laravel**:
```bash
tail -f storage/logs/laravel.log
```

## ⚠️ ВАЖНО

- **OptimizedNewsController.php** - это основной контроллер для создания новостей на хостинге
- Он должен быть обновлен в первую очередь
- После обновления нужно протестировать создание новой новости
- Если пути все еще старые, значит файл не обновился
- **Миграция теперь безопасна** - она проверяет существование колонок перед их обновлением
- **Пути биоэтики изменены** - убрано "direction" из URL
- **Добавлены кнопки "Назад"** на все подстраницы биоэтики и первичной медико-санитарной помощи
- **Создан единый стандарт** для LayoutFolderChlank (см. LAYOUT_STANDARDS.md)
- **Добавлена поддержка медиа** - изображения и видео в новостях (см. MEDIA_FUNCTIONALITY.md)

## 🎨 Новые улучшения навигации

### Кнопка "Назад":
- Позиция: верхний левый угол hero-секции
- Стиль: кнопка с иконкой стрелки и названием родительской страницы
- Цвет: соответствует направлению (синий для биоэтики, зеленый для ПМСП)
- Hover-эффект: изменение цвета фона

### Единый стандарт:
- Все подстраницы должны иметь кнопку "Назад"
- Заголовок h1 только в hero-секции
- Единообразное цветовое оформление по направлениям
- Консистентная структура контента

## 🎥 Новая медиа функциональность

### Автоматическое определение типа контента:
- **Одно изображение** → основное изображение
- **Несколько изображений** → слайдер с навигацией
- **Видео** → видео плеер с контролами

### Поддерживаемые форматы:
- **Изображения**: JPG, PNG, GIF, WebP (до 5MB)
- **Видео**: MP4, AVI, MOV, WMV, FLV, WebM (до 50MB)
- **Количество**: до 10 файлов на новость

---

**Приоритет: Обновить OptimizedNewsController.php на хостинге!** 🚨
