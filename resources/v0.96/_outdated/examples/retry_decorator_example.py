"""
Пример использования retry механизма для API вызовов
"""
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    retry_if_result,
    before_sleep_log,
    after_log
)
import logging
import requests
from examples.exceptions_example import APIError

log = logging.getLogger(__name__)


def retry_api_call(max_attempts: int = 3, min_wait: int = 2, max_wait: int = 10):
    """
    Декоратор для повторных попыток API вызовов
    
    Args:
        max_attempts: Максимальное количество попыток
        min_wait: Минимальная задержка между попытками (секунды)
        max_wait: Максимальная задержка между попытками (секунды)
    """
    return retry(
        stop=stop_after_attempt(max_attempts),
        wait=wait_exponential(multiplier=1, min=min_wait, max=max_wait),
        retry=retry_if_exception_type((
            requests.RequestException,
            APIError,
            ConnectionError,
            TimeoutError
        )),
        before_sleep=before_sleep_log(log, logging.WARNING),
        after=after_log(log, logging.INFO),
        reraise=True
    )


class PubMedClientWithRetry:
    """Пример клиента с retry механизмом"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
    
    @retry_api_call(max_attempts=3)
    def search(self, query: str) -> dict:
        """
        Поиск в PubMed с автоматическими повторами при ошибках
        
        Args:
            query: Поисковый запрос
            
        Returns:
            Результаты поиска
            
        Raises:
            APIError: Если все попытки исчерпаны
        """
        try:
            url = f"{self.base_url}/esearch.fcgi"
            params = {
                "db": "pubmed",
                "term": query,
                "api_key": self.api_key,
                "retmode": "json"
            }
            
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            # Проверка на ошибки в ответе
            if "error" in data:
                raise APIError(
                    message=data["error"],
                    api_name="PubMed",
                    status_code=response.status_code,
                    url=url
                )
            
            return data
            
        except requests.RequestException as e:
            raise APIError(
                message=str(e),
                api_name="PubMed",
                status_code=getattr(e.response, 'status_code', None) if hasattr(e, 'response') else None,
                url=url
            )


# Пример использования
if __name__ == "__main__":
    client = PubMedClientWithRetry(api_key="your_key")
    
    try:
        results = client.search("metformin AND diabetes")
        print(f"Найдено результатов: {results.get('esearchresult', {}).get('count', 0)}")
    except APIError as e:
        print(f"Ошибка после всех попыток: {e}")

