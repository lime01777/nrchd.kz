#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Main entrypoint for Protocol Analyzer.

Responsibilities:
- Parse input protocol file (DOCX/PDF/TXT)
- Extract drug entities (NER via Gemini)
- Verify each drug across formularies, regulators, PubMed and trials
- Synthesize evidence level (GRADE) fast (rule-based) + refine via Gemini for C/D
- Generate Excel and (optional) Word reports

High-level flow:
1) Init components → 2) Parse file → 3) NER → 4) Verify (parallel) →
5) GRADE (rule-based → optional Gemini) → 6) Summary → 7) Reports
"""

import argparse
import logging
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

# Import all the necessary components from the modules
from modules.protocol_parser import parse_protocol_file
from modules.nlp_extractor import GeminiNER
from modules.verification_engine import VerificationEngine
from modules.evidence_synthesizer import calculate_system_ud, generate_protocol_summary, analyze_drug_with_gemini
from modules.report_generator import generate_excel_report, generate_word_report

# --- Main Application Logic ---

def main():
    """
    Main function to run the entire analysis pipeline.
    Enhanced with PDF support, parallel processing, and progress tracking.
    """
    # Setup detailed Russian logging with proper encoding for Windows
    import sys
    import io
    
    # Configure stdout encoding for Windows
    if sys.platform == 'win32':
        import codecs
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    
    # Custom handler that uses tqdm.write to avoid conflicts
    class TqdmLoggingHandler(logging.StreamHandler):
        """Handler that uses tqdm.write for output to avoid progress bar conflicts"""
        def emit(self, record):
            try:
                msg = self.format(record)
                tqdm.write(msg, file=self.stream)
                self.flush()
            except Exception:
                self.handleError(record)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s | %(levelname)-8s | %(name)-25s | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S',
        handlers=[
            TqdmLoggingHandler()
        ]
    )
    log = logging.getLogger('MainApp')
    
    # Set all module loggers to INFO for cleaner output
    logging.getLogger('modules').setLevel(logging.INFO)

    # Setup command-line argument parsing
    parser = argparse.ArgumentParser(
        description="Analyzes clinical protocols against formularies and evidence databases.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic usage with DOCX
  python main.py -i data/inputs/protocol.docx -o data/outputs/report.xlsx --indication "Diabetes Mellitus Type 2"
  
  # With PDF file
  python main.py -i data/inputs/protocol.pdf -o data/outputs/report.xlsx --indication "Pneumonia"
  
  # With parallel processing (8 workers)
  python main.py -i data/inputs/protocol.docx -o data/outputs/report.xlsx --indication "Sepsis" --max-workers 8
        """
    )
    parser.add_argument("-i", "--input", type=Path, required=True,
                        help="Path to the input file (DOCX, PDF, or TXT)")
    parser.add_argument("-o", "--output", type=Path, required=True,
                        help="Path for the output .xlsx report")
    parser.add_argument("--indication", type=str, required=True,
                        help="The primary indication/disease of the protocol (e.g., 'Diabetes Mellitus Type 2')")
    import os
    default_workers = min(12, max(2, (os.cpu_count() or 4) * 2))
    parser.add_argument("--max-workers", type=int, default=default_workers,
                        help=f"Maximum number of parallel workers for drug verification (default: {default_workers})")
    parser.add_argument("--word", action="store_true",
                        help="Generate additional Word report (coming soon)")
    parser.add_argument("--lang", type=str, default="ru", choices=["ru", "en"],
                        help="Language of the protocol (default: ru)")
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Enable verbose debug logging")

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
        logging.getLogger('modules').setLevel(logging.DEBUG)

    # Start timing
    start_time = time.time()
    
    log.info("=" * 80)
    log.info("ЗАПУСК АНАЛИЗАТОРА КЛИНИЧЕСКИХ ПРОТОКОЛОВ")
    log.info("=" * 80)
    log.info(f"Версия: v0.96 (Enhanced Reporting)")
    log.info(f"Язык: {args.lang.upper()}")
    log.info(f"Параллельных воркеров: {args.max_workers}")

    try:
        # Загрузка конфигурации
        from config import Config
        from modules.exceptions import ConfigurationError, ValidationError, ParsingError
        
        try:
            config = Config.from_env()
            log.info("✓ Конфигурация загружена")
        except ConfigurationError as e:
            log.error(f"Ошибка конфигурации: {e}")
            return
        
        # Шаг 1: Инициализация всех движков и парсеров
        # - Настройка NER (Gemini) и движка верификации
        # - Индексация локальных PDF-формуляров
        print("PROGRESS: 5", flush=True)
        log.info("")
        log.info("ШАГ 1: Инициализация компонентов системы")
        log.info("-" * 80)
        
        log.info("Инициализация извлечения сущностей (Gemini NER)...")
        try:
            ner_extractor = GeminiNER(config=config)
            log.info("✓ Gemini NER инициализирован")
        except ConfigurationError as e:
            log.error(f"Ошибка инициализации NER: {e}")
            return
        
        # Получаем модель Gemini для умного поиска в verification engine
        gemini_model = ner_extractor.model
        
        log.info("Инициализация движка верификации (может загрузить PDF при первом запуске)...")
        verification_engine = VerificationEngine(gemini_model=gemini_model, config=config)
        log.info("✓ Движок верификации готов")

        # Шаг 2: Парсинг входного файла (DOCX, PDF, TXT)
        # Универсальный парсер определяет тип и извлекает текст
        log.info("")
        log.info("ШАГ 2: Парсинг входного файла")
        log.info("-" * 80)
        
        # Resolve path to handle encoding issues on Windows
        input_path = Path(args.input).resolve()
        
        # Валидация входного файла
        from modules.validation import validate_protocol_file, validate_indication
        
        try:
            validate_protocol_file(input_path, max_size_mb=config.max_file_size_mb)
            log.info(f"✓ Файл прошел валидацию: {input_path}")
        except (ValidationError, FileNotFoundError) as e:
            log.error(f"Ошибка валидации файла: {e}")
            return
        
        # Валидация индикации
        try:
            validate_indication(args.indication)
            log.info(f"✓ Индикация валидна: {args.indication}")
        except ValidationError as e:
            log.error(f"Ошибка валидации индикации: {e}")
            return
        
        # If path doesn't exist, try to find the file in inputs directory
        if not input_path.exists():
            log.warning(f"Путь {input_path} не найден. Поиск файла в data/inputs...")
            inputs_dir = Path("data/inputs").resolve()
            if inputs_dir.exists():
                # Find any file in inputs directory
                files = list(inputs_dir.iterdir())
                if files:
                    input_path = files[0]
                    log.info(f"Найден файл: {input_path}")
        
        file_ext = input_path.suffix.lower()
        log.info(f"Формат файла: {file_ext.upper()}")
        log.info(f"Чтение файла: {input_path}")
        
        try:
            protocol_text = parse_protocol_file(input_path)
        except Exception as e:
            log.error(f"Ошибка парсинга файла: {e}")
            raise ParsingError(str(e), file_path=str(input_path))
        
        if not protocol_text.strip():
            log.warning("⚠ ПРЕДУПРЕЖДЕНИЕ: Извлеченный текст пуст. Обработка невозможна.")
            return
        log.info(f"✓ Успешно извлечено {len(protocol_text)} символов текста из протокола")
        print("PROGRESS: 10", flush=True)

        # Шаг 3: Извлечение сущностей с помощью Gemini NER
        # Из протокола извлекаются препараты и атрибуты (дозы, путь, режим)
        log.info("")
        log.info("ШАГ 3: Извлечение лекарственных средств (NER)")
        log.info("-" * 80)
        log.info("Отправка запроса к Gemini API для извлечения препаратов...")
        
        ner_start_time = time.time()
        extracted_entities = ner_extractor.extract_entities(protocol_text)
        ner_duration = time.time() - ner_start_time
        
        if not extracted_entities:
            log.warning("⚠ ПРЕДУПРЕЖДЕНИЕ: Модуль NER не извлек ни одной сущности. Продолжение невозможно.")
            return
        
        log.info(f"✓ Успешно извлечено {len(extracted_entities)} назначений препаратов за {ner_duration:.1f}s")
        print("PROGRESS: 20", flush=True)
        for idx, entity in enumerate(extracted_entities[:5], 1):  # Показать первые 5
            log.debug(f"  Препарат {idx}: {entity.get('drug_name', 'N/A')} | "
                     f"Дозировка: {entity.get('dosage', 'N/A')} | "
                     f"Путь: {entity.get('route', 'N/A')}")
        if len(extracted_entities) > 5:
            log.debug(f"  ... и еще {len(extracted_entities) - 5} препаратов")

        # Шаг 4: Параллельная верификация препаратов с прогресс-баром
        # Для каждого препарата собираются статусы формуляров, регуляторов,
        # результаты PubMed и клинических исследований
        log.info("")
        log.info("ШАГ 4: Верификация препаратов (параллельно)")
        log.info("-" * 80)
        log.info("Проверка препаратов в формулярах (BNF, BNF_Children, WHO_EML)...")
        log.info("Проверка одобрений регуляторов (FDA, EMA)...")
        log.info("Поиск исследований в PubMed (умный поиск с Gemini)...")
        log.info("Поиск клинических исследований (ClinicalTrials.gov)...")
        log.info("Проверка в Казахстанском реестре...")
        
        def verify_drug(drug_info):
            """Helper function for parallel verification.
            Выполняет все проверки и возвращает агрегированную запись по препарату.
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

            # Normalize INN for external international sources (FDA/EMA/BNF/WHO/PubMed/CT)
            def _ensure_english_inn(candidate_en: str, candidate_ru: str) -> str:
                text = (candidate_en or '').strip()
                # If contains Cyrillic or empty, try to translate from RU via Gemini
                if not text or any('\u0400' <= ch <= '\u04FF' for ch in text):
                    src = (candidate_ru or original_name or '').strip()
                    try:
                        if src and gemini_model:
                            prompt = f"Переведи МНН на английский (только одно слово/фраза): {src}"
                            resp = gemini_model.generate_content(prompt)
                            translated = resp.text.strip().strip('"').strip("'")
                            if translated:
                                return translated
                    except Exception:
                        pass
                return text if text else (candidate_ru or original_name or '')

            inn_for_intl = _ensure_english_inn(inn_english, inn_russian)

            # Step 1: Perform detailed formulary checks (fast)
            formulary_status = verification_engine.formulary.check_inn_presence(inn_for_intl)
            formulary_detailed = verification_engine.formulary.check_inn_detailed(inn_for_intl, dosage, route)

            # Step 2: Parallel external lookups to reduce latency
            fda_data = None
            ema_status_data = {"status": None, "comment": ""}
            pubmed_data = {"articles": [], "total_found": 0, "rct_count": 0, "meta_analysis_count": 0, "systematic_review_count": 0}
            clinical_trials_data = []
            kz_register_data = {"found": False}

            def _fda():
                return verification_engine.fda.check_approval(inn_for_intl, args.indication)
            def _ema():
                return verification_engine.ema.check_approval(inn_for_intl)
            def _pubmed():
                return verification_engine.pubmed.search_evidence(inn_for_intl, args.indication, dosage=dosage, route=route)
            def _ct():
                return verification_engine.clinical_trials.search_trials(inn_for_intl, args.indication)
            def _kz():
                return verification_engine.kz_register.search(inn_russian=inn_russian, inn_english=inn_english)

            with ThreadPoolExecutor(max_workers=5) as inner:
                futures = {
                    inner.submit(_fda): "fda",
                    inner.submit(_ema): "ema",
                    inner.submit(_pubmed): "pubmed",
                    inner.submit(_ct): "ct",
                    inner.submit(_kz): "kz",
                }
                for fut in as_completed(futures):
                    tag = futures[fut]
                    try:
                        res = fut.result()
                        if tag == "fda":
                            fda_data = res
                        elif tag == "ema":
                            ema_status_data = res
                        elif tag == "pubmed":
                            pubmed_data = res
                        elif tag == "ct":
                            clinical_trials_data = res
                        elif tag == "kz":
                            kz_register_data = res
                    except Exception:
                        # leave defaults on failure
                        pass

            # Step 6: Aggregate all data into a comprehensive record
            verification_record = {
                "original_name": original_name,
                "inn": inn_for_intl,
                "inn_russian": inn_russian,
                "dosage": dosage,
                "route": route,
                "frequency": frequency,
                "duration": duration,
                "author_ud": drug_info.get('author_ud'),
                "indication": args.indication,
                
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
            
            return verification_record
        
        # Parallel processing with progress bar and optimization
        verification_start_time = time.time()
        verified_data = []
        
        # Используем оптимизированную верификацию если доступна
        use_optimized = config and config.pubmed_rate_limit_enabled
        
        if use_optimized:
            from modules.verification_optimizer import VerificationOptimizer
            optimizer = VerificationOptimizer(verification_engine, args.indication)
            verify_function = optimizer.verify_drug_optimized
            log.info("Используется оптимизированная верификация с приоритизацией запросов")
        else:
            verify_function = verify_drug
            log.info("Используется стандартная верификация")
        
        if args.max_workers == 1:
            # Sequential processing
            log.info("Обработка препаратов последовательно...")
            for drug_info in tqdm(extracted_entities, desc="Верификация препаратов", 
                                  unit="препарат", ncols=100, leave=False, 
                                  bar_format='{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]'):
                result = verify_function(drug_info)
                if result:
                    verified_data.append(result)
        else:
            # Parallel processing with adaptive worker count
            # Учитываем что PubMed запросы контролируются rate limiter,
            # поэтому можем использовать больше воркеров для других операций
            effective_workers = args.max_workers
            
            # Если используется оптимизация, можем использовать больше воркеров
            # так как PubMed запросы будут контролироваться rate limiter
            if use_optimized:
                # Увеличиваем количество воркеров для быстрых операций
                # PubMed запросы все равно будут контролироваться rate limiter
                effective_workers = min(args.max_workers * 2, len(extracted_entities) * 2)
                log.info(f"Обработка препаратов параллельно ({effective_workers} воркеров, оптимизировано)...")
            else:
                log.info(f"Обработка препаратов параллельно ({effective_workers} воркеров)...")
            
            with ThreadPoolExecutor(max_workers=effective_workers) as executor:
                # Submit all tasks
                future_to_drug = {executor.submit(verify_function, drug): drug for drug in extracted_entities}
                total_drugs_count = len(extracted_entities)
                processed_drugs_count = 0
                
                # Process completed tasks with progress bar
                for future in tqdm(as_completed(future_to_drug), total=len(future_to_drug), 
                                  desc="Верификация (параллельно)", unit="препарат", 
                                  ncols=100, leave=False,
                                  bar_format='{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]'):
                    result = future.result()
                    processed_drugs_count += 1
                    # Calculate progress from 20% to 80%
                    progress_percent = 20 + int((processed_drugs_count / total_drugs_count) * 60)
                    print(f"PROGRESS: {progress_percent}", flush=True)
                    
                    if result:
                        verified_data.append(result)
        
        verification_duration = time.time() - verification_start_time
        log.info(f"✓ Завершена верификация {len(verified_data)} препаратов за {verification_duration:.1f}s")
        if len(verified_data) > 0:
            log.info(f"  Среднее время на препарат: {verification_duration/len(verified_data):.1f}s")

        # Шаг 5: Синтез системного уровня доказательности (GRADE)
        # Gemini сам определяет логику оценки на основе всех данных
        log.info("")
        log.info("ШАГ 5: Расчет уровня доказательности (GRADE) через Gemini")
        log.info("-" * 80)
        log.info("Gemini анализирует все данные и самостоятельно определяет логику оценки")
        log.info("В резюме указывается логика с числами исследований")
        
        grade_start_time = time.time()
        final_data = []
        
        # Gemini-based calculation for all drugs (Gemini сам определяет логику оценки)
        if gemini_model:
            log.info("Расчет GRADE через Gemini (Gemini сам определяет логику оценки)...")
            
            def analyze_with_gemini(idx_record):
                idx, record = idx_record
                drug_name = record.get('original_name', 'N/A')
                try:
                    gemini_analysis = analyze_drug_with_gemini(record, gemini_model=gemini_model)
                    # Gemini определяет уровень доказательности и логику
                    record['system_ud'] = gemini_analysis['evidence_level_grade']
                    record['evidence_level_justification'] = gemini_analysis['evidence_level_justification']
                    # В summary_recommendation Gemini указывает логику с числами исследований
                    record['summary_recommendation'] = gemini_analysis['summary_recommendation']
                    # Store additional fields from HTML demo version
                    record['completeness'] = gemini_analysis.get('completeness', '')
                    record['compliance_notes'] = gemini_analysis.get('compliance_notes', '')
                    record['evidence_commentary'] = gemini_analysis.get('evidence_commentary', {})
                    # Store full Gemini analysis for detailed reporting
                    record['gemini_analysis'] = gemini_analysis.get('gemini_analysis')
                    log.debug(f"Препарат '{drug_name}': GRADE {gemini_analysis['evidence_level_grade']} (Gemini)")
                    return True
                except Exception as e:
                    log.warning(f"Ошибка Gemini анализа для '{drug_name}': {e}, используем fallback")
                    # Fallback to rule-based if Gemini fails
                    system_ud, justification = calculate_system_ud(record)
                    record['system_ud'] = system_ud
                    record['evidence_level_justification'] = justification
                    record['summary_recommendation'] = justification
                    # Set empty values for HTML demo fields
                    record['completeness'] = ''
                    record['compliance_notes'] = ''
                    record['evidence_commentary'] = {}
                    return False
            
            # Process all drugs with Gemini (sequential to respect rate limits)
            gemini_start = time.time()
            analyzed_count = 0
            
            # Read critique flag from env (passed from Web UI)
            enable_critique = os.environ.get("ENABLE_CRITIQUE", "0") == "1"
            if enable_critique:
                log.info("ℹ️ AI-Критик (Double Check) включен.")
            
            all_drugs = [(idx, record) for idx, record in enumerate(verified_data)]
            final_data = []
            
            # Helper for thread/process pool if needed, but here we run sequentially to respect rate limits
            for idx_record in tqdm(all_drugs, desc="GRADE (Gemini)", 
                                  unit="препарат", ncols=100, leave=False,
                                  bar_format='{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]'):
                idx, record = idx_record
                
                # Analyze using Gemini
                try:
                    # Throttle requests
                    time.sleep(0.5)
                    analysis = analyze_drug_with_gemini(record, gemini_model=gemini_model, enable_critique=enable_critique)
                    record.update(analysis)
                    analyzed_count += 1
                except Exception as e:
                    log.error(f"Error analyzing {record.get('original_name')}: {e}")
                    # Fallback to rule-based
                    grade, justification = calculate_system_ud(record)
                    record['system_ud'] = grade
                    record['evidence_level_justification'] = justification
                    record['summary_recommendation'] = justification
                    
                final_data.append(record)
            
            gemini_duration = time.time() - gemini_start
            log.info(f"✓ Gemini анализ завершен для {analyzed_count}/{len(all_drugs)} препаратов за {gemini_duration:.1f}s")
            if analyzed_count < len(all_drugs):
                log.info(f"  {len(all_drugs) - analyzed_count} препаратов обработано через fallback (rule-based)")
        else:
            # Fallback: rule-based calculation if Gemini is not available
            log.info("Gemini недоступен, используется rule-based расчет...")
            for idx, record in enumerate(tqdm(verified_data, desc="GRADE (rule-based)", 
                                              unit="препарат", ncols=100, leave=False,
                                              bar_format='{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}]'), 1):
                system_ud, justification = calculate_system_ud(record)
                record['system_ud'] = system_ud
                record['evidence_level_justification'] = justification
                record['summary_recommendation'] = justification
                # Set empty values for HTML demo fields
                record['completeness'] = ''
                record['compliance_notes'] = ''
                record['evidence_commentary'] = {}
                final_data.append(record)
        
        grade_duration = time.time() - grade_start_time
        log.info(f"✓ Рассчитаны уровни доказательности для всех {len(final_data)} препаратов за {grade_duration:.1f}s")

        # Фильтрация препаратов "не рекомендуется"
        log.info("")
        log.info("Фильтрация препаратов: исключение 'не рекомендуется'...")
        log.info("-" * 80)
        
        def is_not_recommended_in_protocol(record: dict) -> bool:
            """Проверяет, указан ли препарат как 'не рекомендуется' в самом протоколе
            Проверяет только исходные данные из протокола (author_ud, original_name),
            НЕ проверяет рекомендации Gemini.
            """
            # Проверяем авторский УД (уровень доказательности) из протокола
            author_ud = str(record.get('author_ud', '')).lower().strip()
            
            # Если в авторском УД есть явные указания на нерекомендуемость
            negative_ud_patterns = [
                'не рекомендуется',
                'не рекомендован',
                'противопоказан',
                'не применять',
                'not recommended',
                'contraindicated'
            ]
            
            if author_ud and any(pattern in author_ud for pattern in negative_ud_patterns):
                return True
            
            # Проверяем оригинальное название препарата из протокола
            original_name = str(record.get('original_name', '')).lower()
            
            # Если в названии есть явные указания на нерекомендуемость
            if original_name and any(pattern in original_name for pattern in negative_ud_patterns):
                return True
            
            # НЕ проверяем рекомендации Gemini (summary_recommendation) - они могут быть неточными
            # НЕ проверяем по уровню доказательности D - это не означает "не рекомендуется"
            
            return False
        
        filtered_data = []
        excluded_count = 0
        for record in final_data:
            if not is_not_recommended_in_protocol(record):
                filtered_data.append(record)
            else:
                excluded_count += 1
                log.info(f"Исключен препарат '{record.get('original_name', 'N/A')}': указан как не рекомендуется в протоколе")
        
        if excluded_count > 0:
            log.info(f"✓ Исключено {excluded_count} препаратов, которые не рекомендуются или имеют недостаточное обоснование")
        else:
            log.info("✓ Все препараты прошли проверку")
        
        final_data = filtered_data
        log.info(f"✓ В итоговом списке: {len(final_data)} препаратов")

        # Шаг 6: Генерация резюме протокола
        # Краткое, но информативное executive summary по итогам анализа
        log.info("")
        log.info("ШАГ 6: Генерация executive summary протокола")
        log.info("-" * 80)
        log.info("Создание резюме через Gemini API...")
        
        summary_start_time = time.time()
        protocol_summary = generate_protocol_summary(final_data, gemini_model=gemini_model)
        summary_duration = time.time() - summary_start_time
        
        log.info(f"✓ Резюме протокола сгенерировано за {summary_duration:.1f}s")
        log.debug(f"Длина резюме: {len(protocol_summary)} символов")
        print("PROGRESS: 95", flush=True)

        # Шаг 7: Генерация финального Excel отчета
        # Главная таблица, лист резюме, лист исследований PubMed
        log.info("")
        log.info("ШАГ 7: Генерация финального отчета")
        log.info("-" * 80)
        
        # Формируем имя файла на основе indication, если не указано явно
        output_path = args.output
        import re
        
        # Определяем, нужно ли формировать имя из indication
        should_generate_name = False
        
        # Проверяем различные случаи
        if output_path.is_dir():
            # Если указана только директория
            should_generate_name = True
        elif not output_path.name or output_path.name == '.':
            # Если имя файла отсутствует
            should_generate_name = True
        elif output_path.stem.lower() in ['report', '']:
            # Если имя файла "report" или пустое
            should_generate_name = True
        
        if should_generate_name:
            # Формируем имя файла из indication
            # Очищаем indication от недопустимых символов для имени файла
            safe_indication = re.sub(r'[<>:"/\\|?*]', '_', args.indication)
            safe_indication = re.sub(r'\s+', '_', safe_indication)  # Заменяем пробелы на подчеркивания
            safe_indication = safe_indication.strip('_')  # Убираем подчеркивания в начале и конце
            # Если indication пустое после очистки, используем "report"
            if not safe_indication:
                safe_indication = "report"
            
            # Формируем новый путь
            if output_path.is_dir():
                # Если указана только директория, создаем файл в ней
                output_path = output_path / f"report_{safe_indication}.xlsx"
            else:
                # Если указано имя типа "report", заменяем его
                output_path = output_path.parent / f"report_{safe_indication}.xlsx"
            
            log.info(f"Имя файла сформировано из indication: {output_path.name}")
        
        # Убеждаемся, что файл имеет расширение .xlsx
        if output_path.suffix.lower() != '.xlsx':
            output_path = output_path.with_suffix('.xlsx')
            log.info(f"Исправлено расширение файла: {output_path}")
        
        # Валидация выходного пути
        from modules.validation import validate_output_path
        try:
            validate_output_path(output_path, overwrite=False)
        except ValidationError as e:
            log.warning(f"Предупреждение валидации выходного файла: {e}")
            # Продолжаем, но пользователь должен знать
        
        log.info(f"Создание Excel отчета: {output_path}")
        
        report_start_time = time.time()
        generate_excel_report(final_data, output_path, protocol_summary=protocol_summary)
        report_duration = time.time() - report_start_time
        
        log.info(f"✓ Excel отчет успешно сохранен за {report_duration:.1f}s")
        
        # Генерация Word отчета (всегда генерируем, как в предыдущей версии)
        # Компактный читабельный документ без ссылок, с количественными метриками
        log.info("")
        log.info("ШАГ 8: Генерация Word отчета")
        log.info("-" * 80)
        
        word_output = output_path.with_suffix('.docx')
        log.info(f"Создание Word отчета: {word_output}")
        
        # Проверяем наличие шаблона
        template_path = Path("data/output_example/example.docx")
        if template_path.exists():
            log.info(f"Используется шаблон: {template_path}")
        else:
            log.info("Шаблон не найден, используется стандартный формат")
            template_path = None
        
        word_start_time = time.time()
        generate_word_report(final_data, word_output, protocol_summary=protocol_summary, template_path=template_path)
        word_duration = time.time() - word_start_time
        
        log.info(f"✓ Word отчет успешно сохранен за {word_duration:.1f}s")
        print("PROGRESS: 100", flush=True)

        # Итоговая статистика
        total_duration = time.time() - start_time
        
        log.info("")
        log.info("=" * 80)
        log.info("✓ АНАЛИЗАТОР ПРОТОКОЛОВ УСПЕШНО ЗАВЕРШЕН")
        log.info("=" * 80)
        log.info(f"Обработано препаратов: {len(final_data)}")
        log.info(f"Формат входного файла: {file_ext.upper()}")
        log.info(f"Excel отчет: {output_path}")
        log.info(f"Word отчет: {word_output}")
        log.info("")
        log.info("Статистика времени выполнения:")
        log.info(f"  - NER извлечение: {ner_duration:.1f}s")
        log.info(f"  - Верификация: {verification_duration:.1f}s")
        log.info(f"  - GRADE анализ: {grade_duration:.1f}s")
        log.info(f"  - Генерация summary: {summary_duration:.1f}s")
        log.info(f"  - Генерация Excel отчета: {report_duration:.1f}s")
        log.info(f"  - Генерация Word отчета: {word_duration:.1f}s")
        log.info(f"  - ИТОГО: {total_duration:.1f}s ({total_duration/60:.1f} минут)")
        
        # Статистика rate limiter и кэша для PubMed
        pubmed_info_lines = []
        if hasattr(verification_engine.pubmed, 'rate_limiter') and verification_engine.pubmed.rate_limiter:
            pubmed_stats = verification_engine.pubmed.rate_limiter.get_stats()
            pubmed_info_lines.append(f"  - Всего запросов: {pubmed_stats['total_calls']}")
            pubmed_info_lines.append(f"  - Заблокировано запросов: {pubmed_stats['blocked_calls']}")
            pubmed_info_lines.append(f"  - Использование лимита: {pubmed_stats['utilization_percent']:.1f}%")
            if pubmed_stats['blocked_calls'] > 0:
                pubmed_info_lines.append(f"  - Rate limiting работал корректно (заблокировано {pubmed_stats['blocked_calls']} запросов)")
        
        if hasattr(verification_engine.pubmed, 'cache_manager') and verification_engine.pubmed.cache_manager:
            cache_stats = verification_engine.pubmed.cache_manager.get_stats()
            pubmed_info_lines.append("")
            pubmed_info_lines.append("Статистика кэша PubMed:")
            pubmed_info_lines.append(f"  - Всего записей в кэше: {cache_stats['total_files']}")
            pubmed_info_lines.append(f"  - Действительных записей: {cache_stats['valid_files']}")
            pubmed_info_lines.append(f"  - Истекших записей: {cache_stats['expired_files']}")
            pubmed_info_lines.append(f"  - Размер кэша: {cache_stats['total_size_mb']} MB")
        
        if pubmed_info_lines:
            log.info("")
            log.info("Статистика PubMed API:")
            for line in pubmed_info_lines:
                log.info(line)
        log.info("")
        log.info("Созданные файлы:")
        log.info(f"  - Excel отчет: {output_path}")
        log.info(f"  - Word отчет: {word_output}")
        log.info("=" * 80)

    except FileNotFoundError as e:
        log.error(f"Error: Input file not found. {e}")
    except Exception as e:
        log.error(f"An unexpected error occurred during the process: {e}", exc_info=True)


if __name__ == "__main__":
    main()

