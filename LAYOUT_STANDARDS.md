# 📋 ЕДИНЫЙ СТАНДАРТ ДЛЯ LAYOUTFOLDERCHLANK

## 🎯 Цель
Создать единый стандарт для всех страниц, использующих `LayoutFolderChlank`, чтобы обеспечить консистентность пользовательского интерфейса и навигации.

## ✅ Текущие улучшения

### 1. **Кнопка "Назад" в верхнем левом углу**
- ✅ Добавлена на все подстраницы биоэтики
- ✅ Добавлена на страницы первичной медико-санитарной помощи
- ✅ Позиция: абсолютное позиционирование в верхнем левом углу hero-секции
- ✅ Стиль: кнопка с иконкой стрелки и названием родительской страницы

### 2. **Удаление дублирующих заголовков h1**
- ✅ Удалены дублирующие заголовки из контента страниц биоэтики
- ✅ Заголовок теперь отображается только в hero-секции

### 3. **Единообразное цветовое оформление**
- ✅ Биоэтике: синие тона (`bg-blue-100`, `hover:bg-blue-200`)
- ✅ Первичная медико-санитарная помощь: зеленые тона (`bg-green-100`, `hover:bg-green-200`)
- ✅ Стратегические инициативы: зеленые тона (`bg-green-100`, `hover:bg-green-200`)

## 📝 Стандарт использования LayoutFolderChlank

### Обязательные параметры:
```jsx
LayoutFolderChlank 
  h1="Название страницы"
  parentRoute={route('parent.route')}
  parentName="Название родительской страницы"
  heroBgColor="bg-color-100"
  buttonBgColor="bg-color-100"
  buttonHoverBgColor="hover:bg-color-200"
  buttonBorderColor="border-color-200"
>{page}</LayoutFolderChlank>
```

### Цветовая схема по направлениям:
- **Биоэтика**: `bg-blue-100`, `hover:bg-blue-200`, `border-blue-200`
- **Первичная медико-санитарная помощь**: `bg-green-100`, `hover:bg-green-200`, `border-green-200`
- **Стратегические инициативы**: `bg-green-100`, `hover:bg-green-200`, `border-green-200`
- **Медицинская статистика**: `bg-purple-100`, `hover:bg-purple-200`, `border-purple-200`
- **Электронное здравоохранение**: `bg-fuchsia-100`, `hover:bg-fuchsia-200`, `border-fuchsia-200`
- **Кадровые ресурсы**: `bg-rose-100`, `hover:bg-rose-200`, `border-rose-200`
- **Медицинское образование**: `bg-green-100`, `hover:bg-green-200`, `border-green-200`
- **Аккредитация**: `bg-yellow-100`, `hover:bg-yellow-200`, `border-yellow-200`
- **Оценка технологий**: `bg-violet-100`, `hover:bg-violet-200`, `border-violet-200`
- **Клинические протоколы**: `bg-blue-100`, `hover:bg-blue-200`, `border-blue-200`
- **Рейтинг медицинских организаций**: `bg-blue-100`, `hover:bg-blue-200`, `border-blue-200`
- **Медицинская наука**: `bg-gray-100`, `hover:bg-gray-200`, `border-gray-200`
- **Лекарственная политика**: `bg-yellow-100`, `hover:bg-yellow-200`, `border-yellow-200`
- **Национальные счета здравоохранения**: `bg-purple-100`, `hover:bg-purple-200`, `border-purple-200`
- **Медицинская статистика**: `bg-teal-100`, `hover:bg-teal-200`, `border-teal-200`
- **Отраслевой центр технологических компетенций**: `bg-orange-100`, `hover:bg-orange-200`, `border-orange-200`
- **Центр профилактики**: `bg-blue-100`, `hover:bg-blue-200`, `border-blue-200`

## 🔧 Что нужно исправить

### Страницы, требующие обновления:

#### 1. Медицинская статистика
- `resources/js/Pages/Direction/MedStats/StatData.jsx`
- `resources/js/Pages/Direction/MedStats/Reports.jsx`
- `resources/js/Pages/Direction/MedStats/Analytics.jsx`

#### 2. Электронное здравоохранение
- `resources/js/Pages/Direction/ElectronicHealth/Standards.jsx`
- `resources/js/Pages/Direction/ElectronicHealth/Regulations.jsx`
- `resources/js/Pages/Direction/ElectronicHealth/Mkb11.jsx`

#### 3. Кадровые ресурсы
- `resources/js/Pages/Direction/HumanResources/MedicalWorkers.jsx`
- `resources/js/Pages/Direction/HumanResources/Managers.jsx`
- `resources/js/Pages/Direction/HumanResources/Graduates.jsx`

#### 4. Медицинское образование
- `resources/js/Pages/Direction/MedEducation/Recommendations.jsx`
- `resources/js/Pages/Direction/MedEducation/Rating.jsx`
- `resources/js/Pages/Direction/MedEducation/Documents.jsx`

#### 5. Оценка технологий здравоохранения
- `resources/js/Pages/Direction/HealthRate/QualityCommission.jsx`
- `resources/js/Pages/Direction/HealthRate/OmtReports.jsx`

#### 6. Лекарственная политика
- `resources/js/Pages/Direction/DrugPolicy/Regulations.jsx`

#### 7. Медицинская наука
- `resources/js/Pages/Direction/MedicalScience/Tech.jsx`

## 📋 Шаблон для обновления страниц

```jsx
// В конце файла заменить:
ComponentName.layout = page => <LayoutFolderChlank h1="Название">{page}</LayoutFolderChlank>;

// На:
ComponentName.layout = page => <LayoutFolderChlank 
  h1="Название страницы"
  parentRoute={route('parent.route')}
  parentName="Название родительской страницы"
  heroBgColor="bg-color-100"
  buttonBgColor="bg-color-100"
  buttonHoverBgColor="hover:bg-color-200"
  buttonBorderColor="border-color-200"
>{page}</LayoutFolderChlank>;
```

## 🎨 Рекомендации по улучшению

### 1. **Консистентность навигации**
- Все подстраницы должны иметь кнопку "Назад"
- Кнопка должна вести на родительскую страницу направления
- Единообразное позиционирование и стиль

### 2. **Цветовое кодирование**
- Каждое направление имеет свой цвет
- Подстраницы наследуют цвет родительского направления
- Hover-эффекты соответствуют основной цветовой схеме

### 3. **Структура контента**
- Заголовок h1 только в hero-секции
- Основной контент начинается с параграфов
- Документы и материалы в отдельных секциях

### 4. **SEO и доступность**
- Правильные заголовки для поисковых систем
- Семантическая структура HTML
- Поддержка навигации с клавиатуры

## 🚀 Следующие шаги

1. **Обновить все страницы** согласно стандарту
2. **Проверить консистентность** навигации
3. **Тестировать на разных устройствах**
4. **Добавить анимации** для кнопки "Назад"
5. **Оптимизировать для мобильных устройств**

---

**Примечание**: Этот стандарт обеспечивает единообразный пользовательский опыт и упрощает навигацию по сайту.
