const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Пути к файлам
const localesPath = path.join(__dirname, 'resources/js/Locales');
const componentsPath = path.join(__dirname, 'resources/js/Components');
const pagesPath = path.join(__dirname, 'resources/js/Pages');

// Читаем JSON файлы переводов
const ruTranslations = JSON.parse(fs.readFileSync(path.join(localesPath, 'ru.json'), 'utf8'));
const kzTranslations = JSON.parse(fs.readFileSync(path.join(localesPath, 'kz.json'), 'utf8'));
const enTranslations = JSON.parse(fs.readFileSync(path.join(localesPath, 'en.json'), 'utf8'));

// Функция для получения всех ключей из объекта (включая вложенные)
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Получаем все ключи из всех языков
const ruKeys = new Set(getAllKeys(ruTranslations));
const kzKeys = new Set(getAllKeys(kzTranslations));
const enKeys = new Set(getAllKeys(enTranslations));

console.log('=== АНАЛИЗ ПЕРЕВОДОВ ===\n');
console.log(`Всего ключей в ru.json: ${ruKeys.size}`);
console.log(`Всего ключей в kz.json: ${kzKeys.size}`);
console.log(`Всего ключей в en.json: ${enKeys.size}\n`);

// Находим недостающие ключи
const missingInKz = [...ruKeys].filter(key => !kzKeys.has(key));
const missingInEn = [...ruKeys].filter(key => !enKeys.has(key));
const missingInRu = [...kzKeys].filter(key => !ruKeys.has(key));

console.log(`Недостающих ключей в kz.json: ${missingInKz.length}`);
console.log(`Недостающих ключей в en.json: ${missingInEn.length}`);
console.log(`Недостающих ключей в ru.json: ${missingInRu.length}\n`);

// Функция для установки значения по пути
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// Функция для получения значения по пути
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

// Добавляем недостающие ключи в kz.json
if (missingInKz.length > 0) {
  console.log('Добавляем недостающие ключи в kz.json...');
  missingInKz.forEach(key => {
    const ruValue = getNestedValue(ruTranslations, key);
    if (ruValue) {
      setNestedValue(kzTranslations, key, ruValue); // Временно используем ru значение
    }
  });
  fs.writeFileSync(path.join(localesPath, 'kz.json'), JSON.stringify(kzTranslations, null, 2), 'utf8');
  console.log(`Добавлено ${missingInKz.length} ключей в kz.json\n`);
}

// Добавляем недостающие ключи в en.json
if (missingInEn.length > 0) {
  console.log('Добавляем недостающие ключи в en.json...');
  missingInEn.forEach(key => {
    const ruValue = getNestedValue(ruTranslations, key);
    if (ruValue) {
      setNestedValue(enTranslations, key, ruValue); // Временно используем ru значение
    }
  });
  fs.writeFileSync(path.join(localesPath, 'en.json'), JSON.stringify(enTranslations, null, 2), 'utf8');
  console.log(`Добавлено ${missingInEn.length} ключей в en.json\n`);
}

// Добавляем недостающие ключи в ru.json
if (missingInRu.length > 0) {
  console.log('Добавляем недостающие ключи в ru.json...');
  missingInRu.forEach(key => {
    const kzValue = getNestedValue(kzTranslations, key);
    if (kzValue) {
      setNestedValue(ruTranslations, key, kzValue); // Временно используем kz значение
    }
  });
  fs.writeFileSync(path.join(localesPath, 'ru.json'), JSON.stringify(ruTranslations, null, 2), 'utf8');
  console.log(`Добавлено ${missingInRu.length} ключей в ru.json\n`);
}

// Выводим отчет
console.log('=== ОТЧЕТ ===\n');
if (missingInKz.length > 0) {
  console.log(`Недостающие ключи в kz.json (первые 20):`);
  missingInKz.slice(0, 20).forEach(key => console.log(`  - ${key}`));
  if (missingInKz.length > 20) {
    console.log(`  ... и еще ${missingInKz.length - 20} ключей`);
  }
  console.log('');
}

if (missingInEn.length > 0) {
  console.log(`Недостающие ключи в en.json (первые 20):`);
  missingInEn.slice(0, 20).forEach(key => console.log(`  - ${key}`));
  if (missingInEn.length > 20) {
    console.log(`  ... и еще ${missingInEn.length - 20} ключей`);
  }
  console.log('');
}

if (missingInRu.length > 0) {
  console.log(`Недостающие ключи в ru.json (первые 20):`);
  missingInRu.slice(0, 20).forEach(key => console.log(`  - ${key}`));
  if (missingInRu.length > 20) {
    console.log(`  ... и еще ${missingInRu.length - 20} ключей`);
  }
  console.log('');
}

console.log('Анализ завершен!');

