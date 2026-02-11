"""
VerificationEngine: orchestrates verification for each extracted drug.

Responsibilities per drug:
- Local formulary presence + detailed check (BNF/BNFC/WHO EML)
- Regulators: FDA (openFDA), EMA (Excel DB)
- Evidence: PubMed (smart queries), ClinicalTrials.gov
- Kazakhstan register (Excel; resilient reading)

Returns a consolidated record for reporting and GRADE synthesis.
"""

import logging
from modules.api_clients import PubMedClient, OpenFDAClient, EMAClient, ClinicalTrialsClient
from modules.formulary_indexer import FormularyIndexer
from modules.kazakhstan_register import KazakhstanRegister

log = logging.getLogger(__name__)

class VerificationEngine:
    """
    High-level orchestrator for verification pipeline.
    """

    def __init__(self, gemini_model=None, config=None):
        """
        Initialize API clients and ensure local formulary index is built.
        
        Args:
            gemini_model: Optional Gemini model for smart PubMed query generation.
            config: Optional Config object for rate limiting settings.
        """
        log.info("Initializing VerificationEngine and all subsidiary clients...")
        
        # Инициализация rate limiter и cache manager для PubMed если нужно
        rate_limiter = None
        cache_manager = None
        if config:
            from modules.rate_limiter import RateLimiter
            from modules.cache_manager import PubMedCacheManager
            
            if config.pubmed_rate_limit_enabled:
                rate_limiter = RateLimiter(
                    max_calls=config.pubmed_rate_limit_per_minute,
                    period=60.0,
                    name="PubMedRateLimiter"
                )
                min_delay = getattr(config, 'pubmed_min_delay_seconds', 0.1)
                log.info(f"PubMed rate limiter enabled: {config.pubmed_rate_limit_per_minute} calls/min, min delay: {min_delay}s")
            
            if config.enable_cache:
                cache_dir = config.get_cache_path('pubmed')
                cache_manager = PubMedCacheManager(
                    cache_dir=cache_dir,
                    ttl_days=config.cache_ttl_days,
                    enabled=True
                )
                log.info(f"PubMed cache enabled: TTL={config.cache_ttl_days} days, dir={cache_dir}")
        
        # Initialize API clients with Gemini model for smart search
        self.pubmed = PubMedClient(
            gemini_model=gemini_model, 
            rate_limiter=rate_limiter,
            cache_manager=cache_manager,
            config=config
        )
        self.fda = OpenFDAClient()
        self.ema = EMAClient()
        self.clinical_trials = ClinicalTrialsClient()
        
        # Initialize Kazakhstan register with Gemini model for better search
        self.kz_register = KazakhstanRegister(gemini_model=gemini_model)

        # PDF sources as defined in KNOWLEDGE_API_SPECS.md
        pdf_sources = [
            {'name': 'WHO_EML', 'url': 'https://drive.google.com/file/d/1yrRql0ZkPvuZp8HtBNDaG3C1kj1D43j0/view?usp=drive_link'},
            {'name': 'BNF', 'url': 'https://drive.google.com/file/d/1haoCTqyrpduAre9SdOyB5924fechp0hc/view?usp=drive_link'},
            {'name': 'BNF_Children', 'url': 'https://drive.google.com/file/d/1MpXEiLAdCbYdgdL91EAJgzVZIzKSQsU7/view?usp=drive_link'}
        ]
        self.formulary = FormularyIndexer(pdf_sources)

        # Ensure the PDF index is built and ready before verification
        self.formulary.run_indexing()
        log.info("VerificationEngine initialized successfully.")

    def run_verification(self, extracted_data: list[dict], indication: str) -> list[dict]:
        """
        Run enhanced verification for each extracted entity and return list of
        consolidated verification records.
        """
        results = []
        log.info(f"Starting enhanced verification for {len(extracted_data)} extracted entities.")

        for i, drug_info in enumerate(extracted_data):
            original_name = drug_info.get('drug_name')
            if not original_name:
                continue

            log.info(f"--- Verifying entity {i+1}/{len(extracted_data)}: '{original_name}' ---")

            # Extract drug information
            inn_english = drug_info.get('inn_english') or original_name
            inn_russian = drug_info.get('inn_russian')
            dosage = drug_info.get('dosage')
            route = drug_info.get('route')
            frequency = drug_info.get('frequency')
            duration = drug_info.get('duration')

            # Step 1: Perform detailed formulary checks
            formulary_status = self.formulary.check_inn_presence(inn_english)
            formulary_detailed = self.formulary.check_inn_detailed(inn_english, dosage, route)

            # Step 2: Check external APIs
            fda_data = self.fda.check_approval(inn_english, indication)
            ema_status_data = self.ema.check_approval(inn_english)
            
            # Step 3: Enhanced PubMed search with smart queries
            pubmed_data = self.pubmed.search_evidence(
                inn_english, 
                indication, 
                dosage=dosage, 
                route=route
            )

            # Step 4: ClinicalTrials.gov search
            clinical_trials_data = self.clinical_trials.search_trials(inn_english, indication)

            # Step 5: Kazakhstan register check
            kz_register_data = self.kz_register.search(
                inn_russian=inn_russian,
                inn_english=inn_english
            )

            # Step 6: Aggregate all data into a comprehensive record
            verification_record = {
                "original_name": original_name,
                "inn": inn_english,
                "inn_russian": inn_russian,
                "dosage": dosage,
                "route": route,
                "frequency": frequency,
                "duration": duration,
                "author_ud": drug_info.get('author_ud'),
                
                # Formulary status (basic)
                "formulary_bnf": formulary_status.get('BNF', False),
                "formulary_bnfc": formulary_status.get('BNF_Children', False),
                "formulary_who_eml": formulary_status.get('WHO_EML', False),
                
                # Formulary detailed information
                "formulary_detailed": formulary_detailed,
                
                # Regulatory approvals
                "approval_fda": fda_data,
                "approval_ema": ema_status_data['status'],
                
                # Evidence from research
                "evidence_pubmed": pubmed_data,
                "clinical_trials": clinical_trials_data,
                
                # Kazakhstan register
                "kz_register": kz_register_data,
                
                # Comments
                "comments": ema_status_data['comment']
            }
            
            # Add off-label comment if needed
            if isinstance(fda_data, dict) and not fda_data.get('approved', False):
                off_label_comment = "Назначение off-label (FDA)."
                if verification_record['comments']:
                    verification_record['comments'] = f"{verification_record['comments']}. {off_label_comment}"
                else:
                    verification_record['comments'] = off_label_comment
            
            results.append(verification_record)

        log.info("Enhanced verification process completed.")
        return results
