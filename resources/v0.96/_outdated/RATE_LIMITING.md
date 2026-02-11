# Rate Limiting для PubMed API

## Обзор

Реализован механизм контроля частоты запросов к PubMed API для соблюдения лимита **30 запросов в минуту**.

## Компоненты

### 1. RateLimiter (`modules/rate_limiter.py`)

Thread-safe класс для ограничения частоты запросов с использованием токен-бакет алгоритма.

**Основные возможности:**
- Автоматическая блокировка запросов при достижении лимита
- Thread-safe для параллельной обработки
- Статистика использования
- Context manager для удобного использования

**Пример использования:**
```python
from modules.rate_limiter import RateLimiter, RateLimiterContext

# Создание limiter: 30 запросов в минуту
limiter = RateLimiter(max_calls=30, period=60.0)

# Использование как context manager
with RateLimiterContext(limiter):
    # Выполнить запрос к API
    response = requests.get(url)

# Или напрямую
limiter.wait_if_needed()  # Автоматически ждет если нужно
response = requests.get(url)
```

### 2. Интеграция в PubMedClient

Rate limiter автоматически интегрирован в `PubMedClient`:
- Все запросы через `_run_esearch()` и `_get_article_details()` контролируются
- Настройки загружаются из `config.py`
- Статистика логируется периодически

### 3. Настройки в config.py

Добавлены новые параметры:
```python
pubmed_rate_limit_per_minute: int = 30  # Лимит запросов в минуту
pubmed_rate_limit_enabled: bool = True  # Включить/выключить rate limiting
```

**Переменные окружения:**
- `PUBMED_RATE_LIMIT_PER_MINUTE` - лимит запросов (по умолчанию 30)
- `PUBMED_RATE_LIMIT_ENABLED` - включить/выключить (true/false)

## Как это работает

1. **При инициализации PubMedClient:**
   - Создается RateLimiter с настройками из config
   - Если rate limiting отключен, limiter не создается

2. **При каждом запросе к PubMed:**
   - Запрос оборачивается в `RateLimiterContext`
   - Если достигнут лимит, запрос автоматически блокируется
   - После истечения периода окна, запросы возобновляются

3. **В параллельной обработке:**
   - Все потоки используют один и тот же RateLimiter
   - Thread-safe механизм гарантирует корректную работу
   - Запросы автоматически синхронизируются

## Статистика

В конце работы приложения выводится статистика:
```
Статистика PubMed API:
  - Всего запросов: 45
  - Заблокировано запросов: 15
  - Использование лимита: 100.0%
  - Rate limiting работал корректно (заблокировано 15 запросов)
```

## Тестирование

Создан модуль тестов `tests/test_rate_limiter.py`:
- Тест базовой функциональности
- Тест thread-safety
- Тест статистики
- Тест context manager

Запуск тестов:
```bash
python -m pytest tests/test_rate_limiter.py -v
```

## Отключение rate limiting

Если нужно отключить rate limiting (не рекомендуется):

1. Через переменную окружения:
   ```bash
   set PUBMED_RATE_LIMIT_ENABLED=false
   ```

2. Или в коде:
   ```python
   config.pubmed_rate_limit_enabled = False
   ```

## Рекомендации

1. **Не отключайте rate limiting** - это может привести к блокировке IP адреса
2. **Используйте настройки по умолчанию** (30 запросов/мин) - это официальный лимит PubMed
3. **Мониторьте статистику** - если часто блокируются запросы, рассмотрите увеличение периода или уменьшение параллельности

## Следующие шаги

После реализации rate limiting рекомендуется:
1. ✅ Реализовать кэширование результатов PubMed (Этап 2)
2. ✅ Оптимизировать параллельную обработку с учетом rate limits (Этап 3)

