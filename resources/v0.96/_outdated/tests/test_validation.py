"""
Тесты для модуля валидации
"""
import pytest
from pathlib import Path
from modules.validation import (
    validate_protocol_file,
    validate_indication,
    validate_drug_entity,
    validate_output_path
)
from modules.exceptions import ValidationError


class TestValidation:
    """Тесты для функций валидации"""
    
    def test_validate_protocol_file_exists(self, tmp_path):
        """Тест валидации существующего файла"""
        test_file = tmp_path / "test.docx"
        test_file.write_text("test content")
        
        # Не должно быть исключения
        validate_protocol_file(test_file)
    
    def test_validate_protocol_file_not_exists(self):
        """Тест валидации несуществующего файла"""
        with pytest.raises(FileNotFoundError):
            validate_protocol_file(Path("nonexistent.docx"))
    
    def test_validate_protocol_file_empty(self, tmp_path):
        """Тест валидации пустого файла"""
        test_file = tmp_path / "empty.docx"
        test_file.touch()  # Создать пустой файл
        
        with pytest.raises(ValidationError) as exc_info:
            validate_protocol_file(test_file)
        
        assert "пуст" in str(exc_info.value).lower()
    
    def test_validate_protocol_file_too_large(self, tmp_path):
        """Тест валидации слишком большого файла"""
        test_file = tmp_path / "large.docx"
        # Создать файл больше 100 МБ
        test_file.write_bytes(b"x" * (101 * 1024 * 1024))
        
        with pytest.raises(ValidationError) as exc_info:
            validate_protocol_file(test_file, max_size_mb=100)
        
        assert "слишком большой" in str(exc_info.value).lower()
    
    def test_validate_protocol_file_invalid_extension(self, tmp_path):
        """Тест валидации неподдерживаемого формата"""
        test_file = tmp_path / "test.xyz"
        test_file.write_text("content")
        
        with pytest.raises(ValidationError) as exc_info:
            validate_protocol_file(test_file)
        
        assert "формат" in str(exc_info.value).lower()
    
    def test_validate_indication_valid(self):
        """Тест валидации валидной индикации"""
        validate_indication("Diabetes Mellitus Type 2")
        # Не должно быть исключения
    
    def test_validate_indication_empty(self):
        """Тест валидации пустой индикации"""
        with pytest.raises(ValidationError):
            validate_indication("")
    
    def test_validate_indication_too_short(self):
        """Тест валидации слишком короткой индикации"""
        with pytest.raises(ValidationError):
            validate_indication("AB")
    
    def test_validate_drug_entity_valid(self):
        """Тест валидации валидной сущности препарата"""
        entity = {
            'drug_name': 'метформин',
            'dosage': '500 мг',
            'route': 'oral'
        }
        validate_drug_entity(entity)
        # Не должно быть исключения
    
    def test_validate_drug_entity_missing_name(self):
        """Тест валидации сущности без названия"""
        entity = {
            'dosage': '500 мг'
        }
        with pytest.raises(ValidationError):
            validate_drug_entity(entity)
    
    def test_validate_output_path_valid(self, tmp_path):
        """Тест валидации валидного выходного пути"""
        output_file = tmp_path / "output.xlsx"
        validate_output_path(output_file)
        # Не должно быть исключения
    
    def test_validate_output_path_invalid_extension(self, tmp_path):
        """Тест валидации пути с неподдерживаемым расширением"""
        output_file = tmp_path / "output.txt"
        with pytest.raises(ValidationError):
            validate_output_path(output_file)

