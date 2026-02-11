"""
NLP extractor module:
- GeminiNER: wraps Gemini model calls to extract drug entities
  from raw protocol text (drug name, dosage, route, frequency, duration, etc.)
"""
import google.generativeai as genai
import json
import logging
import re
from typing import Optional
from modules.exceptions import NERError, ConfigurationError

log = logging.getLogger(__name__)

class GeminiNER:
    """
    A class to perform Named Entity Recognition (NER) on Russian medical texts
    using the Google Gemini API to extract drug-related entities.
    (Fulfills requirement from TZ 3.1.2)
    """

    def __init__(self, config=None):
        """
        Initializes the GeminiNER client. It loads the API key from the
        environment variables or config, configures the `genai` library, and
        initializes the specified Gemini model.
        
        Args:
            config: Optional Config object. If not provided, loads from env.
        """
        if config:
            api_key = config.gemini_api_key
            model_name = config.gemini_model
            self.max_retries = getattr(config, 'gemini_max_retries', 5)
            self.retry_delay = getattr(config, 'gemini_retry_delay_seconds', 10)
            self.backoff_factor = getattr(config, 'gemini_backoff_factor', 2)
        else:
            # Fallback to old behavior for backward compatibility
            from config import Config
            try:
                config = Config.from_env()
                api_key = config.gemini_api_key
                model_name = config.gemini_model
                self.max_retries = getattr(config, 'gemini_max_retries', 5)
                self.retry_delay = getattr(config, 'gemini_retry_delay_seconds', 10)
                self.backoff_factor = getattr(config, 'gemini_backoff_factor', 2)
            except ConfigurationError as e:
                log.error(f"Configuration error: {e}")
                raise
        
        if not api_key:
            raise ConfigurationError("GEMINI_API_KEY is not set", missing_keys=["GEMINI_API_KEY"])
        
        # Log first and last 5 characters for debugging (without exposing full key)
        log.debug(f"Загрузка API ключа Gemini (первые 5 символов: {api_key[:5]}..., последние 5: ...{api_key[-5:]})")

        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)
        log.info(f"GeminiNER initialized with model '{model_name}'.")

    def extract_entities(self, text: str) -> list[dict]:
        """
        Forms a detailed prompt and sends it to the Gemini API to extract
        drug name, dosage, route, and author's level of evidence.

        Args:
            text: The full Russian text of the clinical protocol.

        Returns:
            A list of dictionaries, where each dictionary represents a
            unique drug prescription with its extracted entities. Returns
            an empty list if extraction fails.
        """
        # This prompt is engineered based on the blueprint (Часть 4.1)
        system_prompt = f"""
Ты — высокоточный медицинский NLP-анализатор. Твоя задача — извлечь *все* упоминания лекарственных средств (ЛС) из предоставленного русскоязычного клинического протокола.

[ТРЕБОВАНИЯ К ИЗВЛЕЧЕНИЮ (ТЗ 3.1.2)]
1. **Наименования ЛС**: Распознавай Международные Непатентованные Наименования (МНН) и Торговые Наименования (ТН). Извлекай как русские, так и английские варианты МНН.
2. **Способ введения**: Внимательно извлекай ВСЕ способы введения, указанные авторами протокола:
   - "в/в", "внутривенно", "iv", "intravenous" -> "intravenous"
   - "в/м", "внутримышечно", "im", "intramuscular" -> "intramuscular"
   - "перорально", "per os", "po", "oral" -> "oral"
   - "подкожно", "sc", "subcutaneous" -> "subcutaneous"
   - "местно", "topical" -> "topical"
   - И другие варианты - извлекай ТОЧНО как указано в тексте
3. **Дозировки**: Извлекай ПОЛНУЮ информацию о дозировках:
   - Точное число и единицы измерения (мг, г, мл, МЕ, мкг, единицы)
   - Кратность приема ("2 раза в сутки", "каждые 8 часов", "1 раз в день")
   - Режим дозирования ("по 100 мг", "от 50 до 200 мг")
   - Длительность ("в течение 7 дней", "курс 10 дней")
   - Извлекай ТОЧНО как указано авторами, не выдумывай
4. **Уровень доказательности (УД)**: Извлекай авторский УД (например, «УД A», «уровень 1b», «I», «IIa»).

[ФОРМАТ ВЫВОДА]
Ты *обязан* вернуть ответ *только* в формате JSON-списка (list of JSON objects). Не добавляй никакого сопроводительного текста (никаких "Вот JSON:").
Каждый объект в списке должен представлять одно уникальное назначение ЛС и иметь *строго* следующую структуру:

[
    {{
        "drug_name": "string (МНН или ТН, как в тексте)",
        "inn_english": "string (английское МНН, если найдено) | null",
        "inn_russian": "string (русское МНН, если найдено) | null",
        "dosage": "string (полная дозировка ТОЧНО как в тексте, e.g., '100 мг 2 раза в сутки', '50-100 мг каждые 8 часов') | null",
        "route": "string (нормализованный путь введения, e.g., 'intravenous', 'oral', 'intramuscular') | null",
        "frequency": "string (кратность приема, e.g., '2 раза в сутки', 'каждые 8 часов') | null",
        "duration": "string (длительность лечения, e.g., '7 дней', '10-14 дней') | null",
        "author_ud": "string (авторский УД, e.g., 'A', '1b', 'C-2', 'I') | null"
    }}
]

[ИНСТРУКЦИИ]
- Если для ЛС не указана доза, путь или УД, используй `null`.
- НЕ выдумывай информацию. Извлекай ТОЛЬКО то, что явно указано в тексте.
- Обрабатывай таблицы и списки внимательно.
- Если одно и то же ЛС упоминается 10 раз с разными дозами, верни 10 объектов.
- Для dosage извлекай ВСЕ детали дозировки точно как указано авторами.
- Для route извлекай ВСЕ способы введения точно как указано авторами.

[ТЕКСТ ПРОТОКОЛА ДЛЯ АНАЛИЗА]
{text}
"""
        log.info("Sending request to Gemini API for entity extraction...")
        
        import time
        max_retries = self.max_retries
        retry_delay = self.retry_delay

        for attempt in range(max_retries + 1):
            try:
                response = self.model.generate_content(system_prompt)

                # Clean the response: Gemini might wrap the JSON in markdown backticks
                # ```json ... ``` or just ``` ... ```
                cleaned_response_text = re.sub(r'^```(json)?\s*|\s*```$', '', response.text, flags=re.MULTILINE).strip()

                log.info("Received response from Gemini. Attempting to parse JSON.")
                # Parse the cleaned JSON string
                extracted_data = json.loads(cleaned_response_text)

                if isinstance(extracted_data, list):
                    log.info(f"Successfully extracted and parsed {len(extracted_data)} entities.")
                    # Ensure all required fields are present
                    for item in extracted_data:
                        if 'inn_english' not in item:
                            item['inn_english'] = None
                        if 'inn_russian' not in item:
                            item['inn_russian'] = None
                        if 'frequency' not in item:
                            item['frequency'] = None
                        if 'duration' not in item:
                            item['duration'] = None
                    
                    # Валидация извлеченных сущностей
                    from modules.validation import validate_drug_entity
                    from modules.exceptions import ValidationError as ValError
                    validated_entities = []
                    for item in extracted_data:
                        try:
                            validate_drug_entity(item)
                            validated_entities.append(item)
                        except ValError as e:
                            log.warning(f"Пропущена невалидная сущность: {e}")
                    
                    return validated_entities
                else:
                    log.warning("Gemini returned a valid JSON, but it's not a list as expected.")
                    return []

            except json.JSONDecodeError as e:
                error_msg = "Failed to decode JSON from Gemini's response."
                log.error(error_msg)
                if attempt < max_retries:
                    log.warning(f"Retrying JSON decode error in {retry_delay}s... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    retry_delay *= self.backoff_factor
                    continue
                log.debug(f"Raw Gemini response was:\n---\n{response.text}\n---")
                raise NERError(error_msg, original_error=e)
                
            except Exception as e:
                error_msg = f"An unexpected error occurred while communicating with Gemini API: {e}"
                
                # Check for 429 or other retryable errors
                if "429" in str(e) or "ResourceExhausted" in str(e) or "ServiceUnavailable" in str(e):
                    if attempt < max_retries:
                        log.warning(f"Gemini API Rate Limit/Error. Retrying in {retry_delay}s... (Attempt {attempt + 1}/{max_retries})")
                        time.sleep(retry_delay)
                        retry_delay *= self.backoff_factor
                        continue
                
                log.error(error_msg)
                if attempt < max_retries:
                     # General retry for other errors just in case
                    log.warning(f"Retrying unexpected error in {retry_delay}s... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(retry_delay)
                    retry_delay *= self.backoff_factor
                    continue
                    
                raise NERError(error_msg, original_error=e)

