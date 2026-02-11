import logging
import json
import time

log = logging.getLogger(__name__)

def calculate_system_ud(verification_record: dict) -> tuple[str, str]:
    """
    Calculates the System Level of Evidence (GRADE) based on enhanced rules.

    Uses simplified GRADE system with 4 levels: A, B, C, D

    Args:
        verification_record: A dictionary containing the full verification
                             results for a single drug.

    Returns:
        Tuple of (grade_level, justification) where:
        - grade_level: String like "A", "B", "C", "D"
        - justification: Brief explanation of the grade assignment.
    """
    if not isinstance(verification_record, dict):
        log.warning("Invalid verification_record provided. Returning lowest evidence grade.")
        return ("D", "Недостаточно данных для оценки.")

    pubmed_data = verification_record.get('evidence_pubmed', {})
    fda_data = verification_record.get('approval_fda', {})
    formulary_detailed = verification_record.get('formulary_detailed', {})
    is_in_bnf = verification_record.get('formulary_bnf', False)
    is_in_bnfc = verification_record.get('formulary_bnfc', False)
    is_in_who = verification_record.get('formulary_who_eml', False)
    is_approved_fda = fda_data.get('approved', False) if isinstance(fda_data, dict) else fda_data
    
    # Extract counts with fallback
    meta_count = pubmed_data.get('meta_analysis_count', 0) if isinstance(pubmed_data, dict) else 0
    systematic_count = pubmed_data.get('systematic_review_count', 0) if isinstance(pubmed_data, dict) else 0
    rct_count = pubmed_data.get('rct_count', 0) if isinstance(pubmed_data, dict) else 0
    articles = pubmed_data.get('articles', []) if isinstance(pubmed_data, dict) else []
    total_articles = pubmed_data.get('total_found', 0) if isinstance(pubmed_data, dict) else len(articles) if articles else 0
    pubmed_error = pubmed_data.get('error', False) if isinstance(pubmed_data, dict) else False
    
    # Если total_found не указан, но есть articles, используем количество articles
    if total_articles == 0 and articles:
        total_articles = len(articles)
    
    # Check formulary confidence
    bnf_conf = 0
    if formulary_detailed:
        bnf_info = formulary_detailed.get('BNF', {})
        bnf_conf = bnf_info.get('confidence', 0) if isinstance(bnf_info, dict) else 0

    log.debug(f"Calculating GRADE for '{verification_record.get('original_name')}': "
              f"Meta={meta_count}, Systematic={systematic_count}, RCT={rct_count}, "
              f"Articles={total_articles}, FDA={is_approved_fda}, BNF={is_in_bnf}, BNF_conf={bnf_conf}")

    # GRADE Logic - Simplified to 4 levels (A, B, C, D)
    
    # Level A: High-quality meta-analyses or systematic reviews
    if meta_count >= 1 or systematic_count >= 1:
        grade = "A"
        if (meta_count + systematic_count) >= 2:
            justification = f"Найдено {meta_count} мета-анализ(ов) и {systematic_count} систематических обзоров. Высокое качество доказательств с множественными высококачественными исследованиями."
        else:
            justification = f"Найден мета-анализ или систематический обзор ({meta_count + systematic_count}). Высокое качество доказательств."
    
    # Level B: RCTs or strong observational studies
    elif rct_count >= 1 or total_articles >= 3:
        grade = "B"
        if rct_count >= 1:
            justification = f"Найдено {rct_count} рандомизированных контролируемых исследования(ий) и {total_articles} исследований. Умеренное качество доказательств."
        else:
            justification = f"Найдено {total_articles} исследований. Умеренное качество доказательств."
    
    # Level C: Regulatory approval or formulary listing with limited evidence, OR some articles found (1-2)
    elif is_approved_fda or is_in_bnf or is_in_bnfc or is_in_who or total_articles >= 1:
        grade = "C"
        if total_articles >= 1:
            if is_approved_fda or is_in_bnf or is_in_who:
                justification = f"Найдено {total_articles} исследований. Препарат одобрен регуляторами или включен в формуляры. Ограниченные клинические исследования для данной индикации."
            else:
                justification = f"Найдено {total_articles} исследований. Умеренное качество доказательств, но недостаточно для более высокого уровня."
        elif is_approved_fda and (is_in_bnf or is_in_who):
            justification = "Препарат одобрен FDA и включен в формуляры (BNF/WHO EML). Ограниченные клинические исследования для данной индикации."
        else:
            justification = "Препарат одобрен регуляторами или включен в формуляры, но недостаточно прямых клинических исследований для данной индикации."
    
    # Level D: Insufficient evidence
    else:
        # If PubMed had an error, avoid penalizing to D; set to C-leaning justification
        if pubmed_error:
            grade = "C"
            justification = "Поиск PubMed завершился с ошибками, прямых исследований не подтверждено. Оценка основана на косвенных данных/регуляторном статусе; требуется ручная проверка."
        else:
            grade = "D"
            justification = "Недостаточно данных: нет рандомизированных исследований, мета-анализов или систематических обзоров, а также нет четкого одобрения регуляторами для данной индикации."
    
    return (grade, justification)


