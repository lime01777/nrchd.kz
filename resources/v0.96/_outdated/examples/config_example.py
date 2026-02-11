"""
Пример централизованной конфигурации
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
    gemini_model: str = "gemini-2.5-flash"
    
    # Processing settings
    default_max_workers: int = 8
    pubmed_query_limit: int = 10
    pubmed_articles_limit: int = 10
    pubmed_date_range_years: int = 15
    
    # Cache settings
    enable_cache: bool = True
    cache_ttl_days: int = 30
    
    # Retry settings
    max_retries: int = 3
    retry_delay_seconds: int = 2
    
    # Timeouts
    api_timeout_seconds: int = 30
    analysis_timeout_minutes: int = 30
    
    @classmethod
    def from_env(cls) -> 'Config':
        """Загрузка конфигурации из переменных окружения"""
        load_dotenv()
        
        config = cls(
            gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
            pubmed_api_key=os.getenv("PUBMED_API_KEY", ""),
            pubmed_tool=os.getenv("PUBMED_TOOL", "ProtocolAnalyzer"),
            pubmed_email=os.getenv("PUBMED_EMAIL", ""),
        )
        
        # Override with env vars if present
        if max_workers := os.getenv("MAX_WORKERS"):
            config.default_max_workers = int(max_workers)
        
        if model := os.getenv("GEMINI_MODEL"):
            config.gemini_model = model
        
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
        
        # Проверка директорий
        for dir_name, dir_path in [
            ("data_dir", self.data_dir),
            ("inputs_dir", self.inputs_dir),
            ("outputs_dir", self.outputs_dir),
        ]:
            if not dir_path.exists():
                dir_path.mkdir(parents=True, exist_ok=True)
        
        if errors:
            raise ValueError(f"Configuration errors: {', '.join(errors)}")
    
    def get_cache_path(self, cache_type: str) -> Path:
        """Получить путь к кэшу определенного типа"""
        cache_path = self.cache_dir / cache_type
        cache_path.mkdir(parents=True, exist_ok=True)
        return cache_path

