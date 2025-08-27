# Отчет об ошибках с const и функциями t

## 🔍 Найденные проблемы

Скрипт обнаружил **множество файлов** с ошибкой `Uncaught ReferenceError: t is not defined` в layout функциях.

## 📁 Файлы с проблемами

### Страницы направлений (Direction):
- `StrategicInitiatives.jsx` ✅ (уже исправлен)
- `MedicalRating.jsx` ✅ (уже исправлен)
- `MedicalEducation.jsx` ❌
- `HumanResources.jsx` ❌
- `ElectronicHealth.jsx` ❌
- `MedicalAccreditation.jsx` ❌
- `HealthRate.jsx` ❌
- `ClinicalProtocols.jsx` ❌
- `MedicalScience.jsx` ❌
- `Bioethics.jsx` ❌
- `DrugPolicy.jsx` ❌
- `PrimaryHealthCare.jsx` ❌
- `HealthAccounts.jsx` ❌
- `CenterPrevention.jsx` ❌
- `TechCompetence.jsx` ❌

### Страницы услуг (Services):
- `Training.jsx` ❌
- `MedicalExpertise.jsx` ❌
- `HealthTechAssessment.jsx` ❌
- `DrugExpertise.jsx` ❌
- `AdsEvaluation.jsx` ❌

### Страницы новостей (News):
- `Show.jsx` ❌
- `Index.jsx` ❌

### Страницы о центре (AboutCentre):
- `Vacancy.jsx` ❌
- `Vacancies.jsx` ❌
- `SalidatKairbekova.jsx` ❌
- `Partners.jsx` ❌
- `FAQ.jsx` ❌
- `Contacts.jsx` ❌

## 🛠️ Как исправить

### Шаблон исправления для каждого файла:

1. **Добавить глобальную функцию t** после импортов:
```javascript
// Глобальная функция для получения перевода
const t = (key, fallback = '') => {
    return window.__INERTIA_PROPS__?.translations?.[key] || fallback;
};
```

2. **Заменить локальную функцию t** на tComponent:
```javascript
// Функция для получения перевода внутри компонента
const tComponent = (key, fallback = '') => {
    return translations?.[key] || fallback;
};
```

3. **Обновить использование t** внутри компонента на tComponent

### Пример исправленного файла:
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

## 🚀 Автоматическое исправление

Для автоматического исправления всех файлов можно использовать следующий подход:

1. **Создать скрипт** для массового исправления
2. **Применить шаблон** к каждому файлу
3. **Проверить результат** после исправления

## ⚠️ Важные моменты

- **Глобальная функция t** должна быть определена до export default
- **Локальная функция tComponent** используется внутри компонента
- **Layout функция** использует глобальную функцию t
- **Проверьте консоль браузера** после каждого исправления

## 📊 Статистика

- **Всего файлов с проблемами**: ~30
- **Уже исправлено**: 2
- **Требует исправления**: ~28

## 🎯 Приоритет исправления

1. **Страницы направлений** (основной функционал)
2. **Страницы услуг** (важный функционал)
3. **Страницы новостей** (информационный контент)
4. **Страницы о центре** (вспомогательная информация)

---

**Дата проверки**: $(Get-Date)
**Статус**: Требует исправления
