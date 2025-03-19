# Компонент GoogleDriveFiles

Компонент для отображения документов из Google Drive в приложении.

## Особенности

- Отображение списка документов из указанной папки Google Drive
- Поддержка различных типов файлов (PDF, DOC, XLS, PPT и др.)
- Отображение иконок, соответствующих типу файла
- Отображение размера файла и даты последнего изменения
- Возможность сворачивания/разворачивания блока с документами
- Поддержка моковых данных для тестирования и разработки

## Установка

Компонент использует серверный API для взаимодействия с Google Drive. Для его работы необходимо:

1. Настроить Google Drive API в [Google Cloud Console](https://console.cloud.google.com/)
2. Добавить API ключ и Client ID в файл `.env`:

```
GOOGLE_DRIVE_API_KEY=ваш_api_ключ
GOOGLE_DRIVE_CLIENT_ID=ваш_client_id
GOOGLE_DRIVE_CLIENT_SECRET=ваш_client_secret
```

## Использование

### Базовое использование

```jsx
import GoogleDriveFiles from '@/Components/GoogleDriveFiles';

// В компоненте
<GoogleDriveFiles 
  folderId="id_папки_в_google_drive" 
  title="Название блока с документами" 
/>
```

### С возможностью сворачивания/разворачивания

```jsx
<GoogleDriveFiles 
  folderId="id_папки_в_google_drive" 
  title="Название блока с документами" 
  collapsible={true}
/>
```

### Использование моковых данных (для разработки)

```jsx
<GoogleDriveFiles 
  folderId="mock_folder_id" 
  title="Моковые документы" 
/>
```

## Параметры (Props)

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `folderId` | string | - | ID папки в Google Drive (обязательный) |
| `title` | string | - | Заголовок блока с документами |
| `className` | string | '' | Дополнительные CSS классы |
| `collapsible` | boolean | false | Возможность сворачивания/разворачивания блока |

## Серверная часть

Компонент использует серверный API для безопасного взаимодействия с Google Drive. API реализован в контроллере `GoogleDriveController` и доступен по следующим маршрутам:

- `GET /api/google-drive/files?folderId={folderId}` - получение списка файлов из папки
- `GET /api/google-drive/file-metadata?fileId={fileId}` - получение метаданных файла

## Примечания по безопасности

- Не храните API ключи на клиентской стороне
- Используйте серверный API для взаимодействия с Google Drive
- Настройте CORS и другие меры безопасности для защиты вашего API
- Ограничьте доступ к API только авторизованным пользователям

## Пример интеграции

Пример интеграции компонента можно увидеть на странице `/examples/google-drive`.
