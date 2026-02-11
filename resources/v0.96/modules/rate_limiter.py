"""
Rate Limiter модуль для контроля частоты запросов к API.

Использует токен-бакет алгоритм для ограничения количества запросов
в единицу времени. Thread-safe для использования в многопоточных сценариях.
"""

import time
import threading
from collections import deque
from typing import Optional
import logging

log = logging.getLogger(__name__)


class RateLimiter:
    """
    Thread-safe rate limiter с токен-бакетом алгоритмом.
    
    Поддерживает ограничение количества запросов в заданный период времени.
    Автоматически блокирует выполнение запросов при достижении лимита.
    
    Пример:
        limiter = RateLimiter(max_calls=30, period=60.0)  # 30 запросов в минуту
        limiter.wait_if_needed()  # Ждет если нужно
        # Выполнить запрос
    """
    
    def __init__(self, max_calls: int = 30, period: float = 60.0, name: str = "RateLimiter"):
        """
        Инициализация rate limiter.
        
        Args:
            max_calls: Максимальное количество запросов за период
            period: Период времени в секундах (по умолчанию 60 = 1 минута)
            name: Имя limiter для логирования
        """
        if max_calls <= 0:
            raise ValueError("max_calls must be positive")
        if period <= 0:
            raise ValueError("period must be positive")
        
        self.max_calls = max_calls
        self.period = period
        self.name = name
        self.calls = deque()  # Хранит временные метки вызовов
        self.lock = threading.Lock()
        self.total_calls = 0  # Общий счетчик вызовов
        self.blocked_calls = 0  # Количество заблокированных вызовов
        
        log.debug(f"{self.name} initialized: {max_calls} calls per {period}s")
    
    def wait_if_needed(self) -> float:
        """
        Ждет если нужно, чтобы не превысить rate limit.
        
        Returns:
            Время ожидания в секундах (0 если не было ожидания)
        """
        wait_time = 0.0
        with self.lock:
            now = time.time()
            
            # Удаляем старые вызовы, которые вышли за пределы периода
            while self.calls and self.calls[0] < now - self.period:
                self.calls.popleft()
            
            # Проверяем лимит ПЕРЕД добавлением нового вызова
            # Проверяем лимит ПЕРЕД добавлением нового вызова
            # Если уже достигли лимита (или превысили из-за параллельности), вычисляем время ожидания
            current_count = len(self.calls)
            if current_count >= self.max_calls:
                oldest_call_time = self.calls[0]
                sleep_time = self.period - (now - oldest_call_time)
                
                if sleep_time > 0:
                    self.blocked_calls += 1
                    # Показываем реальное количество (может быть больше лимита из-за параллельности)
                    log.warning(
                        f"{self.name}: Rate limit reached ({current_count}/{self.max_calls}). "
                        f"Waiting {sleep_time:.2f}s to avoid 429 error..."
                    )
                    # Освобождаем lock перед sleep, чтобы другие потоки могли проверить
                    self.lock.release()
                    try:
                        time.sleep(sleep_time)
                        wait_time = sleep_time
                    finally:
                        self.lock.acquire()
                    
                    # Обновляем время после ожидания и очищаем старые вызовы
                    now = time.time()
                    while self.calls and self.calls[0] < now - self.period:
                        self.calls.popleft()
            
            # Добавляем текущий вызов ПОСЛЕ проверки и ожидания (если было)
            self.calls.append(now)
            self.total_calls += 1
        
        return wait_time
    
    def get_stats(self) -> dict:
        """
        Возвращает статистику использования rate limiter.
        
        Returns:
            Словарь со статистикой:
            - total_calls: общее количество вызовов
            - blocked_calls: количество заблокированных вызовов
            - current_window_calls: количество вызовов в текущем окне
            - max_calls: максимальное количество вызовов
            - period: период в секундах
        """
        with self.lock:
            now = time.time()
            # Очищаем старые вызовы для точной статистики
            while self.calls and self.calls[0] < now - self.period:
                self.calls.popleft()
            
            return {
                'total_calls': self.total_calls,
                'blocked_calls': self.blocked_calls,
                'current_window_calls': len(self.calls),
                'max_calls': self.max_calls,
                'period': self.period,
                'utilization_percent': (len(self.calls) / self.max_calls * 100) if self.max_calls > 0 else 0
            }
    
    def reset_stats(self):
        """Сбрасывает статистику (но не историю вызовов)."""
        with self.lock:
            self.total_calls = 0
            self.blocked_calls = 0
    
    def clear(self):
        """Очищает всю историю вызовов и статистику."""
        with self.lock:
            self.calls.clear()
            self.total_calls = 0
            self.blocked_calls = 0
            log.debug(f"{self.name}: History cleared")


class RateLimiterContext:
    """
    Context manager для удобного использования rate limiter.
    
    Пример:
        with RateLimiterContext(limiter):
            # Выполнить запрос
    """
    
    def __init__(self, limiter: RateLimiter):
        self.limiter = limiter
        self.wait_time = 0.0
    
    def __enter__(self):
        self.wait_time = self.limiter.wait_if_needed()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

