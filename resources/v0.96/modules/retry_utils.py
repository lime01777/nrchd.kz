"""
Утилиты для повторных попыток API вызовов
"""
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log,
    after_log
)
import logging
import requests
from modules.exceptions import APIError

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