def generate_protocol_summary(verified_data: list[dict], gemini_model=None) -> str:
    """
    Generates an executive summary of the protocol analysis using Gemini.
    
    Args:
        verified_data: List of verification records for all drugs.
        gemini_model: Optional Gemini model for summary generation.
    
    Returns:
        Markdown-formatted summary string.
    """
    # Aggregate research counts across all drugs
    total_articles_sum = 0
    total_meta_sum = 0
    total_sysrev_sum = 0
    total_rct_sum = 0
    for r in verified_data:
        pm = r.get('evidence_pubmed', {}) if isinstance(r, dict) else {}
        total_articles_sum += pm.get('total_found', 0) if isinstance(pm, dict) else 0
        total_meta_sum += pm.get('meta_analysis_count', 0) if isinstance(pm, dict) else 0
        total_sysrev_sum += pm.get('systematic_review_count', 0) if isinstance(pm, dict) else 0
        total_rct_sum += pm.get('rct_count', 0) if isinstance(pm, dict) else 0

    if not gemini_model:
        # Fallback summary
        total_drugs = len(verified_data)
        grades = [r.get('system_ud', 'D') for r in verified_data]
        a_count = sum(1 for g in grades if isinstance(g, tuple) and g[0].startswith('A'))
        b_count = sum(1 for g in grades if isinstance(g, tuple) and g[0].startswith('B'))
        c_count = sum(1 for g in grades if isinstance(g, tuple) and g[0].startswith('C'))
        d_count = sum(1 for g in grades if isinstance(g, tuple) and g[0] == 'D')
        
        return f"""# Executive Summary протокола

- **Всего препаратов проанализировано:** {total_drugs}
- **Уровень доказательности A:** {a_count}
- **Уровень доказательности B:** {b_count}
- **Уровень доказательности C:** {c_count}
- **Уровень доказательности D:** {d_count}

- **Всего найдено исследований (суммарно по всем ЛС):** {total_articles_sum}
- **Мета-анализы:** {total_meta_sum} | **Систематические обзоры:** {total_sysrev_sum} | **РКИ:** {total_rct_sum}

## Сильные стороны
- Протокол включает препараты с различными уровнями доказательности

## Области улучшения
- Рекомендуется проверить препараты с уровнем D на предмет наличия дополнительных исследований

## Риски
- Необходима дополнительная проверка препаратов с низким уровнем доказательности
"""
    
    # Prepare summary statistics
    total_drugs = len(verified_data)
    grades = {}
    formulary_coverage = {'BNF': 0, 'WHO_EML': 0, 'BNF_Children': 0}
    fda_approved = 0
    
    for record in verified_data:
        grade = record.get('system_ud', 'D')
        if isinstance(grade, tuple):
            grade_level = grade[0]
        else:
            grade_level = str(grade).split()[0] if grade else 'D'
        
        grades[grade_level] = grades.get(grade_level, 0) + 1
        
        if record.get('formulary_bnf'):
            formulary_coverage['BNF'] += 1
        if record.get('formulary_who_eml'):
            formulary_coverage['WHO_EML'] += 1
        if record.get('formulary_bnfc'):
            formulary_coverage['BNF_Children'] += 1
        
        fda_data = record.get('approval_fda', {})
        if isinstance(fda_data, dict):
            if fda_data.get('approved'):
                fda_approved += 1
        elif fda_data:
            fda_approved += 1
    
    # Collect detailed drug information for summary (optimized for token usage)
    drug_summaries = []
    for record in verified_data:
        drug_summaries.append({
            'name': record.get('original_name', 'N/A'),
            'grade': str(record.get('system_ud', 'D')).split()[0],
            'rct': record.get('evidence_pubmed', {}).get('rct_count', 0) if isinstance(record.get('evidence_pubmed'), dict) else 0,
            'fda': record.get('approval_fda', {}).get('approved', False) if isinstance(record.get('approval_fda'), dict) else False,
        })
    
    # Limit to top 50 drugs to prevent token overflow if protocol is huge
    if len(drug_summaries) > 50:
        drug_summaries = drug_summaries[:50]
        log.warning("Protocol summary prompt truncated to first 50 drugs to avoid token limit.")

    prompt = f"""
Создай развернутое и детальное executive summary клинического протокола. Анализ должен быть подробным, как в профессиональном медицинском отчете.

Статистика анализа:
- Всего препаратов: {total_drugs}
- Распределение по уровням доказательности (GRADE): {grades}
- FDA одобрено: {fda_approved}
- BNF: {formulary_coverage['BNF']}
- WHO EML: {formulary_coverage['WHO_EML']}

Список препаратов (первые 50):
{json.dumps(drug_summaries, ensure_ascii=False)}

Создай развернутое резюме в формате Markdown.
Структура:
1. 📊 Общая характеристика (качество доказательной базы, сбалансированность).
2. ✅ Сильные стороны (конкретные плюсы).
3. ⚠️ Слабые места (препараты Grade D, риски).
4. 🔍 Рекомендации (что улучшить).
5. 📈 Заключение.

Minimum 400 words. Use professional medical language.

IMPORTANT:
- Write in a dry, professional medical style.
- NEVER use phrases like "as an AI", "I am a language model", etc.
- You are a professional medical auditor.
- WRITE ALL CONTENT IN RUSSIAN LANGUAGE.
"""
    import google.generativeai as genai
    
    max_retries = 3
    retry_delay = 5
    
    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
        }
    ]

    for attempt in range(max_retries + 1):
        try:
            response = gemini_model.generate_content(prompt, safety_settings=safety_settings)
            return response.text
        except Exception as e:
            if attempt < max_retries:
                time.sleep(retry_delay)
                retry_delay *= 2
                continue
            log.error(f"Error generating protocol summary: {e}")
            return f"Не удалось сгенерировать резюме протокола (Error: {e}). Пожалуйста, обратитесь к детальному отчету по каждому препарату."


