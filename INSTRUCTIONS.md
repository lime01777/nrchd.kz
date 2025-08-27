# Инструкция по автоматическому исправлению ошибок

## 🚀 Быстрый старт

### Вариант 1: Node.js (рекомендуется)
```bash
node fix-all-errors.js
```

### Вариант 2: PowerShell (Windows)
```powershell
powershell -ExecutionPolicy Bypass -File fix-all-errors.ps1
```

## 📋 Что делает скрипт

1. **Создает резервные копии** всех файлов перед исправлением
2. **Добавляет глобальную функцию t** после импортов
3. **Заменяет локальную функцию t** на tComponent
4. **Обновляет использование t** внутри компонентов
5. **Показывает подробную статистику** исправлений

## 🔧 Файлы, которые будут исправлены

### Страницы направлений (13 файлов):
- MedicalEducation.jsx
- HumanResources.jsx
- ElectronicHealth.jsx
- MedicalAccreditation.jsx
- HealthRate.jsx
- ClinicalProtocols.jsx
- MedicalScience.jsx
- Bioethics.jsx
- DrugPolicy.jsx
- PrimaryHealthCare.jsx
- HealthAccounts.jsx
- CenterPrevention.jsx
- TechCompetence.jsx

### Страницы услуг (5 файлов):
- Training.jsx
- MedicalExpertise.jsx
- HealthTechAssessment.jsx
- DrugExpertise.jsx
- AdsEvaluation.jsx

### Страницы новостей (2 файла):
- Show.jsx
- Index.jsx

### Страницы о центре (6 файлов):
- Vacancy.jsx
- Vacancies.jsx
- SalidatKairbekova.jsx
- Partners.jsx
- FAQ.jsx
- Contacts.jsx

## ⚠️ Важные моменты

### Перед запуском:
1. **Сохраните все изменения** в редакторе
2. **Убедитесь, что сервер не запущен** (или остановите его)
3. **Сделайте git commit** текущих изменений

### После запуска:
1. **Проверьте резервные копии** в папке `backups_*`
2. **Запустите сервер** и проверьте страницы
3. **Проверьте консоль браузера** на ошибки
4. **Протестируйте основные страницы**

## 🔍 Проверка результатов

### Успешное исправление:
- ✅ Файл содержит глобальную функцию t
- ✅ Layout функция использует глобальную t
- ✅ Компонент использует tComponent
- ✅ Нет ошибок в консоли браузера

### Если есть проблемы:
1. **Восстановите из резервной копии**
2. **Исправьте файл вручную** по шаблону
3. **Проверьте синтаксис** JSX

## 🛠️ Ручное исправление (если нужно)

### Шаблон для каждого файла:

```javascript
import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import LayoutDirection from '@/Layouts/LayoutDirection';

// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};

export default function SomePage() {
    const { translations } = usePage().props;
    
    // Функция для получения перевода внутри компонента
    const tComponent = (key, fallback = '') => {
        return translations?.[key] || fallback;
    };

    return (
        <>
            <Head title={tComponent('page_title', 'Заголовок страницы')} />
            {/* остальной код */}
        </>
    );
}

SomePage.layout = (page) => <LayoutDirection img="image" h1={t('page_title', 'Заголовок страницы')}>{page}</LayoutDirection>;
```

## 📊 Ожидаемые результаты

После успешного выполнения скрипта:
- **~28 файлов** будут исправлены
- **Резервные копии** будут созданы
- **Ошибки t is not defined** исчезнут
- **Все страницы** будут работать корректно

## 🚨 Если что-то пошло не так

### Восстановление из резервной копии:
```bash
# Найти папку с резервными копиями
ls backups_*

# Восстановить конкретный файл
cp backups_*/filename.jsx.backup resources/js/Pages/.../filename.jsx
```

### Откат всех изменений:
```bash
# Если используете git
git reset --hard HEAD
git clean -fd
```

## 📞 Поддержка

Если возникли проблемы:
1. **Проверьте логи** скрипта
2. **Посмотрите резервные копии**
3. **Исправьте файлы вручную** по шаблону
4. **Проверьте синтаксис** JSX

---

**Удачи с исправлением! 🎉**
