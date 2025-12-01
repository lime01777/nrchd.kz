#!/bin/bash
# Скрипт для исправления проблемы с длинными путями при развертывании
# Использование: ./deploy-fix.sh

echo "Настройка Git для работы с длинными путями..."

# Включаем поддержку длинных путей
git config core.longpaths true

# Используем sparse-checkout для исключения проблемной папки
git sparse-checkout init --cone
git sparse-checkout set '/*' '!public/storage'

echo "Готово! Теперь можно выполнить git checkout"
echo "Или используйте: git checkout -- . ':(exclude)public/storage'"

