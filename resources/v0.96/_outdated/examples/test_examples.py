"""
Примеры unit тестов для проекта
"""
import pytest
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock
from examples.exceptions_example import ValidationError, ParsingError
from examples.validation_example import validate_protocol_file, validate_indication


# Пример теста для валидации
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


# Пример теста для парсера протоколов
class TestProtocolParser:
    """Тесты для парсера протоколов"""
    
    @patch('modules.protocol_parser.docx.Document')
    def test_parse_docx_success(self, mock_docx):
        """Тест успешного парсинга DOCX"""
        # Мокирование docx.Document
        mock_doc = MagicMock()
        mock_paragraph = MagicMock()
        mock_paragraph.text = "Test protocol text"
        mock_doc.paragraphs = [mock_paragraph]
        mock_docx.return_value = mock_doc
        
        from modules.protocol_parser import parse_protocol_file
        
        result = parse_protocol_file(Path("test.docx"))
        assert "Test protocol text" in result
    
    @patch('modules.protocol_parser.fitz.open')
    def test_parse_pdf_success(self, mock_fitz):
        """Тест успешного парсинга PDF"""
        # Мокирование PyMuPDF
        mock_doc = MagicMock()
        mock_page = MagicMock()
        mock_page.get_text.return_value = "Test PDF text"
        mock_doc.__iter__ = lambda x: iter([mock_page])
        mock_fitz.return_value.__enter__.return_value = mock_doc
        
        from modules.protocol_parser import parse_protocol_file
        
        result = parse_protocol_file(Path("test.pdf"))
        assert "Test PDF text" in result


# Пример теста для NER экстрактора
class TestGeminiNER:
    """Тесты для Gemini NER"""
    
    @patch('modules.nlp_extractor.genai.GenerativeModel')
    def test_extract_entities_success(self, mock_model_class):
        """Тест успешного извлечения сущностей"""
        # Мокирование Gemini модели
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = '[{"drug_name": "метформин", "dosage": "500 мг"}]'
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        
        from modules.nlp_extractor import GeminiNER
        
        ner = GeminiNER()
        entities = ner.extract_entities("Назначить метформин 500 мг")
        
        assert len(entities) > 0
        assert entities[0]['drug_name'] == 'метформин'
    
    @patch('modules.nlp_extractor.genai.GenerativeModel')
    def test_extract_entities_invalid_json(self, mock_model_class):
        """Тест обработки невалидного JSON от Gemini"""
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "Invalid JSON response"
        mock_model.generate_content.return_value = mock_response
        mock_model_class.return_value = mock_model
        
        from modules.nlp_extractor import GeminiNER
        
        ner = GeminiNER()
        entities = ner.extract_entities("Test text")
        
        # Должен вернуть пустой список при ошибке парсинга
        assert entities == []


# Пример теста для расчета GRADE
class TestEvidenceSynthesizer:
    """Тесты для синтеза доказательств"""
    
    def test_calculate_system_ud_level_a_meta_analysis(self):
        """Тест расчета уровня A при наличии мета-анализа"""
        from modules.evidence_synthesizer import calculate_system_ud
        
        record = {
            'evidence_pubmed': {
                'meta_analysis_count': 1,
                'total_found': 10
            }
        }
        
        grade, justification = calculate_system_ud(record)
        assert grade == 'A'
        assert 'мета-анализ' in justification.lower()
    
    def test_calculate_system_ud_level_b_rct(self):
        """Тест расчета уровня B при наличии РКИ"""
        from modules.evidence_synthesizer import calculate_system_ud
        
        record = {
            'evidence_pubmed': {
                'rct_count': 2,
                'total_found': 5
            }
        }
        
        grade, justification = calculate_system_ud(record)
        assert grade == 'B'
    
    def test_calculate_system_ud_level_c_fda_approved(self):
        """Тест расчета уровня C при одобрении FDA"""
        from modules.evidence_synthesizer import calculate_system_ud
        
        record = {
            'approval_fda': {
                'approved': True
            },
            'evidence_pubmed': {
                'total_found': 0
            }
        }
        
        grade, justification = calculate_system_ud(record)
        assert grade == 'C'
    
    def test_calculate_system_ud_level_d_no_evidence(self):
        """Тест расчета уровня D при отсутствии доказательств"""
        from modules.evidence_synthesizer import calculate_system_ud
        
        record = {
            'evidence_pubmed': {
                'total_found': 0
            },
            'approval_fda': {
                'approved': False
            },
            'formulary_bnf': False
        }
        
        grade, justification = calculate_system_ud(record)
        assert grade == 'D'


