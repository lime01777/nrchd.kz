"""
Тесты для модуля rate_limiter
"""
import time
import threading
import pytest
from modules.rate_limiter import RateLimiter, RateLimiterContext


def test_rate_limiter_basic():
    """Тест базовой функциональности rate limiter"""
    limiter = RateLimiter(max_calls=3, period=1.0, name="TestLimiter")
    
    # Первые 3 вызова должны пройти без задержки
    start = time.time()
    limiter.wait_if_needed()
    limiter.wait_if_needed()
    limiter.wait_if_needed()
    elapsed = time.time() - start
    
    # Должно быть быстро (< 0.1 секунды)
    assert elapsed < 0.1, f"Первые 3 вызова заняли {elapsed}s, ожидалось < 0.1s"
    
    # 4-й вызов должен быть заблокирован
    start = time.time()
    limiter.wait_if_needed()
    elapsed = time.time() - start
    
    # Должна быть задержка около 1 секунды
    assert elapsed >= 0.9, f"4-й вызов занял {elapsed}s, ожидалось >= 0.9s"


def test_rate_limiter_context_manager():
    """Тест использования rate limiter как context manager"""
    limiter = RateLimiter(max_calls=2, period=1.0)
    
    # Первые 2 вызова
    with RateLimiterContext(limiter):
        pass
    with RateLimiterContext(limiter):
        pass
    
    # 3-й вызов должен быть заблокирован
    start = time.time()
    with RateLimiterContext(limiter):
        pass
    elapsed = time.time() - start
    
    assert elapsed >= 0.9, f"3-й вызов занял {elapsed}s, ожидалось >= 0.9s"


def test_rate_limiter_thread_safe():
    """Тест thread-safety rate limiter"""
    limiter = RateLimiter(max_calls=10, period=2.0)
    results = []
    
    def make_request(thread_id):
        start = time.time()
        limiter.wait_if_needed()
        elapsed = time.time() - start
        results.append((thread_id, elapsed))
    
    # Запускаем 15 потоков одновременно
    threads = []
    for i in range(15):
        t = threading.Thread(target=make_request, args=(i,))
        threads.append(t)
    
    start = time.time()
    for t in threads:
        t.start()
    
    for t in threads:
        t.join()
    total_time = time.time() - start
    
    # Проверяем, что все запросы были обработаны
    assert len(results) == 15
    
    # Проверяем, что некоторые запросы были заблокированы
    blocked_count = sum(1 for _, elapsed in results if elapsed > 0.1)
    assert blocked_count > 0, "Некоторые запросы должны были быть заблокированы"
    
    # Общее время должно быть больше чем период (из-за блокировок)
    assert total_time >= 1.0, f"Общее время {total_time}s слишком мало"


def test_rate_limiter_stats():
    """Тест статистики rate limiter"""
    limiter = RateLimiter(max_calls=5, period=1.0)
    
    # Делаем несколько вызовов
    for _ in range(3):
        limiter.wait_if_needed()
    
    stats = limiter.get_stats()
    
    assert stats['total_calls'] == 3
    assert stats['current_window_calls'] == 3
    assert stats['max_calls'] == 5
    assert stats['utilization_percent'] == 60.0  # 3/5 * 100


def test_rate_limiter_reset():
    """Тест сброса статистики"""
    limiter = RateLimiter(max_calls=5, period=1.0)
    
    limiter.wait_if_needed()
    limiter.wait_if_needed()
    
    stats_before = limiter.get_stats()
    assert stats_before['total_calls'] == 2
    
    limiter.reset_stats()
    
    stats_after = limiter.get_stats()
    assert stats_after['total_calls'] == 0
    assert stats_after['blocked_calls'] == 0
    # Но текущее окно должно остаться
    assert stats_after['current_window_calls'] == 2


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

