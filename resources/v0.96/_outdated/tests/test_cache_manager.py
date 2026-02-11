"""
Тесты для модуля cache_manager
"""
import pytest
import json
import time
from pathlib import Path
import tempfile
import shutil
from modules.cache_manager import CacheManager, PubMedCacheManager


@pytest.fixture
def temp_cache_dir():
    """Создает временную директорию для кэша"""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir)


def test_cache_manager_basic(temp_cache_dir):
    """Тест базовой функциональности cache manager"""
    cache = CacheManager(cache_dir=temp_cache_dir, ttl_days=1, enabled=True)
    
    # Сохранение данных
    test_data = {"result": "test", "count": 42}
    assert cache.set("arg1", "arg2", data=test_data, key1="value1") == True
    
    # Получение данных
    cached = cache.get("arg1", "arg2", key1="value1")
    assert cached is not None
    assert cached == test_data
    
    # Проверка что разные параметры дают разные ключи
    cached2 = cache.get("arg1", "arg3", key1="value1")
    assert cached2 is None


def test_cache_manager_expiration(temp_cache_dir):
    """Тест истечения срока действия кэша"""
    cache = CacheManager(cache_dir=temp_cache_dir, ttl_days=0.0001, enabled=True)  # Очень короткий TTL
    
    # Сохранение данных
    test_data = {"result": "test"}
    cache.set("test", data=test_data)
    
    # Данные должны быть доступны сразу
    cached = cache.get("test")
    assert cached is not None
    
    # Ждем истечения TTL (0.0001 дня = ~8.6 секунд)
    time.sleep(10)
    
    # Данные должны истечь
    cached_expired = cache.get("test")
    assert cached_expired is None


def test_cache_manager_disabled(temp_cache_dir):
    """Тест отключенного кэша"""
    cache = CacheManager(cache_dir=temp_cache_dir, enabled=False)
    
    # Сохранение не должно работать
    assert cache.set("test", data={"result": "test"}) == False
    
    # Получение должно возвращать None
    assert cache.get("test") is None


def test_cache_manager_clear_expired(temp_cache_dir):
    """Тест очистки истекших записей"""
    cache = CacheManager(cache_dir=temp_cache_dir, ttl_days=0.0001, enabled=True)
    
    # Создаем несколько записей
    cache.set("test1", data={"result": "test1"})
    cache.set("test2", data={"result": "test2"})
    
    # Ждем истечения
    time.sleep(10)
    
    # Очищаем истекшие
    deleted = cache.clear_expired()
    assert deleted >= 2  # Обе записи должны быть удалены
    
    # Проверяем что они удалены
    assert cache.get("test1") is None
    assert cache.get("test2") is None


def test_cache_manager_clear_all(temp_cache_dir):
    """Тест полной очистки кэша"""
    cache = CacheManager(cache_dir=temp_cache_dir, enabled=True)
    
    # Создаем несколько записей
    cache.set("test1", data={"result": "test1"})
    cache.set("test2", data={"result": "test2"})
    
    # Очищаем все
    deleted = cache.clear_all()
    assert deleted == 2
    
    # Проверяем что они удалены
    assert cache.get("test1") is None
    assert cache.get("test2") is None


def test_cache_manager_stats(temp_cache_dir):
    """Тест статистики кэша"""
    cache = CacheManager(cache_dir=temp_cache_dir, enabled=True)
    
    # Создаем несколько записей
    cache.set("test1", data={"result": "test1"})
    cache.set("test2", data={"result": "test2"})
    
    stats = cache.get_stats()
    assert stats['total_files'] == 2
    assert stats['valid_files'] == 2
    assert stats['expired_files'] == 0


def test_pubmed_cache_manager(temp_cache_dir):
    """Тест специализированного PubMed cache manager"""
    cache = PubMedCacheManager(cache_dir=temp_cache_dir, ttl_days=30, enabled=True)
    
    # Сохранение результата PubMed
    pubmed_result = {
        "rct_count": 5,
        "meta_analysis_count": 2,
        "articles": []
    }
    
    assert cache.set_pubmed_result("metformin", "diabetes", pubmed_result, "500mg", "oral") == True
    
    # Получение результата
    cached = cache.get_pubmed_result("metformin", "diabetes", "500mg", "oral")
    assert cached is not None
    assert cached == pubmed_result
    
    # Разные параметры должны давать разные результаты
    cached2 = cache.get_pubmed_result("metformin", "diabetes", "1000mg", "oral")
    assert cached2 is None


def test_cache_manager_thread_safe(temp_cache_dir):
    """Тест thread-safety cache manager"""
    import threading
    
    cache = CacheManager(cache_dir=temp_cache_dir, enabled=True)
    results = []
    
    def save_and_get(thread_id):
        # Сохраняем
        cache.set(f"test_{thread_id}", data={"id": thread_id})
        # Получаем
        cached = cache.get(f"test_{thread_id}")
        results.append((thread_id, cached is not None))
    
    # Запускаем несколько потоков
    threads = []
    for i in range(10):
        t = threading.Thread(target=save_and_get, args=(i,))
        threads.append(t)
        t.start()
    
    for t in threads:
        t.join()
    
    # Проверяем что все потоки успешно сохранили и получили данные
    assert len(results) == 10
    assert all(success for _, success in results)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