# Пример теста для API клиентов
class TestAPIClients:
    """Тесты для API клиентов"""
    
    @patch('modules.api_clients.requests.get')
    def test_pubmed_search_success(self, mock_get):
        """Тест успешного поиска в PubMed"""
        # Мокирование ответа от PubMed API
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'esearchresult': {
                'count': '5',
                'idlist': ['123', '456']
            }
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response
        
        from modules.api_clients import PubMedClient
        
        client = PubMedClient()
        # Тест метода поиска
        # result = client.search("test query")
        # assert result['count'] == '5'
    
    @patch('modules.api_clients.requests.get')
    def test_pubmed_search_error(self, mock_get):
        """Тест обработки ошибки при поиске в PubMed"""
        import requests
        mock_get.side_effect = requests.RequestException("Connection error")
        
        from modules.api_clients import PubMedClient
        
        client = PubMedClient()
        # Должна быть обработка ошибки
        # result = client.search("test query")
        # assert 'error' in result


# Пример интеграционного теста
class TestIntegration:
    """Интеграционные тесты"""
    
    @pytest.mark.integration
    def test_full_pipeline_mock(self, tmp_path):
        """Тест полного pipeline с моками"""
        # Создать тестовый файл
        test_file = tmp_path / "test_protocol.docx"
        test_file.write_text("Test content")
        
        # Мокировать все внешние зависимости
        with patch('modules.nlp_extractor.GeminiNER') as mock_ner, \
             patch('modules.verification_engine.VerificationEngine') as mock_verification, \
             patch('modules.evidence_synthesizer.analyze_drug_with_gemini') as mock_gemini:
            
            # Настройка моков
            mock_ner_instance = MagicMock()
            mock_ner_instance.extract_entities.return_value = [
                {'drug_name': 'test_drug', 'dosage': '100 мг'}
            ]
            mock_ner.return_value = mock_ner_instance
            
            mock_verification_instance = MagicMock()
            mock_verification_instance.run_verification.return_value = [
                {
                    'original_name': 'test_drug',
                    'inn': 'test_drug',
                    'formulary_bnf': True,
                    'evidence_pubmed': {'total_found': 5}
                }
            ]
            mock_verification.return_value = mock_verification_instance
            
            mock_gemini.return_value = {
                'evidence_level_grade': 'B',
                'evidence_level_justification': 'Test justification',
                'summary_recommendation': 'Test recommendation'
            }
            
            # Запуск pipeline
            # result = run_analysis(test_file, "Test indication")
            # assert result is not None


# Фикстуры для тестов
@pytest.fixture
def sample_drug_entity():
    """Фикстура для тестовой сущности препарата"""
    return {
        'drug_name': 'метформин',
        'inn_english': 'metformin',
        'inn_russian': 'метформин',
        'dosage': '500 мг 2 раза в сутки',
        'route': 'oral',
        'frequency': '2 раза в сутки',
        'duration': 'постоянно',
        'author_ud': 'A'
    }


@pytest.fixture
def sample_verification_record():
    """Фикстура для тестовой записи верификации"""
    return {
        'original_name': 'метформин',
        'inn': 'metformin',
        'inn_russian': 'метформин',
        'dosage': '500 мг 2 раза в сутки',
        'route': 'oral',
        'formulary_bnf': True,
        'formulary_who_eml': True,
        'approval_fda': {'approved': True},
        'approval_ema': 'Approved',
        'evidence_pubmed': {
            'total_found': 50,
            'meta_analysis_count': 2,
            'systematic_review_count': 5,
            'rct_count': 10,
            'articles': []
        },
        'clinical_trials': [],
        'kz_register': {'found': True},
        'system_ud': 'A'
    }


# Пример использования фикстур
def test_with_fixtures(sample_drug_entity, sample_verification_record):
    """Пример теста с использованием фикстур"""
    assert sample_drug_entity['drug_name'] == 'метформин'
    assert sample_verification_record['system_ud'] == 'A'


# Запуск тестов
if __name__ == "__main__":
    pytest.main([__file__, "-v"])

