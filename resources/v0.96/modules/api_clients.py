"""
API clients used across verification step:
- PubMedClient: builds smart queries (optionally via Gemini) and fetches article summaries
- OpenFDAClient: checks FDA approvals by INN
- ClinicalTrialsClient: fetches trials data for drug/condition
- EMAClient: checks EMA approval using local/downloaded Excel database

Each client encapsulates endpoint details, throttling and parsing.
"""

import requests
from dotenv import load_dotenv
import os
import logging
import time
from datetime import datetime
import pandas as pd
from modules.exceptions import APIError
from modules.retry_utils import retry_api_call
from modules.rate_limiter import RateLimiter, RateLimiterContext
from modules.cache_manager import PubMedCacheManager
# Note: lru_cache and hashlib imports removed as not used in final implementation

# --- Base Client ---

class APIClient:
    """
    Base for API clients: loads env vars, provides logger and helpers.
    """
    def __init__(self):
        """Initializes the client and loads environment variables."""
        load_dotenv()
        self.logger = logging.getLogger(self.__class__.__name__)

    def _get_env(self, key: str) -> str:
        """
        Safely retrieves an environment variable.
        Args:
            key: The name of the environment variable.
        Returns:
            The value of the environment variable.
        Raises:
            ValueError: If the environment variable is not found.
        """
        value = os.getenv(key)
        if not value:
            self.logger.error(f"Environment variable '{key}' not found in .env file.")
            raise ValueError(f"'{key}' must be set in the environment.")
        return value

# --- Specific API Clients ---

