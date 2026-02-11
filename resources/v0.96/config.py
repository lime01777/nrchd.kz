"""
Централизованная конфигурация приложения
"""
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
import os
from dotenv import load_dotenv


@dataclass
class Config:
    """Централизованная конфигурация приложения"""
    
    # API Keys
    gemini_api_key: str
    pubmed_api_key: str
    pubmed_tool: str
    pubmed_email: str
    
    # Paths
    data_dir: Path = field(default_factory=lambda: Path("data"))
    inputs_dir: Path = field(default_factory=lambda: Path("data/inputs"))
    outputs_dir: Path = field(default_factory=lambda: Path("data/outputs"))
    pdf_sources_dir: Path = field(default_factory=lambda: Path("data/pdf_sources"))
    cache_dir: Path = field(default_factory=lambda: Path("data/cache"))
    index_dir: Path = field(default_factory=lambda: Path("data/index"))
    
    # Gemini settings
    gemini_model: str = "gemini-3-flash-preview"
    gemini_max_retries: int = 5
    gemini_retry_delay_seconds: int = 10
    gemini_backoff_factor: int = 2
    
    # Processing settings
    default_max_workers: int = 8
    pubmed_query_limit: int = 10
    pubmed_articles_limit: int = 10
    pubmed_date_range_years: int = 15
    
    # Rate limiting settings
    # PubMed рекомендует не более 3 запросов в секунду (180/мин) БЕЗ API ключа
    # С API ключом можно больше, но для надежности используем консервативный лимит
    pubmed_rate_limit_per_minute: int = 20  # Консервативный лимит: 20 запросов в минуту
    pubmed_rate_limit_enabled: bool = True  # Enable/disable rate limiting
    pubmed_min_delay_seconds: float = 0.1  # Минимальная задержка между запросами (даже если rate limiter разрешает)
    
    # Cache settings
    enable_cache: bool = True
    cache_ttl_days: int = 30
    
    # Retry settings
    max_retries: int = 3
    retry_delay_seconds: int = 2
    
    # Timeouts
    api_timeout_seconds: int = 30
    analysis_timeout_minutes: int = 30
    
    # File size limits
    max_file_size_mb: int = 100
    
    @classmethod
    def from_env(cls) -> 'Config':
        """Загрузка конфигурации из переменных окружения"""
        load_dotenv()
        
        # Получение API ключей
        gemini_key = os.getenv("GEMINI_API_KEY", "").strip('"').strip("'").strip()
        pubmed_key = os.getenv("PUBMED_API_KEY", "")
        pubmed_tool = os.getenv("PUBMED_TOOL", "ProtocolAnalyzer")
        pubmed_email = os.getenv("PUBMED_EMAIL", "")
        
        config = cls(
            gemini_api_key=gemini_key,
            pubmed_api_key=pubmed_key,
            pubmed_tool=pubmed_tool,
            pubmed_email=pubmed_email,
        )
        
        # Override with env vars if present
        if max_workers := os.getenv("MAX_WORKERS"):
            try:
                config.default_max_workers = int(max_workers)
            except ValueError:
                pass
        
        if model := os.getenv("GEMINI_MODEL"):
            config.gemini_model = model
        
        if enable_cache := os.getenv("ENABLE_CACHE"):
            config.enable_cache = enable_cache.lower() in ('true', '1', 'yes')
        
        # Rate limiting settings from env
        if pubmed_rate_limit := os.getenv("PUBMED_RATE_LIMIT_PER_MINUTE"):
            try:
                config.pubmed_rate_limit_per_minute = int(pubmed_rate_limit)
            except ValueError:
                pass
        
        if pubmed_rate_limit_enabled := os.getenv("PUBMED_RATE_LIMIT_ENABLED"):
            config.pubmed_rate_limit_enabled = pubmed_rate_limit_enabled.lower() in ('true', '1', 'yes')
        
        if pubmed_min_delay := os.getenv("PUBMED_MIN_DELAY_SECONDS"):
            try:
                config.pubmed_min_delay_seconds = float(pubmed_min_delay)
            except ValueError:
                pass
        
        config.validate()
        return config
    
    def validate(self):
        """Проверка обязательных параметров"""
        errors = []
        
        if not self.gemini_api_key:
            errors.append("GEMINI_API_KEY is required")
        
        if not self.pubmed_api_key:
            errors.append("PUBMED_API_KEY is required")
        
        if not self.pubmed_email:
            errors.append("PUBMED_EMAIL is required")
        
        # Проверка и создание директорий
        for dir_name, dir_path in [
            ("data_dir", self.data_dir),
            ("inputs_dir", self.inputs_dir),
            ("outputs_dir", self.outputs_dir),
            ("pdf_sources_dir", self.pdf_sources_dir),
            ("cache_dir", self.cache_dir),
            ("index_dir", self.index_dir),
        ]:
            if not dir_path.exists():
                dir_path.mkdir(parents=True, exist_ok=True)
        
        if errors:
            from modules.exceptions import ConfigurationError
            raise ConfigurationError(
                "Configuration validation failed",
                missing_keys=errors
            )
    
    def get_cache_path(self, cache_type: str) -> Path:
        """Получить путь к кэшу определенного типа"""
        cache_path = self.cache_dir / cache_type
        cache_path.mkdir(parents=True, exist_ok=True)
        return cache_path

