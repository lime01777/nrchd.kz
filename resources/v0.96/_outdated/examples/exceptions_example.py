"""
Кастомные исключения для проекта
"""
from typing import Optional


class ProtocolAnalyzerError(Exception):
    """Базовое исключение для всех ошибок анализатора протоколов"""
    pass


class ParsingError(ProtocolAnalyzerError):
    """Ошибка парсинга протокола"""
    def __init__(self, message: str, file_path: Optional[str] = None):
        self.file_path = file_path
        super().__init__(f"Ошибка парсинга: {message}" + (f" (файл: {file_path})" if file_path else ""))


class NERError(ProtocolAnalyzerError):
    """Ошибка извлечения сущностей (NER)"""
    def __init__(self, message: str, original_error: Optional[Exception] = None):
        self.original_error = original_error
        super().__init__(f"Ошибка NER: {message}")


class VerificationError(ProtocolAnalyzerError):
    """Ошибка верификации препарата"""
    def __init__(self, message: str, drug_name: Optional[str] = None, source: Optional[str] = None):
        self.drug_name = drug_name
        self.source = source
        super().__init__(f"Ошибка верификации: {message}" + (f" (препарат: {drug_name}, источник: {source})" if drug_name and source else ""))


class APIError(ProtocolAnalyzerError):
    """Ошибка внешнего API"""
    def __init__(
        self, 
        message: str, 
        api_name: str, 
        status_code: Optional[int] = None,
        url: Optional[str] = None
    ):
        self.api_name = api_name
        self.status_code = status_code
        self.url = url
        error_msg = f"Ошибка API {api_name}: {message}"
        if status_code:
            error_msg += f" (HTTP {status_code})"
        if url:
            error_msg += f" (URL: {url})"
        super().__init__(error_msg)


class ConfigurationError(ProtocolAnalyzerError):
    """Ошибка конфигурации"""
    def __init__(self, message: str, missing_keys: Optional[list] = None):
        self.missing_keys = missing_keys or []
        error_msg = f"Ошибка конфигурации: {message}"
        if self.missing_keys:
            error_msg += f" (отсутствуют: {', '.join(self.missing_keys)})"
        super().__init__(error_msg)


class ValidationError(ProtocolAnalyzerError):
    """Ошибка валидации данных"""
    def __init__(self, message: str, field: Optional[str] = None, value=None):
        self.field = field
        self.value = value
        error_msg = f"Ошибка валидации: {message}"
        if field:
            error_msg += f" (поле: {field})"
        super().__init__(error_msg)


class CacheError(ProtocolAnalyzerError):
    """Ошибка работы с кэшем"""
    pass


class ReportGenerationError(ProtocolAnalyzerError):
    """Ошибка генерации отчета"""
    def __init__(self, message: str, report_type: Optional[str] = None):
        self.report_type = report_type
        super().__init__(f"Ошибка генерации отчета: {message}" + (f" (тип: {report_type})" if report_type else ""))

