# Инструкция по развертыванию

## Проблема с длинными путями файлов

При развертывании могут возникнуть ошибки из-за слишком длинных путей к файлам в папке `public/storage`. Это происходит потому, что файлы с длинными именами остались в истории Git.

## ⚠️ ВАЖНО: Для CI/CD систем (GitHub Actions, GitLab CI и т.д.)

См. файл **`CI-CD-FIX.md`** для инструкций по настройке CI/CD.

## Решение для ручного развертывания

### Вариант 1: Использовать sparse-checkout (рекомендуется)

```bash
# Включить поддержку длинных путей
git config core.longpaths true

# Использовать sparse-checkout для исключения папки storage
git sparse-checkout init --cone
git sparse-checkout set '/*' '!public/storage'

# Выполнить checkout
git checkout <branch>
```

### Вариант 2: Пропустить checkout проблемной папки

```bash
# Включить поддержку длинных путей
git config core.longpaths true

# Выполнить checkout с исключением папки storage
git checkout <branch> -- . ':(exclude)public/storage'
```

### Вариант 3: Использовать скрипт

```bash
chmod +x deploy-fix.sh
./deploy-fix.sh
git checkout <branch>
```

## Примечание

Папка `public/storage` исключена из Git (добавлена в `.gitignore`), поэтому она не должна попадать в репозиторий. Если ошибки все еще возникают, это означает, что файлы остались в истории Git.

В этом случае можно:
1. Создать папку `public/storage` вручную на сервере
2. Или использовать `git sparse-checkout` для исключения этой папки из checkout

