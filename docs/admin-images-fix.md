# Исправление отображения и загрузки изображений в админке

## Проблема
При создании и редактировании новостей в админке изображения не отображались, не загружались и не сохранялись корректно.

## Причины
1. В контроллере админки (`app/Http/Controllers/Admin/NewsController.php`) не было правильного преобразования путей к изображениям в полные URL для отображения в интерфейсе.
2. В форме создания новостей (`resources/js/Pages/Admin/News/Create.jsx`) файлы не передавались правильно в состояние формы.
3. Использовался `router.post()` вместо `post()` из `useForm`, что могло вызывать проблемы с отправкой файлов.

## Исправления

### 1. Добавлен метод `getFullImageUrl`
Добавлен приватный метод для преобразования путей к изображениям в полные URL:

```php
private function getFullImageUrl($path)
{
    if (empty($path)) {
        return null;
    }
    
    // Если путь уже является полным URL
    if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) {
        return $path;
    }
    
    // Если путь начинается с /storage/
    if (strpos($path, '/storage/') === 0) {
        $absolutePath = substr($path, 1);
        return asset($absolutePath);
    }
    
    // Если путь начинается с storage/
    if (strpos($path, 'storage/') === 0) {
        return asset($path);
    }
    
    // Если путь начинается с news/
    if (strpos($path, 'news/') === 0) {
        return asset('storage/' . $path);
    }
    
    // Если путь начинается с /news/
    if (strpos($path, '/news/') === 0) {
        return asset('storage' . $path);
    }
    
    // В остальных случаях добавляем /img/news/
    return '/img/news/' . basename($path);
}
```

### 2. Исправлен метод `index`
В методе `index` добавлено преобразование изображений для отображения в списке новостей:

```php
// Преобразуем изображения для отображения в админке
$news->transform(function ($item) {
    if (is_array($item->images)) {
        $item->images = array_map(function($img) {
            return $this->getFullImageUrl($img);
        }, $item->images);
    }
    if ($item->main_image) {
        $item->main_image = $this->getFullImageUrl($item->main_image);
    }
    return $item;
});
```

### 3. Исправлен метод `edit`
В методе `edit` добавлено преобразование изображений для отображения при редактировании:

```php
// Преобразуем пути к изображениям для отображения в админке
$processedImages = [];
if (is_array($news->images)) {
    $processedImages = array_map(function($img) {
        return $this->getFullImageUrl($img);
    }, $news->images);
}

return Inertia::render('Admin/News/Edit', [
    'news' => [
        'id' => $news->id,
        'title' => $news->title,
        'slug' => $news->slug,
        'content' => $news->content,
        'category' => $news->category,
        'status' => $news->status,
        'publishDate' => $news->formatted_publish_date,
        'images' => $processedImages,
        'main_image' => $news->main_image ? $this->getFullImageUrl($news->main_image) : null,
    ],
]);
```

### 4. Исправлена форма создания новостей
В файле `resources/js/Pages/Admin/News/Create.jsx`:

- Добавлено создание FormData для правильной передачи файлов
- Изменен способ отправки формы для поддержки файлов через fetch API:

```javascript
// Создаем FormData для правильной передачи файлов
const formData = new FormData();

// Добавляем основные данные
formData.append('title', data.title || '');
formData.append('content', data.content || '');
formData.append('status', data.status || 'Черновик');

// Добавляем файлы изображений
if (validImageFiles.length > 0) {
  validImageFiles.forEach(file => {
    formData.append('image_files[]', file);
  });
}

// Отправляем FormData через fetch API
fetch(route('admin.news.store'), {
  method: 'POST',
  body: formData,
  headers: {
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    'Accept': 'application/json',
  },
})
.then(response => response.json())
.then(result => {
  if (result.success) {
    router.visit(route('admin.news'));
  }
});
```

### 5. Добавлена поддержка AJAX в контроллере
В файле `app/Http/Controllers/Admin/NewsController.php`:

- Добавлена проверка типа запроса (AJAX или обычный)
- Добавлена поддержка JSON ответов для AJAX запросов
- Улучшена обработка ошибок для разных типов запросов

## Результат
- Изображения теперь корректно отображаются в админке при создании и редактировании новостей
- Файлы правильно загружаются и сохраняются при создании новостей
- Поддерживаются различные форматы путей к изображениям (старые и новые)
- Обеспечена обратная совместимость с существующими изображениями

## Тестирование
Для проверки работы исправлений:
1. Создайте новую новость через админку с изображениями
2. Проверьте, что изображения отображаются в форме создания
3. Сохраните новость и проверьте, что изображения сохранились
4. Отредактируйте новость и убедитесь, что изображения отображаются корректно

## Файлы изменены
- `app/Http/Controllers/Admin/NewsController.php`
- `resources/js/Pages/Admin/News/Create.jsx`