class PubMedClient(APIClient):
    """
    PubMed E-utilities client.
    - Generates 8–10 smart queries (via Gemini fallback/basic)
    - Collects PMIDs, fetches article summaries, classifies by type
    """
    BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
    BASE_SUMMARY_URL = f"{BASE_URL}/esummary.fcgi"
    BASE_FETCH_URL = f"{BASE_URL}/efetch.fcgi"
    PMC_CONVERTER_URL = "https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles/"

    def __init__(self, gemini_model=None, rate_limiter: RateLimiter = None, cache_manager: PubMedCacheManager = None, config=None):
        super().__init__()
        self.api_key = self._get_env("PUBMED_API_KEY")
        self.tool = self._get_env("PUBMED_TOOL")
        self.email = self._get_env("PUBMED_EMAIL")
        self.gemini_model = gemini_model  # Optional Gemini model for query generation
        
        # Инициализация rate limiter (консервативный лимит: 20 запросов в минуту)
        if rate_limiter is None:
            # Пытаемся загрузить настройки из config
            if config is None:
                try:
                    from config import Config
                    config = Config.from_env()
                except Exception:
                    config = None
            
            if config:
                max_calls = getattr(config, 'pubmed_rate_limit_per_minute', 20)
                rate_limit_enabled = getattr(config, 'pubmed_rate_limit_enabled', True)
                min_delay = getattr(config, 'pubmed_min_delay_seconds', 0.1)
                self._min_delay = min_delay  # Сохраняем минимальную задержку
                
                if rate_limit_enabled:
                    self.rate_limiter = RateLimiter(
                        max_calls=max_calls,
                        period=60.0,
                        name="PubMedRateLimiter"
                    )
                else:
                    self.rate_limiter = None
            else:
                # Fallback к значениям по умолчанию
                self._min_delay = 0.1
                self.rate_limiter = RateLimiter(
                    max_calls=20,
                    period=60.0,
                    name="PubMedRateLimiter"
                )
        else:
            self.rate_limiter = rate_limiter
            self._min_delay = getattr(config, 'pubmed_min_delay_seconds', 0.1) if config else 0.1
        
        # Инициализация cache manager
        if cache_manager is None:
            # Пытаемся загрузить настройки из config
            if config is None:
                try:
                    from config import Config
                    config = Config.from_env()
                except Exception:
                    config = None
            
            if config:
                cache_enabled = getattr(config, 'enable_cache', True)
                cache_ttl_days = getattr(config, 'cache_ttl_days', 30)
                cache_dir = config.get_cache_path('pubmed')
                
                if cache_enabled:
                    self.cache_manager = PubMedCacheManager(
                        cache_dir=cache_dir,
                        ttl_days=cache_ttl_days,
                        enabled=True
                    )
                    # Очищаем истекший кэш при инициализации
                    expired_count = self.cache_manager.clear_expired()
                    if expired_count > 0:
                        self.logger.info(f"Cleared {expired_count} expired PubMed cache entries")
                else:
                    self.cache_manager = None
            else:
                # Fallback: кэш отключен
                self.cache_manager = None
        else:
            self.cache_manager = cache_manager
        
        rate_info = f"rate limiter: {self.rate_limiter.max_calls} calls/min" if self.rate_limiter else "rate limiter: disabled"
        cache_info = "cache: enabled" if self.cache_manager else "cache: disabled"
        self.logger.info(f"PubMedClient initialized with {rate_info}, {cache_info}")

    def _generate_search_queries(self, inn: str, indication: str, dosage: str = None, route: str = None) -> list[str]:
        """
        Build diversified PubMed queries (RCT/meta/systematic/cohort/safety/etc.)
        with 15-year date filter. Uses Gemini when available, otherwise a basic set.
        """
        year_15_ago = (datetime.now().year - 15)
        current_year = datetime.now().year
        date_filter = f'AND ("{year_15_ago}"[Date - Publication] : "{current_year}"[Date - Publication])'
        
        if not self.gemini_model:
            # Fallback to basic queries if Gemini is not available
            base_queries = [
                f'({inn} AND {indication}) AND ("Randomized Controlled Trial"[Publication Type]) {date_filter}',
                f'({inn} AND {indication}) AND ("Meta-Analysis"[Publication Type]) {date_filter}',
                f'({inn} AND {indication}) AND ("Systematic Review"[Publication Type]) {date_filter}',
            ]
            return base_queries
        
        prompt = f"""
Сгенерируй 8-10 оптимальных поисковых запросов для PubMed для поиска клинических исследований препарата.

Препарат (МНН): {inn}
Заболевание/состояние: {indication}
Дозировка: {dosage or "не указана"}
Путь введения: {route or "не указан"}

Требования:
1. Включи запросы для: RCT, meta-analysis, systematic review, cohort studies, safety, contraindications, PK/PD, comparative studies
2. Используй правильный синтаксис PubMed
3. Обязательно добавь фильтр по дате: AND ("{year_15_ago}"[Date - Publication] : "{current_year}"[Date - Publication])
4. Используй различные комбинации: [Title/Abstract], [MeSH Terms], [Publication Type]
5. Верни ТОЛЬКО список запросов, каждый на новой строке, без нумерации и без дополнительного текста

Пример формата:
(metformin AND diabetes) AND ("Randomized Controlled Trial"[Publication Type]) AND ("2009"[Date - Publication] : "2024"[Date - Publication])

Генерируй запросы:
"""
        try:
            response = self.gemini_model.generate_content(prompt)
            queries = [q.strip() for q in response.text.strip().split('\n') if q.strip() and not q.strip().startswith('#')]
            # Ensure date filter is in each query
            queries = [q if date_filter in q else f"{q} {date_filter}" for q in queries]
            return queries[:10]  # Limit to 10 queries
        except Exception as e:
            self.logger.error(f"Error generating search queries via Gemini: {e}")
            # Fallback
            return [
                f'({inn} AND {indication}) AND ("Randomized Controlled Trial"[Publication Type]) {date_filter}',
                f'({inn} AND {indication}) AND ("Meta-Analysis"[Publication Type]) {date_filter}',
                f'({inn} AND {indication}) AND ("Systematic Review"[Publication Type]) {date_filter}',
            ]

    @retry_api_call(max_attempts=3)
    def _run_esearch(self, term: str, retmax: int = 10) -> list[str]:
        """
        Executes an ESearch query and returns list of PMIDs.
        Respects API rate limits using RateLimiter.
        """
        # Используем rate limiter для контроля частоты запросов
        wait_time = 0.0
        if self.rate_limiter:
            wait_time = self.rate_limiter.wait_if_needed()
        
        # Дополнительная минимальная задержка для надежности (даже если rate limiter разрешил)
        # Это помогает избежать превышения лимита при параллельной обработке
        min_delay = getattr(self, '_min_delay', 0.1)  # По умолчанию 0.1 секунды
        if wait_time < min_delay:
            time.sleep(min_delay - wait_time)
        
        params = {
            'db': 'pubmed',
            'api_key': self.api_key,
            'tool': self.tool,
            'email': self.email,
            'retmode': 'json',
            'retmax': retmax,
            'term': term
        }
        try:
            response = requests.get(f"{self.BASE_URL}/esearch.fcgi", params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            pmids = data.get('esearchresult', {}).get('idlist', [])
            return pmids
        except requests.RequestException as e:
            error_msg = f"PubMed API request failed for term '{term}'"
            self.logger.error(f"{error_msg}. Error: {e}")
            raise APIError(
                message=str(e),
                api_name="PubMed",
                status_code=getattr(e.response, 'status_code', None) if hasattr(e, 'response') else None,
                url=f"{self.BASE_URL}/esearch.fcgi"
            )
        except (KeyError, ValueError, TypeError) as e:
            error_msg = f"Error parsing PubMed response for term '{term}'"
            self.logger.error(f"{error_msg}. Error: {e}")
            raise APIError(
                message=f"Parsing error: {str(e)}",
                api_name="PubMed",
                url=f"{self.BASE_URL}/esearch.fcgi"
            )

    def _convert_pmids_to_pmcids(self, pmids: list[str]) -> dict[str, dict]:
        """
        Конвертирует список PMID в PMCID и DOI пакетно через PMC ID Converter API.
        Обрабатывает до 200 ID за один запрос (лимит API).
        
        Это оптимизирует количество запросов и дает дополнительную информацию:
        - PMCID позволяет получить доступ к полным текстам в PMC
        - DOI можно использовать для альтернативных источников (Crossref, Europe PMC)
        
        Примечание: Результаты автоматически сохраняются в кэш вместе с остальными данными статей.
        
        Args:
            pmids: Список PubMed IDs для конвертации
        
        Returns:
            Словарь вида {pmid: {'pmcid': 'PMC...', 'doi': '10.xxx/...'}} или пустой dict
            Только для статей, которые есть в PubMed Central
        """
        if not pmids:
            return {}
        
        # PMC ID Converter API позволяет до 200 ID за запрос
        BATCH_SIZE = 200
        id_mapping = {}
        
        # Разбиваем на батчи по 200
        for i in range(0, len(pmids), BATCH_SIZE):
            batch = pmids[i:i + BATCH_SIZE]
            
            try:
                # Параметры запроса к PMC ID Converter API
                params = {
                    'ids': ','.join(batch),
                    'idtype': 'pmid',  # Указываем что это PMID
                    'format': 'json',
                    'tool': self.tool,
                    'email': self.email
                }
                
                # Делаем запрос (без rate limiter, так как это отдельный API)
                # Но добавляем небольшую задержку для безопасности
                time.sleep(0.1)
                
                response = requests.get(self.PMC_CONVERTER_URL, params=params, timeout=15)
                response.raise_for_status()
                data = response.json()
                
                # Проверяем статус ответа (должен быть 'ok')
                if data.get('status') != 'ok':
                    self.logger.warning(f"PMC ID Converter API returned non-ok status: {data.get('status')}")
                    continue
                
                # Парсим результаты (структура: {'records': [...]})
                records = data.get('records', [])
                for record in records:
                    # PMID может быть числом или строкой в ответе API
                    pmid_raw = record.get('pmid')
                    if pmid_raw is None:
                        continue
                    pmid = str(pmid_raw).strip()
                    if not pmid:
                        continue
                    
                    mapping = {}
                    
                    # Извлекаем PMCID (если есть)
                    pmcid = record.get('pmcid')
                    if pmcid:
                        mapping['pmcid'] = str(pmcid).strip()
                    
                    # Извлекаем DOI (если есть)
                    doi = record.get('doi')
                    if doi:
                        mapping['doi'] = str(doi).strip()
                    
                    # Сохраняем только если есть хотя бы один ID
                    if mapping:
                        id_mapping[pmid] = mapping
                
                # Логируем количество конвертированных в этом батче
                batch_converted = len([pmid for pmid in batch if pmid in id_mapping])
                self.logger.debug(
                    f"PMC ID Converter batch {i//BATCH_SIZE + 1}: "
                    f"конвертировано {batch_converted} из {len(batch)} PMIDs"
                )
                
            except requests.RequestException as e:
                self.logger.warning(f"PMC ID Converter API request failed for batch: {e}")
                # Продолжаем обработку других батчей
                continue
            except (KeyError, ValueError, TypeError) as e:
                self.logger.warning(f"Error parsing PMC ID Converter response: {e}")
                continue
        
        return id_mapping

    def _get_article_details(self, pmids: list[str]) -> list[dict]:
        """
        Retrieves detailed information about articles by their PMIDs.
        Использует PMC ID Converter API для получения PMCID и DOI пакетно.
        Respects API rate limits using RateLimiter.
        """
        if not pmids:
            return []
        
        # ШАГ 1: Конвертируем PMID в PMCID и DOI пакетно (до 200 за запрос)
        # Это оптимизирует количество запросов и дает дополнительную информацию
        id_mapping = {}
        try:
            id_mapping = self._convert_pmids_to_pmcids(pmids)
            if id_mapping:
                pmcid_count = sum(1 for m in id_mapping.values() if 'pmcid' in m)
                doi_count = sum(1 for m in id_mapping.values() if 'doi' in m)
                self.logger.debug(
                    f"PMC ID Converter: получены PMCID для {pmcid_count} статей, "
                    f"DOI для {doi_count} статей из {len(pmids)} всего"
                )
        except Exception as e:
            self.logger.warning(f"Ошибка при конвертации PMID в PMCID/DOI: {e}. Продолжаем без них.")
            # Продолжаем работу даже если конвертация не удалась
        
        # ШАГ 2: Получаем детали статей через E-utilities (как раньше)
        # Используем rate limiter для контроля частоты запросов
        wait_time = 0.0
        if self.rate_limiter:
            wait_time = self.rate_limiter.wait_if_needed()
        
        # Дополнительная минимальная задержка для надежности
        min_delay = getattr(self, '_min_delay', 0.1)
        if wait_time < min_delay:
            time.sleep(min_delay - wait_time)
        
        params = {
            'db': 'pubmed',
            'api_key': self.api_key,
            'tool': self.tool,
            'email': self.email,
            'retmode': 'json',
            'id': ','.join(pmids)
        }
        try:
            response = requests.get(self.BASE_SUMMARY_URL, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            articles = []
            for pmid in pmids:
                article_data = data.get('result', {}).get(pmid, {})
                if article_data:
                    # Determine publication type
                    pub_types = article_data.get('pubtype', [])
                    article_type = 'Research'
                    if any('Meta-Analysis' in str(pt) for pt in pub_types):
                        article_type = 'Meta-Analysis'
                    elif any('Systematic Review' in str(pt) for pt in pub_types):
                        article_type = 'Systematic Review'
                    elif any('Randomized Controlled Trial' in str(pt) for pt in pub_types):
                        article_type = 'RCT'
                    elif any('Cohort' in str(pt) for pt in pub_types):
                        article_type = 'Cohort'
                    
                    # Получаем PMCID и DOI из конвертации (если доступны)
                    mapping = id_mapping.get(pmid, {})
                    pmcid = mapping.get('pmcid')
                    doi = mapping.get('doi')
                    
                    article_dict = {
                        'pmid': pmid,
                        'title': article_data.get('title', 'Название недоступно'),
                        'authors': ', '.join([a.get('name', '') for a in article_data.get('authors', [])[:3]]),
                        'journal': article_data.get('source', article_data.get('fulljournalname', 'Журнал недоступен')),
                        'year': article_data.get('pubdate', '').split(' ')[0] if article_data.get('pubdate') else 'Год недоступен',
                        'type': article_type,
                        'url': f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
                    }
                    
                    # Добавляем PMCID и DOI если они есть
                    if pmcid:
                        article_dict['pmcid'] = pmcid
                    if doi:
                        article_dict['doi'] = doi
                    
                    articles.append(article_dict)
            return articles
        except Exception as e:
            self.logger.error(f"Error retrieving article details: {e}")
            return []

    def search_evidence(self, inn: str, indication: str, dosage: str = None, route: str = None) -> dict:
        """
        Enhanced search for clinical evidence with smart query generation and detailed article retrieval.
        Uses caching to avoid repeated API calls for the same queries.
        
        Args:
            inn: The International Nonproprietary Name.
            indication: The clinical indication/disease.
            dosage: Optional dosage information.
            route: Optional route of administration.
        Returns:
            A dictionary with counts and detailed article information.
        """
        if not inn or not indication:
            return {
                "rct_count": 0,
                "meta_analysis_count": 0,
                "systematic_review_count": 0,
                "articles": [],
                "total_found": 0
            }

        # Проверяем кэш перед выполнением запроса
        if self.cache_manager:
            cached_result = self.cache_manager.get_pubmed_result(inn, indication, dosage, route)
            if cached_result is not None:
                self.logger.info(f"Cache hit for PubMed search: INN '{inn}', indication '{indication}'")
                # Добавляем флаг что результат из кэша
                cached_result['from_cache'] = True
                return cached_result

        self.logger.info(f"Searching PubMed for evidence on INN '{inn}' and indication '{indication}'.")
        
        error = False
        # Generate smart queries via Gemini
        queries = self._generate_search_queries(inn, indication, dosage, route)
        
        # Collect all PMIDs from all queries (as in v0.91)
        all_pmids = []
        for query in queries:
            pmids = self._run_esearch(query, retmax=10)
            all_pmids.extend(pmids)
        
        # Remove duplicates while preserving order
        unique_pmids = list(dict.fromkeys(all_pmids))
        
        # Get detailed article information (limit to top 50 as in v0.91)
        try:
            articles = self._get_article_details(unique_pmids[:50])
        except Exception as e:
            self.logger.error(f"PubMed details error: {e}")
            articles = []
            error = True
        
        # Count by type
        rct_count = sum(1 for a in articles if a['type'] == 'RCT')
        meta_count = sum(1 for a in articles if a['type'] == 'Meta-Analysis')
        systematic_count = sum(1 for a in articles if a['type'] == 'Systematic Review')
        
        # Формируем результат
        result = {
            "rct_count": rct_count,
            "meta_analysis_count": meta_count,
            "systematic_review_count": systematic_count,
            "articles": articles,
            "total_found": len(articles),
            "queries_used": queries[:6],
            "error": error,
            "from_cache": False
        }
        
        # Сохраняем в кэш
        if self.cache_manager:
            if self.cache_manager.set_pubmed_result(inn, indication, result, dosage, route):
                self.logger.debug(f"Cached PubMed result for INN '{inn}', indication '{indication}'")
        
        # Логируем статистику rate limiter периодически (каждые 10 запросов)
        if hasattr(self, 'rate_limiter') and self.rate_limiter:
            stats = self.rate_limiter.get_stats()
            if stats['total_calls'] % 10 == 0:
                self.logger.debug(
                    f"PubMed rate limiter stats: {stats['current_window_calls']}/{stats['max_calls']} "
                    f"calls in current window, {stats['blocked_calls']} blocked total"
                )
        
        return result

class OpenFDAClient(APIClient):
    """
    openFDA client: checks approval status by active ingredient name.
    Returns compact details for report.
    """
    BASE_URL = "https://api.fda.gov/drug/drugsfda.json"

    def __init__(self):
        super().__init__()
        self.logger.info("OpenFDAClient initialized.")

    def check_approval(self, inn: str, indication: str) -> dict:
        """
        Checks if a drug (INN) is approved and returns detailed information.
        Args:
            inn: The International Nonproprietary Name.
            indication: The clinical indication/disease.
        Returns:
            Dictionary with approval status and details.
        """
        if not inn:
            return {"approved": False, "details": []}

        # Search by active ingredients name as specified
        search_query = f'products.active_ingredients.name:"{inn}"'
        params = {'search': search_query, 'limit': 3}

        self.logger.info(f"Querying openFDA for INN '{inn}' and indication '{indication}'.")
        try:
            response = requests.get(self.BASE_URL, params=params, timeout=15)
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                if results:
                    self.logger.info("Approval found on openFDA.")
                    details = []
                    for result in results[:3]:
                        details.append({
                            'application_number': result.get('application_number', 'N/A'),
                            'sponsor_name': result.get('sponsor_name', 'N/A'),
                            'products': [
                                {
                                    'brand_name': p.get('brand_name', 'N/A'),
                                    'active_ingredients': ', '.join([ai.get('name', '') for ai in p.get('active_ingredients', [])]),
                                    'dosage_form': p.get('dosage_form', 'N/A'),
                                    'route': p.get('route', 'N/A')
                                }
                                for p in result.get('products', [])[:2]
                            ],
                            'url': f"https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo={result.get('application_number', '')}"
                        })
                    return {"approved": True, "details": details}
            self.logger.info("Approval not found on openFDA.")
            return {"approved": False, "details": []}
        except requests.RequestException as e:
            self.logger.error(f"OpenFDA API request failed. Error: {e}")
            return {"approved": False, "details": []}

class ClinicalTrialsClient(APIClient):
    """
    ClinicalTrials.gov API v2 client (JSON). Searches studies by intervention/condition.
    """
    BASE_URL = "https://clinicaltrials.gov/api/v2/studies"

    def __init__(self):
        super().__init__()
        self.logger.info("ClinicalTrialsClient initialized.")

    def search_trials(self, inn: str, condition: str = "") -> list[dict]:
        """
        Searches for clinical trials by drug name and condition.
        Args:
            inn: The International Nonproprietary Name.
            condition: The clinical condition/disease.
        Returns:
            List of trial dictionaries with details.
        """
        if not inn:
            return []

        params = {
            'format': 'json',
            'markupFormat': 'markup',
            'countTotal': 'true',
            'pageSize': 5,
            'filter.status': 'COMPLETED',
            'filter.phase': 'PHASE2,PHASE3,PHASE4'
        }

        # Build query (avoid non-ASCII condition to prevent 400)
        def _is_ascii(s: str) -> bool:
            try:
                s.encode('ascii')
                return True
            except Exception:
                return False

        params['query.intr'] = inn
        if condition and _is_ascii(condition):
            params['query.cond'] = condition

        self.logger.info(f"Searching ClinicalTrials.gov for '{inn}' and condition '{condition}'.")
        try:
            response = requests.get(self.BASE_URL, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            studies = data.get('studies', [])

            trials = []
            for study in studies[:5]:
                protocol = study.get('protocolSection', {})
                identification = protocol.get('identificationModule', {})
                status = protocol.get('statusModule', {})
                design = protocol.get('designModule', {})
                conditions = protocol.get('conditionsModule', {})

                trials.append({
                    'title': identification.get('briefTitle', 'Название недоступно'),
                    'nctId': identification.get('nctId', ''),
                    'phase': ', '.join(design.get('phases', [])) if design.get('phases') else 'Фаза недоступна',
                    'status': status.get('overallStatus', 'Статус недоступен'),
                    'condition': ', '.join(conditions.get('conditions', [])[:2]) if conditions.get('conditions') else 'Состояние недоступно',
                    'completionDate': status.get('primaryCompletionDateStruct', {}).get('date', 'Дата недоступна'),
                    'url': f"https://clinicaltrials.gov/study/{identification.get('nctId', '')}"
                })
            return trials
        except requests.RequestException as e:
            self.logger.error(f"ClinicalTrials.gov API request failed. Error: {e}")
            return []
        except (KeyError, ValueError, TypeError) as e:
            self.logger.error(f"Error parsing ClinicalTrials.gov response. Error: {e}")
            return []

class EMAClient(APIClient):
    """
    EMA client: loads local/downloaded Excel and searches INN/active substance columns.
    Enhanced with caching for performance.
    """
    # Default EMA Excel URL - can be overridden via EMA_EXCEL_URL env variable
    DEFAULT_EMA_EXCEL_URL = "https://www.ema.europa.eu/en/documents/report/medicines-output-medicines-report_en.xlsx"
    
    def __init__(self):
        super().__init__()
        # Try to get EMA Excel URL from environment, fallback to default
        self.ema_excel_url = os.getenv("EMA_EXCEL_URL", self.DEFAULT_EMA_EXCEL_URL)
        self._ema_data_cache = None  # Cache for EMA data
        self._ema_data_cache_time = None  # Cache timestamp
        self.logger.info(f"EMAClient initialized. Excel URL: {self.ema_excel_url}")

    def _download_ema_data(self) -> pd.DataFrame:
        """
        Loads EMA Excel data from local file if available, otherwise downloads from official URL.
        Uses caching to avoid repeated downloads during the same session.
        Returns:
            DataFrame with EMA data, or empty DataFrame on error.
        Note: EMA Excel file has headers in row 8 (0-indexed), so we use header=8.
        """
        # Use cached data if available (cached for the session)
        if self._ema_data_cache is not None:
            self.logger.debug("Using cached EMA data")
            return self._ema_data_cache
        
        # Path to local EMA file (same location as Kazakhstan register)
        local_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "pdf_sources", "temp_ema_data.xlsx"))
        
        # First, try to load from local file if it exists
        if os.path.exists(local_file):
            try:
                self.logger.info(f"Loading EMA data from local file: {local_file}")
                # EMA file has headers in row 8 (0-indexed), data starts from row 9
                df = pd.read_excel(local_file, header=8)
                self.logger.info(f"EMA data loaded from local file successfully. Columns: {list(df.columns)}, Rows: {len(df)}")
                # Cache the data
                self._ema_data_cache = df
                return df
            except Exception as e:
                self.logger.warning(f"Error reading local EMA file: {e}. Will try to download.")
        
        # If local file doesn't exist or failed to read, download from URL
        try:
            self.logger.info(f"Local EMA file not found. Downloading from {self.ema_excel_url}")
            os.makedirs(os.path.dirname(local_file), exist_ok=True)
            
            response = requests.get(self.ema_excel_url, timeout=30)
            response.raise_for_status()
            
            # Save downloaded file
            with open(local_file, 'wb') as f:
                f.write(response.content)
            
            # Read Excel file with correct header row
            df = pd.read_excel(local_file, header=8)
            
            self.logger.info(f"EMA data downloaded successfully. Columns: {list(df.columns)}, Rows: {len(df)}")
            # Cache the data
            self._ema_data_cache = df
            return df
            
        except Exception as e:
            self.logger.error(f"Error downloading EMA data: {e}")
            return pd.DataFrame()

    def check_approval(self, inn: str) -> dict:
        """
        Checks if a drug (INN) is approved by EMA by searching in the Excel database.
        Args:
            inn: The International Nonproprietary Name.
        Returns:
            Dictionary with approval status and details.
        """
        if not inn:
            return {
                'status': 'Not Found',
                'comment': 'INN not provided',
                'approved': False
            }

        self.logger.info(f"Checking EMA approval for INN '{inn}'")
        
        try:
            # Download EMA data
            ema_data = self._download_ema_data()
            
            if ema_data.empty:
                return {
                    'status': 'Error',
                    'comment': 'Failed to download EMA data. Manual verification needed.',
                    'approved': False
                }
            
            # Search for INN in the Excel file
            # Try different possible column names (actual EMA file uses "International non-proprietary name (INN) / common name")
            possible_inn_columns = [
                'International non-proprietary name (INN) / common name',
                'Active substance',
                'INN', 
                'International non-proprietary name', 
                'inn', 
                'International Non-proprietary Name', 
                'ACTIVE_SUBSTANCE'
            ]
            
            inn_column = None
            for col in possible_inn_columns:
                if col in ema_data.columns:
                    inn_column = col
                    self.logger.debug(f"Using INN column: {col}")
                    break
            
            # If not found, try searching in all columns that might contain INN
            if not inn_column:
                self.logger.warning(f"INN column not found. Available columns: {list(ema_data.columns)}")
                # Search in both "Active substance" and "International non-proprietary name (INN) / common name" if they exist
                search_columns = []
                for col in ema_data.columns:
                    col_str = str(col).lower()
                    if any(term in col_str for term in ['inn', 'international', 'active substance', 'common name']):
                        search_columns.append(col)
                
                if search_columns:
                    found = False
                    for col in search_columns:
                        try:
                            matches = ema_data[col].astype(str).str.contains(inn, case=False, na=False, regex=False)
                            if matches.any():
                                found = True
                                inn_column = col
                                self.logger.debug(f"Found INN in column: {col}")
                                break
                        except Exception as e:
                            self.logger.debug(f"Error searching in column {col}: {e}")
                            continue
                    
                    if not found:
                        return {
                            'status': 'Not Found',
                            'comment': f'INN "{inn}" not found in EMA database',
                            'approved': False
                        }
                else:
                    # Last resort: search in all text columns
                    found = False
                    for col in ema_data.columns:
                        if ema_data[col].dtype == 'object':  # Text column
                            try:
                                matches = ema_data[col].astype(str).str.contains(inn, case=False, na=False, regex=False)
                                if matches.any():
                                    found = True
                                    break
                            except:
                                continue
                    
                    if found:
                        return {
                            'status': 'Approved',
                            'comment': f'Found in EMA database (searched in multiple columns)',
                            'approved': True
                        }
                    else:
                        return {
                            'status': 'Not Found',
                            'comment': f'INN "{inn}" not found in EMA database',
                            'approved': False
                        }
            
            # Enhanced search with fuzzy matching and multiple strategies
            # Strategy 1: Exact substring match (case-insensitive)
            matches = ema_data[inn_column].astype(str).str.contains(inn, case=False, na=False, regex=False)
            
            # Strategy 2: If no exact match, try word boundary matching
            if not matches.any():
                # Split INN into words and search for each word
                inn_words = inn.split()
                if len(inn_words) > 1:
                    # Try to match all words (AND logic)
                    for word in inn_words:
                        if len(word) > 2:  # Skip very short words
                            word_matches = ema_data[inn_column].astype(str).str.contains(word, case=False, na=False, regex=False)
                            matches = matches | word_matches
            
            # Strategy 3: Try partial matching (first 6+ characters)
            if not matches.any() and len(inn) >= 6:
                partial = inn[:6].lower()
                matches = ema_data[inn_column].astype(str).str.lower().str.contains(partial, na=False, regex=False)
            
            # Strategy 4: Try without common suffixes/prefixes
            if not matches.any():
                # Remove common drug suffixes
                base_inn = inn
                for suffix in ['-', ' ', 'ium', 'in', 'ide', 'ol', 'ate', 'one']:
                    if base_inn.lower().endswith(suffix.lower()):
                        base_inn = base_inn[:-len(suffix)].strip()
                        if len(base_inn) >= 4:
                            base_matches = ema_data[inn_column].astype(str).str.contains(base_inn, case=False, na=False, regex=False)
                            if base_matches.any():
                                matches = base_matches
                                break
            
            if matches.any():
                matching_rows = ema_data[matches]
                self.logger.info(f"Found {len(matching_rows)} matching record(s) in EMA database")
                
                # Get some details from the first match
                first_match = matching_rows.iloc[0]
                details = {
                    'inn': str(first_match.get(inn_column, 'N/A')),
                    'total_matches': len(matching_rows)
                }
                
                # Try to get additional information
                if 'Product name' in matching_rows.columns:
                    details['product_names'] = matching_rows['Product name'].head(3).tolist()
                
                return {
                    'status': 'Approved',
                    'comment': f'Found {len(matching_rows)} record(s) in EMA database',
                    'approved': True,
                    'details': details
                }
            else:
                return {
                    'status': 'Not Found',
                    'comment': f'INN "{inn}" not found in EMA database',
                    'approved': False
                }
                
        except Exception as e:
            self.logger.error(f"Error checking EMA approval for '{inn}': {e}")
            return {
                'status': 'Error',
                'comment': f'Error during EMA check: {str(e)}. Manual verification needed.',
                'approved': False
            }

