-- SQL-скрипт для исправления таблицы news на хостинге
-- Выполните этот запрос в phpMyAdmin или через SSH

-- Проверяем, существует ли колонка images
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'news' 
  AND COLUMN_NAME = 'images';

-- Добавляем колонку images, если её нет
ALTER TABLE `news` ADD COLUMN `images` JSON NULL AFTER `content`;

-- Проверяем результат
DESCRIBE `news`;
