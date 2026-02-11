"""
Тесты для конфигурации
"""
import pytest
import os
from pathlib import Path
from unittest.mock import patch, MagicMock
from config import Config
from modules.exceptions import ConfigurationError


class TestConfig:
    """Тесты для конфигурации"""
    
    def test_config_from_env_missing_keys(self, monkeypatch):
        """Тест загрузки конфигурации с отсутствующими ключами"""
        # Мокируем load_dotenv чтобы он не загружал из .env файла
        # и устанавливаем пустые значения для переменных окружения
        monkeypatch.setenv("GEMINI_API_KEY", "")
        monkeypatch.setenv("PUBMED_API_KEY", "")
        monkeypatch.setenv("PUBMED_EMAIL", "")
        monkeypatch.setenv("PUBMED_TOOL", "")
        
        # Мокируем load_dotenv чтобы он не перезаписывал наши пустые значения
        with patch('config.load_dotenv'):
            with pytest.raises(ConfigurationError) as exc_info:
                Config.from_env()
            
            # Проверяем, что ошибка содержит информацию о недостающих ключах
            assert "GEMINI_API_KEY" in str(exc_info.value) or "конфигурации" in str(exc_info.value)
    
    def test_config_from_env_valid(self, monkeypatch):
        """Тест загрузки валидной конфигурации"""
        monkeypatch.setenv("GEMINI_API_KEY", "test_key")
        monkeypatch.setenv("PUBMED_API_KEY", "test_pubmed_key")
        monkeypatch.setenv("PUBMED_EMAIL", "test@example.com")
        monkeypatch.setenv("PUBMED_TOOL", "TestTool")
        
        config = Config.from_env()
        assert config.gemini_api_key == "test_key"
        assert config.pubmed_api_key == "test_pubmed_key"
        assert config.pubmed_email == "test@example.com"
    
    def test_config_validate_creates_dirs(self, tmp_path, monkeypatch):
        """Тест создания директорий при валидации"""
        monkeypatch.setenv("GEMINI_API_KEY", "test_key")
        monkeypatch.setenv("PUBMED_API_KEY", "test_pubmed_key")
        monkeypatch.setenv("PUBMED_EMAIL", "test@example.com")
        
        config = Config.from_env()
        # Проверяем, что директории созданы
        assert config.data_dir.exists()
        assert config.inputs_dir.exists()
        assert config.outputs_dir.exists()
    
    def test_config_get_cache_path(self, monkeypatch):
        """Тест получения пути к кэшу"""
        monkeypatch.setenv("GEMINI_API_KEY", "test_key")
        monkeypatch.setenv("PUBMED_API_KEY", "test_pubmed_key")
        monkeypatch.setenv("PUBMED_EMAIL", "test@example.com")
        
        config = Config.from_env()
        cache_path = config.get_cache_path("gemini")
        assert cache_path.exists()
        assert "gemini" in str(cache_path)