def _run_initial_analysis(verification_record: dict, gemini_model=None) -> dict:
    """
    Internal: Analyzes a drug using Gemini API with advanced quality checks (Dosage, Contraindications).
    """
    grade_rule, justification_rule = calculate_system_ud(verification_record)
    
    # Prepare data for Gemini
    drug_name = verification_record.get('original_name', 'N/A')
    inn_english = verification_record.get('inn', 'N/A')
    inn_russian = verification_record.get('inn_russian', '')
    dosage = verification_record.get('dosage', 'N/A')
    route = verification_record.get('route', 'N/A')
    frequency = verification_record.get('frequency', 'N/A')
    duration = verification_record.get('duration', 'N/A')
    indication = verification_record.get('indication', '')
    context = verification_record.get('context', 'Не указан')
    
    # Research data
    pubmed_data = verification_record.get('evidence_pubmed', {})
    articles = pubmed_data.get('articles', []) if isinstance(pubmed_data, dict) else []
    clinical_trials = verification_record.get('clinical_trials', [])
    fda_data = verification_record.get('approval_fda', {})
    
    # Statistics
    meta_count = pubmed_data.get('meta_analysis_count', 0) if isinstance(pubmed_data, dict) else 0
    systematic_count = pubmed_data.get('systematic_review_count', 0) if isinstance(pubmed_data, dict) else 0
    rct_count = pubmed_data.get('rct_count', 0) if isinstance(pubmed_data, dict) else 0
    total_articles = pubmed_data.get('total_found', 0) if isinstance(pubmed_data, dict) else len(articles) if articles else 0
    
    is_fda_approved = fda_data.get('approved', False) if isinstance(fda_data, dict) else fda_data
    is_in_bnf = verification_record.get('formulary_bnf', False)
    is_in_who = verification_record.get('formulary_who_eml', False)
    
    analysis_prompt = f"""Ты - строгий эксперт по доказательной медицине. Проведи глубокий анализ назначения.

ВВОДНЫЕ ДАННЫЕ:
- Препарат: {drug_name} ({inn_english})
- Показание: {indication}
- Дозировка в протоколе: {dosage} {frequency} {duration}
- Путь введения: {route}
- КОНТЕКСТ ИЗ ПРОТОКОЛА: "{context}"

ДОКАЗАТЕЛЬНАЯ БАЗА:
- PubMed: {total_articles} статей (MA: {meta_count}, RCT: {rct_count})
- FDA статус: {'Одобрен' if is_fda_approved else 'Нет'}
- Входит в BNF: {'Да' if is_in_bnf else 'Нет'}
- Входит в WHO EML: {'Да' if is_in_who else 'Нет'}

ПРЕДВАРИТЕЛЬНАЯ ОЦЕНКА (RULE-BASED SYSTEM):
- Grade: {grade_rule}
- Обоснование: {justification_rule}
ВАЖНО: Если препарат есть в BNF/WHO EML или одобрен FDA - это минимум уровень C, даже если статей найдено мало (так как есть регуляторное одобрение).

СТАТЬИ:
{json.dumps(articles[:5], ensure_ascii=False, indent=2)}

ЗАДАЧА (JSON):
1. **Dosage Verification**: Проверь, соответствует ли дозировка "{dosage}" официальным рекомендациям для "{indication}". Если доза странная (слишком высокая/низкая), напиши warning.
2. **Contraindications**: Есть ли АБСОЛЮТНЫЕ противопоказания для этого препарата применительно к контексту или показанию?
3. **Context Analysis**: Проверь контекст. Если протокол НЕ рекомендует препарат, Grade должен быть понижен.
4. **GRADE**: Оцени уровень доказательности (A/B/C/D). Используй предварительную оценку как ориентир. Не занижай Grade ниже C, если есть статус FDA/BNF/WHO, за исключением случаев явных противоречий или отзыва регистрации.
5. **Recommendation**: Итоговая рекомендация.

IMPORTANT:
- Return ONLY JSON.
- In text fields write professionally.
- DO NOT use phrases like "as an AI", "I am a model". You are a medical expert.
- WRITE ALL TEXT FIELDS IN RUSSIAN LANGUAGE.

Верни JSON.
"""

    analysis_schema = {
        "type": "object",
        "properties": {
            "completeness": {"type": "string"},
            "complianceNotes": {"type": "string"},
            "evidenceBasedCommentary": {
                "type": "object",
                "properties": {
                    "assessment": {"type": "string"},
                    "generalNotes": {"type": "string"},
                    "evidenceSearchGuidanceText": {"type": "string"},
                    "researchSummary": {"type": "string"},
                    "evidenceQuality": {"type": "string"}
                },
                "required": ["assessment", "evidenceSearchGuidanceText", "researchSummary", "evidenceQuality"]
            },
            "summaryRecommendation": {"type": "string"},
            "evidenceLevelGRADE": {"type": "string"},
            "evidenceLevelJustification": {"type": "string"},
            "clinicalSignificance": {"type": "string"},
            "dosageVerification": {"type": "string", "description": "Verification of dosage against guidelines. Warn if abnormal."},
            "contraindications": {"type": "string", "description": "Any absolute contraindications found."}
        },
        "required": ["completeness", "complianceNotes", "evidenceBasedCommentary", "summaryRecommendation", "evidenceLevelGRADE", "evidenceLevelJustification", "clinicalSignificance", "dosageVerification", "contraindications"]
    }

    try:
        # Disk cache logic...
        import os, hashlib
        cache_dir = os.path.join('data', 'cache', 'gemini')
        os.makedirs(cache_dir, exist_ok=True)
        # Add rule grade to cache key to invalidate old bad caches
        cache_key_payload = json.dumps({
            'inn': inn_english,
            'indication': indication,
            'dosage': dosage,
            'context': context,
            'rule_grade': grade_rule 
        }, ensure_ascii=False, sort_keys=True)
        cache_key = hashlib.sha256(cache_key_payload.encode('utf-8')).hexdigest()
        cache_file = os.path.join(cache_dir, f'{cache_key}.json')

        if os.path.exists(cache_file):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass

        import google.generativeai as genai
        generation_config = genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=analysis_schema
        )
        
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
        ]
        
        response = gemini_model.generate_content(
            analysis_prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        analysis_result = json.loads(response.text)
        
        # Enforce Minimum C rule post-processing if needed
        gemini_grade = analysis_result.get('evidenceLevelGRADE', 'D').split()[0]
        if grade_rule in ['A', 'B', 'C'] and gemini_grade == 'D':
             # Only override if the rule reason was regulatory and Gemini missed it
             if is_fda_approved or is_in_bnf or is_in_who:
                 log.info(f"Correcting Gemini Grade D -> {grade_rule} based on formulary rules.")
                 analysis_result['evidenceLevelGRADE'] = grade_rule
                 # Append note to justification
                 analysis_result['evidenceLevelJustification'] += f" (Скорректировано до {grade_rule} на основании регуляторного статуса)."

        # Save to cache
        try:
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump(analysis_result, f, ensure_ascii=False, indent=2)
        except:
            pass
            
        return {
            'summary_recommendation': analysis_result.get('summaryRecommendation', ''),
            'evidence_level_grade': analysis_result.get('evidenceLevelGRADE', 'D'),
            'evidence_level_justification': analysis_result.get('evidenceLevelJustification', ''),
            'completeness': analysis_result.get('completeness', ''),
            'compliance_notes': analysis_result.get('complianceNotes', ''),
            'evidence_commentary': analysis_result.get('evidenceBasedCommentary', {}),
            'dosage_verification': analysis_result.get('dosageVerification', 'Не проверено'),
            'contraindications': analysis_result.get('contraindications', 'Не найдено'),
            'gemini_analysis': analysis_result
        }
        
    except Exception as e:
        log.error(f"Error in Gemini analysis: {e}")
        return None


def _critique_analysis(initial_result: dict, verification_record: dict, gemini_model) -> dict:
    """
    Second pass: Critique and improve the initial analysis.
    """
    drug_name = verification_record.get('original_name', 'N/A')
    indication = verification_record.get('indication', '')
    
    critique_prompt = f"""Ты - старший аудитор медицинских отчетов. Твоя задача - проверить работу младшего аналитика и исправить ошибки.

ЗАДАЧА:
Проверь анализ препарата "{drug_name}" (показание: {indication}).

ИСХОДНЫЕ ДАННЫЕ (ЧТО БЫЛО В ПРОТОКОЛЕ):
- Дозировка: {verification_record.get('dosage')}
- Контекст: "{verification_record.get('context')}"

АНАЛИЗ МЛАДШЕГО АНАЛИТИКА (JSON):
{json.dumps(initial_result, ensure_ascii=False, indent=2)}

ТВОИ ДЕЙСТВИЯ:
1. Проверь на "галлюцинации": не выдуманы ли факты?
2. Проверь строгость: если доказательств мало, а Grade A - ПОНИЗЬ Grade.
3. Проверь контекст: если в контексте "не рекомендуется", а в анализе "рекомендуется" - ИСПРАВЬ.
4. Добавь поле "critique_notes" с описанием того, что ты исправил (или "Ошибок нет").

ВАЖНО:
- Возвращай ИСПРАВЛЕННЫЙ JSON (та же структура).
- Твой тон: строгий, профессиональный, как у главврача.
- НИКАКИХ упоминаний "я искусственный интеллект".

Верни ИСПРАВЛЕННЫЙ JSON.
"""
    
    try:
        # Disk cache for critique
        import os, hashlib
        cache_dir = os.path.join('data', 'cache', 'gemini_critique')
        os.makedirs(cache_dir, exist_ok=True)
        # simplistic cache key
        cache_key_str = json.dumps(initial_result, sort_keys=True) + "critique_v2"
        cache_key = hashlib.sha256(cache_key_str.encode('utf-8')).hexdigest()
        cache_file = os.path.join(cache_dir, f'{cache_key}.json')
        
        if os.path.exists(cache_file):
            with open(cache_file, 'r', encoding='utf-8') as f:
                return json.load(f)

        response = gemini_model.generate_content(critique_prompt, safety_settings=[
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
        ])
        
        # Cleanup json markdown
        cleaned_text = re.sub(r'^```(json)?\s*|\s*```$', '', response.text, flags=re.MULTILINE).strip()
        critique_result = json.loads(cleaned_text)
        
        # Save
        with open(cache_file, 'w', encoding='utf-8') as f:
            json.dump(critique_result, f, ensure_ascii=False, indent=2)
            
        return critique_result
        
    except Exception as e:
        log.error(f"Critique failed: {e}")
        return initial_result # Fallback to initial


def analyze_drug_with_gemini(verification_record: dict, gemini_model=None, enable_critique=True) -> dict:
    """
    Analyzes a drug using Gemini API with optional AI Critique (Double-Check).
    """
    if not gemini_model:
        grade, justification = calculate_system_ud(verification_record)
        return {
            'summary_recommendation': justification,
            'evidence_level_grade': grade,
            'evidence_level_justification': justification,
            'gemini_analysis': None
        }

    # 1. Initial Analysis
    analysis_result = _run_initial_analysis(verification_record, gemini_model)
    
    if not analysis_result:
        # Fallback if initial failed
        grade, justification = calculate_system_ud(verification_record)
        return {
            'summary_recommendation': justification,
            'evidence_level_grade': grade,
            'evidence_level_justification': justification,
            'gemini_analysis': None
        }

    # 2. AI Critique (if enabled)
    critique_notes = ""
    if enable_critique:
        log.info(f"Running AI Critique for {verification_record.get('original_name')}...")
        critique_result = _critique_analysis(analysis_result['gemini_analysis'], verification_record, gemini_model)
        if critique_result:
            # Map critique result back to flat structure
            analysis_result = {
                'summary_recommendation': critique_result.get('summaryRecommendation', ''),
                'evidence_level_grade': critique_result.get('evidenceLevelGRADE', 'D'),
                'evidence_level_justification': critique_result.get('evidenceLevelJustification', ''),
                'completeness': critique_result.get('completeness', ''),
                'compliance_notes': critique_result.get('complianceNotes', ''),
                'evidence_commentary': critique_result.get('evidenceBasedCommentary', {}),
                'dosage_verification': critique_result.get('dosageVerification', 'Не проверено'),
                'contraindications': critique_result.get('contraindications', 'Не найдено'),
                'gemini_analysis': critique_result
            }
            critique_notes = critique_result.get('critique_notes', '')

    analysis_result['critique_notes'] = critique_notes
    return analysis_result

