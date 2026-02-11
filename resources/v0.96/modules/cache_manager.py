"""
Cache Manager модуль для кэширования результатов API запросов.

Поддерживает дисковое кэширование с TTL (Time To Live) для:
- PubMed результатов поиска
- Других API результатов (расширяемо)

Thread-safe для использования в многопоточных сценариях.
"""

import json
import hashlib
import logging
import os
import time
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import threading

log = logging.getLogger(__name__)


class CacheManager:
    """
    Менеджер кэша для результатов API запросов.
    
    Использует файловую систему для хранения кэша в формате JSON.
    Поддерживает TTL (Time To Live) для автоматической инвалидации старых записей.
    Thread-safe для параллельной обработки.
    
    Пример:
        cache = CacheManager(cache_dir=Path("data/cache/pubmed"), ttl_days=30)
        
        # Проверка кэша
        cached = cache.get("metformin", "diabetes", "500mg", "oral")
        if cached:
            return cached
        
        # Сохранение в кэш
        result = search_pubmed(...)
        cache.set("metformin", "diabetes", "500mg", "oral", result)
    """
    
    def __init__(self, cache_dir: Path, ttl_days: int = 30, enabled: bool = True):
        """
        Инициализация менеджера кэша.
        
        Args:
            cache_dir: Директория для хранения кэша
            ttl_days: Время жизни кэша в днях (по умолчанию 30)
            enabled: Включить/выключить кэширование
        """
        self.cache_dir = Path(cache_dir)
        self.ttl_days = ttl_days
        self.enabled = enabled
        self.lock = threading.Lock()
        
        # Создаем директорию если не существует
        if self.enabled:
            self.cache_dir.mkdir(parents=True, exist_ok=True)
            log.debug(f"CacheManager initialized: {cache_dir}, TTL={ttl_days} days")
        else:
            log.debug("CacheManager disabled")
    
    def _generate_cache_key(self, *args, **kwargs) -> str:
        """
        Генерирует ключ кэша на основе параметров запроса.
        
        Args:
            *args: Позиционные аргументы (INN, indication, etc.)
            **kwargs: Именованные аргументы (dosage, route, etc.)
        
        Returns:
            SHA256 hash строки в hex формате
        """
        # Создаем словарь из всех параметров
        cache_data = {
            'args': args,
            'kwargs': kwargs
        }
        
        # Сериализуем в JSON для стабильного хеширования
        cache_str = json.dumps(cache_data, sort_keys=True, ensure_ascii=False)
        
        # Генерируем SHA256 hash
        cache_key = hashlib.sha256(cache_str.encode('utf-8')).hexdigest()
        return cache_key
    
    def _get_cache_file_path(self, cache_key: str) -> Path:
        """Возвращает путь к файлу кэша для данного ключа."""
        return self.cache_dir / f"{cache_key}.json"
    
    def _is_cache_valid(self, cache_file: Path) -> bool:
        """
        Проверяет, действителен ли кэш (не истек ли TTL).
        
        Args:
            cache_file: Путь к файлу кэша
        
        Returns:
            True если кэш действителен, False если истек или файл не существует
        """
        if not cache_file.exists():
            return False
        
        try:
            # Проверяем время модификации файла
            file_mtime = cache_file.stat().st_mtime
            file_age = time.time() - file_mtime
            ttl_seconds = self.ttl_days * 24 * 60 * 60
            
            if file_age > ttl_seconds:
                log.debug(f"Cache expired: {cache_file.name} (age: {file_age/86400:.1f} days)")
                return False
            
            return True
        except Exception as e:
            log.warning(f"Error checking cache validity for {cache_file}: {e}")
            return False
    
    def get(self, *args, **kwargs) -> Optional[Dict[str, Any]]:
        """
        Получает значение из кэша.
        
        Args:
            *args: Позиционные аргументы для генерации ключа
            **kwargs: Именованные аргументы для генерации ключа
        
        Returns:
            Кэшированное значение или None если не найдено/истекло
        """
        if not self.enabled:
            return None
        
        cache_key = self._generate_cache_key(*args, **kwargs)
        cache_file = self._get_cache_file_path(cache_key)
        
        with self.lock:
            if not self._is_cache_valid(cache_file):
                return None
            
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cached_data = json.load(f)
                
                # Проверяем метаданные
                if 'data' not in cached_data or 'timestamp' not in cached_data:
                    log.warning(f"Invalid cache format in {cache_file.name}")
                    return None
                
                log.debug(f"Cache hit: {cache_file.name}")
                return cached_data['data']
            
            except json.JSONDecodeError as e:
                log.warning(f"Error reading cache file {cache_file.name}: {e}")
                # Удаляем поврежденный файл
                try:
                    cache_file.unlink()
                except Exception:
                    pass
                return None
            except Exception as e:
                log.warning(f"Error accessing cache file {cache_file.name}: {e}")
                return None
    
    def set(self, *args, data: Dict[str, Any], **kwargs) -> bool:
        """
        Сохраняет значение в кэш.
        
        Args:
            *args: Позиционные аргументы для генерации ключа
            data: Данные для кэширования
            **kwargs: Именованные аргументы для генерации ключа
        
        Returns:
            True если успешно сохранено, False в случае ошибки
        """
        if not self.enabled:
            return False
        
        cache_key = self._generate_cache_key(*args, **kwargs)
        cache_file = self._get_cache_file_path(cache_key)
        
        with self.lock:
            try:
                # Создаем структуру с метаданными
                cache_data = {
                    'data': data,
                    'timestamp': datetime.now().isoformat(),
                    'ttl_days': self.ttl_days,
                    'cache_key': cache_key
                }
                
                # Сохраняем в файл атомарно (через временный файл)
                temp_file = cache_file.with_suffix('.tmp')
                with open(temp_file, 'w', encoding='utf-8') as f:
                    json.dump(cache_data, f, ensure_ascii=False, indent=2)
                
                # Атомарно заменяем старый файл
                temp_file.replace(cache_file)
                
                log.debug(f"Cache saved: {cache_file.name}")
                return True
            
            except Exception as e:
                log.error(f"Error saving cache to {cache_file.name}: {e}")
                # Удаляем временный файл если он остался
                try:
                    temp_file = cache_file.with_suffix('.tmp')
                    if temp_file.exists():
                        temp_file.unlink()
                except Exception:
                    pass
                return False
    
    def clear_expired(self) -> int:
        """
        Удаляет все истекшие записи кэша.
        
        Returns:
            Количество удаленных файлов
        """
        if not self.enabled or not self.cache_dir.exists():
            return 0
        
        deleted_count = 0
        
        with self.lock:
            try:
                for cache_file in self.cache_dir.glob("*.json"):
                    if not self._is_cache_valid(cache_file):
                        try:
                            cache_file.unlink()
                            deleted_count += 1
                        except Exception as e:
                            log.warning(f"Error deleting expired cache {cache_file.name}: {e}")
                
                if deleted_count > 0:
                    log.info(f"Cleared {deleted_count} expired cache entries")
            
            except Exception as e:
                log.error(f"Error clearing expired cache: {e}")
        
        return deleted_count
    
    def clear_all(self) -> int:
        """
        Удаляет все записи кэша.
        
        Returns:
            Количество удаленных файлов
        """
        if not self.enabled or not self.cache_dir.exists():
            return 0
        
        deleted_count = 0
        
        with self.lock:
            try:
                for cache_file in self.cache_dir.glob("*.json"):
                    try:
                        cache_file.unlink()
                        deleted_count += 1
                    except Exception as e:
                        log.warning(f"Error deleting cache {cache_file.name}: {e}")
                
                log.info(f"Cleared all cache: {deleted_count} entries")
            
            except Exception as e:
                log.error(f"Error clearing all cache: {e}")
        
        return deleted_count
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Возвращает статистику кэша.
        
        Returns:
            Словарь со статистикой:
            - total_files: общее количество файлов
            - valid_files: количество действительных файлов
            - expired_files: количество истекших файлов
            - total_size_mb: общий размер кэша в MB
        """
        if not self.enabled or not self.cache_dir.exists():
            return {
                'total_files': 0,
                'valid_files': 0,
                'expired_files': 0,
                'total_size_mb': 0.0
            }
        
        stats = {
            'total_files': 0,
            'valid_files': 0,
            'expired_files': 0,
            'total_size_mb': 0.0
        }
        
        with self.lock:
            try:
                for cache_file in self.cache_dir.glob("*.json"):
                    stats['total_files'] += 1
                    
                    # Проверяем валидность
                    if self._is_cache_valid(cache_file):
                        stats['valid_files'] += 1
                    else:
                        stats['expired_files'] += 1
                    
                    # Добавляем размер файла
                    try:
                        file_size = cache_file.stat().st_size
                        stats['total_size_mb'] += file_size / (1024 * 1024)
                    except Exception:
                        pass
                
                stats['total_size_mb'] = round(stats['total_size_mb'], 2)
            
            except Exception as e:
                log.error(f"Error getting cache stats: {e}")
        
        return stats


class PubMedCacheManager(CacheManager):
    """
    Специализированный менеджер кэша для PubMed результатов.
    
    Упрощает использование кэша для PubMed запросов.
    """
    
    def get_pubmed_result(self, inn: str, indication: str, dosage: str = None, route: str = None) -> Optional[Dict[str, Any]]:
        """
        Получает кэшированный результат поиска PubMed.
        
        Args:
            inn: International Nonproprietary Name
            indication: Клиническая индикация
            dosage: Дозировка (опционально)
            route: Путь введения (опционально)
        
        Returns:
            Кэшированный результат или None
        """
        return self.get(inn, indication, dosage=dosage, route=route)
    
    def set_pubmed_result(self, inn: str, indication: str, result: Dict[str, Any], 
                          dosage: str = None, route: str = None) -> bool:
        """
        Сохраняет результат поиска PubMed в кэш.
        
        Args:
            inn: International Nonproprietary Name
            indication: Клиническая индикация
            result: Результат поиска PubMed
            dosage: Дозировка (опционально)
            route: Путь введения (опционально)
        
        Returns:
            True если успешно сохранено
        """
        return self.set(inn, indication, dosage=dosage, route=route, data=result)

