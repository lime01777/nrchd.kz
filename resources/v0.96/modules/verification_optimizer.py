"""
Оптимизатор параллельной верификации препаратов.

Разделяет операции на категории по скорости и приоритету:
- Быстрые (локальные): формуляры, реестры - выполняются параллельно
- Медленные (API с rate limits): PubMed - контролируются через rate limiter
- Средние (внешние API): FDA, EMA, ClinicalTrials - выполняются параллельно
"""

import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, Any, Callable, List, Tuple
import time

log = logging.getLogger(__name__)


class VerificationOptimizer:
    """
    Оптимизатор для параллельной верификации препаратов с учетом rate limits.
    
    Стратегия:
    1. Быстрые операции (формуляры, локальные реестры) - выполняются сразу параллельно
    2. Внешние API (FDA, EMA, ClinicalTrials) - выполняются параллельно
    3. PubMed (с rate limit) - выполняется последовательно или с ограниченной параллельностью
    """
    
    def __init__(self, verification_engine, indication: str):
        """
        Инициализация оптимизатора.
        
        Args:
            verification_engine: Экземпляр VerificationEngine
            indication: Клиническая индикация
        """
        self.verification_engine = verification_engine
        self.indication = indication
    
    def verify_drug_optimized(self, drug_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Оптимизированная верификация препарата с умной приоритизацией.
        
        Args:
            drug_info: Информация о препарате из NER
        
        Returns:
            Полная запись верификации препарата
        """
        original_name = drug_info.get('drug_name')
        if not original_name:
            return None
        
        # Extract drug information
        inn_english = drug_info.get('inn_english') or original_name
        inn_russian = drug_info.get('inn_russian')
        dosage = drug_info.get('dosage')
        route = drug_info.get('route')
        frequency = drug_info.get('frequency')
        duration = drug_info.get('duration')
        
        # Normalize INN for external international sources
        def _ensure_english_inn(candidate_en: str, candidate_ru: str) -> str:
            text = (candidate_en or '').strip()
            if not text or any('\u0400' <= ch <= '\u04FF' for ch in text):
                src = (candidate_ru or original_name or '').strip()
                try:
                    # Используем Gemini для перевода если доступен
                    # Проверяем наличие gemini_model в pubmed клиенте
                    pubmed_client = self.verification_engine.pubmed
                    if src and hasattr(pubmed_client, 'gemini_model') and pubmed_client.gemini_model:
                        gemini_model = pubmed_client.gemini_model
                        prompt = f"Переведи МНН на английский (только одно слово/фраза): {src}"
                        resp = gemini_model.generate_content(prompt)
                        translated = resp.text.strip().strip('"').strip("'")
                        if translated:
                            return translated
                except Exception:
                    pass
            return text if text else (candidate_ru or original_name or '')
        
        inn_for_intl = _ensure_english_inn(inn_english, inn_russian)
        
        # ===== ЭТАП 1: Быстрые локальные операции (выполняются сразу) =====
        # Эти операции быстрые и не требуют rate limiting
        formulary_status = self.verification_engine.formulary.check_inn_presence(inn_for_intl)
        formulary_detailed = self.verification_engine.formulary.check_inn_detailed(inn_for_intl, dosage, route)
        kz_register_data = self.verification_engine.kz_register.search(
            inn_russian=inn_russian,
            inn_english=inn_english
        )
        
        # ===== ЭТАП 2: Внешние API (выполняются параллельно) =====
        # FDA, EMA, ClinicalTrials - выполняются параллельно, без rate limits
        fda_data = None
        ema_status_data = {"status": None, "comment": ""}
        clinical_trials_data = []
        
        def _fda():
            try:
                return self.verification_engine.fda.check_approval(inn_for_intl, self.indication)
            except Exception as e:
                log.debug(f"FDA check failed for {inn_for_intl}: {e}")
                return None
        
        def _ema():
            try:
                return self.verification_engine.ema.check_approval(inn_for_intl)
            except Exception as e:
                log.debug(f"EMA check failed for {inn_for_intl}: {e}")
                return {"status": None, "comment": ""}
        
        def _ct():
            try:
                return self.verification_engine.clinical_trials.search_trials(inn_for_intl, self.indication)
            except Exception as e:
                log.debug(f"ClinicalTrials check failed for {inn_for_intl}: {e}")
                return []
        
        # Выполняем внешние API параллельно (3 воркера для 3 API)
        with ThreadPoolExecutor(max_workers=3) as api_executor:
            api_futures = {
                api_executor.submit(_fda): "fda",
                api_executor.submit(_ema): "ema",
                api_executor.submit(_ct): "ct",
            }
            
            for future in as_completed(api_futures):
                tag = api_futures[future]
                try:
                    res = future.result()
                    if tag == "fda":
                        fda_data = res
                    elif tag == "ema":
                        ema_status_data = res if isinstance(res, dict) else {"status": None, "comment": ""}
                    elif tag == "ct":
                        clinical_trials_data = res if isinstance(res, list) else []
                except Exception as e:
                    log.debug(f"Error in {tag} check: {e}")
        
        # ===== ЭТАП 3: PubMed (контролируется rate limiter) =====
        # PubMed выполняется отдельно, rate limiter автоматически контролирует частоту
        # Если есть кэш, запрос будет мгновенным
        pubmed_data = {
            "articles": [],
            "total_found": 0,
            "rct_count": 0,
            "meta_analysis_count": 0,
            "systematic_review_count": 0
        }
        
        try:
            pubmed_data = self.verification_engine.pubmed.search_evidence(
                inn_for_intl,
                self.indication,
                dosage=dosage,
                route=route
            )
        except Exception as e:
            log.warning(f"PubMed search failed for {inn_for_intl}: {e}")
        
        # ===== ЭТАП 4: Агрегация результатов =====
        verification_record = {
            "original_name": original_name,
            "inn": inn_for_intl,
            "inn_russian": inn_russian,
            "dosage": dosage,
            "route": route,
            "frequency": frequency,
            "duration": duration,
            "author_ud": drug_info.get('author_ud'),
            "indication": self.indication,
            
            # Formulary status (basic)
            "formulary_bnf": formulary_status.get('BNF', False),
            "formulary_bnfc": formulary_status.get('BNF_Children', False),
            "formulary_who_eml": formulary_status.get('WHO_EML', False),
            
            # Formulary detailed information
            "formulary_detailed": formulary_detailed,
            
            # Regulatory approvals
            "approval_fda": fda_data,
            "approval_ema": ema_status_data.get('status') if isinstance(ema_status_data, dict) else None,
            
            # Evidence from research
            "evidence_pubmed": pubmed_data,
            "clinical_trials": clinical_trials_data,
            
            # Kazakhstan register
            "kz_register": kz_register_data,
            
            # Comments
            "comments": ema_status_data.get('comment', '') if isinstance(ema_status_data, dict) else ''
        }
        
        # Add off-label comment if needed
        if isinstance(fda_data, dict) and not fda_data.get('approved', False):
            off_label_comment = "Назначение off-label (FDA)."
            if verification_record['comments']:
                verification_record['comments'] = f"{verification_record['comments']}. {off_label_comment}"
            else:
                verification_record['comments'] = off_label_comment
        
        return verification_record

