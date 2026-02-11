"""
Тесты для кастомных исключений
"""
import pytest
from modules.exceptions import (
    ProtocolAnalyzerError,
    ParsingError,
    NERError,
    VerificationError,
    APIError,
    ConfigurationError,
    ValidationError
)


class TestExceptions:
    """Тесты для кастомных исключений"""
    
    def test_parsing_error(self):
        """Тест ParsingError"""
        error = ParsingError("File corrupted", file_path="test.docx")
        assert "парсинга" in str(error).lower()
        assert error.file_path == "test.docx"
        assert isinstance(error, ProtocolAnalyzerError)
    
    def test_ner_error(self):
        """Тест NERError"""
        original = ValueError("JSON decode error")
        error = NERError("Failed to parse", original_error=original)
        assert "ner" in str(error).lower()
        assert error.original_error == original
        assert isinstance(error, ProtocolAnalyzerError)
    
    def test_verification_error(self):
        """Тест VerificationError"""
        error = VerificationError("API timeout", drug_name="метформин", source="PubMed")
        assert "верификации" in str(error).lower()
        assert error.drug_name == "метформин"
        assert error.source == "PubMed"
        assert isinstance(error, ProtocolAnalyzerError)
    
    def test_api_error(self):
        """Тест APIError"""
        error = APIError("Connection failed", api_name="PubMed", status_code=500, url="http://example.com")
        assert "api" in str(error).lower()
        assert error.api_name == "PubMed"
        assert error.status_code == 500
        assert error.url == "http://example.com"
        assert isinstance(error, ProtocolAnalyzerError)
    
    def test_configuration_error(self):
        """Тест ConfigurationError"""
        error = ConfigurationError("Missing keys", missing_keys=["GEMINI_API_KEY", "PUBMED_API_KEY"])
        assert "конфигурации" in str(error).lower()
        assert len(error.missing_keys) == 2
        assert isinstance(error, ProtocolAnalyzerError)
    
    def test_validation_error(self):
        """Тест ValidationError"""
        error = ValidationError("Invalid value", field="drug_name", value="")
        assert "валидации" in str(error).lower()
        assert error.field == "drug_name"
        assert error.value == ""
        assert isinstance(error, ProtocolAnalyzerError)

