#!/bin/bash
# Скрипт для использования в CI/CD для пропуска checkout папки storage
# Добавьте это в ваш workflow перед checkout

# Включаем поддержку длинных путей
git config core.longpaths true

# Настраиваем sparse-checkout для исключения папки storage
git sparse-checkout init --cone
git sparse-checkout set '/*' '!public/storage'

# Теперь можно выполнить обычный checkout
# git checkout <branch>

