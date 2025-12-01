# Исправление ошибок checkout в CI/CD

## Проблема
При автоматическом развертывании через CI/CD (GitHub Actions, GitLab CI и т.д.) возникают ошибки:
```
unable to create file public/storage/...: File name too long
```

## Решение для GitHub Actions

Добавьте эти шаги в ваш workflow файл (`.github/workflows/*.yml`) **перед** шагом checkout:

```yaml
- name: Configure Git for long paths
  run: |
    git config core.longpaths true
    git sparse-checkout init --cone
    git sparse-checkout set '/*' '!public/storage'

- name: Checkout code
  uses: actions/checkout@v3
  with:
    sparse-checkout: |
      /*
      !public/storage
```

Или используйте полный пример:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure Git
        run: |
          git config core.longpaths true
          git sparse-checkout init --cone
          git sparse-checkout set '/*' '!public/storage'
      
      - name: Checkout code
        uses: actions/checkout@v3
      
      # Остальные шаги развертывания...
```

## Решение для GitLab CI

Добавьте в ваш `.gitlab-ci.yml`:

```yaml
before_script:
  - git config core.longpaths true
  - git sparse-checkout init --cone
  - git sparse-checkout set '/*' '!public/storage'
```

## Решение для других CI/CD систем

Используйте скрипт `checkout-skip-storage.sh`:

```bash
chmod +x checkout-skip-storage.sh
./checkout-skip-storage.sh
git checkout <branch>
```

## Альтернативное решение

Если sparse-checkout не работает, используйте checkout с исключением:

```bash
git config core.longpaths true
git checkout <branch> -- . ':(exclude)public/storage'
```

## Примечание

Папка `public/storage` уже исключена из Git (добавлена в `.gitignore`), поэтому новые файлы не попадут в репозиторий. Проблема только со старыми файлами в истории Git.

