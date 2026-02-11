"""
KazakhstanRegister reader and search helper.

The register file can be malformed. We try to repair or read it with
several strategies and then perform robust substring search across
candidate columns to extract registration details.
Enhanced with Gemini for better translation and fuzzy matching.
"""

import pandas as pd
from pathlib import Path
import logging
import os
from dotenv import load_dotenv

log = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class KazakhstanRegister:
    """
    Handles searching in the Kazakhstan drug register (Register.xlsx).
    Searches by Russian INN names and returns registration details.
    Enhanced with Gemini for better translation and fuzzy matching.
    """
    REGISTER_PATH = Path("data/pdf_sources/Register.xlsx")

    def __init__(self, gemini_model=None):
        self.register_df = None
        self.gemini_model = gemini_model
        self._translation_cache = {}  # Cache for translations
        self._variations_cache = {}  # Cache for search variations
        self._load_register()

    def _load_register(self):
        """Loads the Kazakhstan register from Excel/CSV file with robust fallbacks."""
        # Build candidate paths (env override first)
        env_path = os.getenv("KZ_REGISTER_PATH")
        candidates = []
        if env_path:
            candidates.append(Path(env_path))
        # Common locations - сначала пробуем repaired файл, если он существует
        repaired_path = Path("data/pdf_sources/Register.repaired.xlsx")
        if repaired_path.exists():
            candidates.append(repaired_path)
        
        candidates.extend([
            self.REGISTER_PATH,
            Path("data/pdf_sources/register.xlsx"),
            Path("data/pdf_sources/Register.xlsx"),
            Path("data/register/Register.xlsx"),
            Path("data/register/register.xlsx"),
            Path("data/register/Register.csv"),
            Path("data/inputs/Register.xlsx"),
            Path("Register.xlsx"),
            Path("Register.csv"),
        ])

        existing = [p for p in candidates if p and p.exists()]

        # If only a directory was provided or default dir exists, scan for plausible files
        def _scan_dir(dir_path: Path):
            found = []
            try:
                for p in dir_path.glob('*.xlsx'):
                    found.append(p)
                for p in dir_path.glob('*.xls'):
                    found.append(p)
                for p in dir_path.glob('*.csv'):
                    found.append(p)
            except Exception:
                pass
            return found

        pdf_sources_dir = Path("data/pdf_sources")
        if pdf_sources_dir.exists():
            scanned = _scan_dir(pdf_sources_dir)
            # Prefer names containing 'register' or 'реестр'
            scored = []
            for p in scanned:
                name = p.name.lower()
                score = 0
                if 'register' in name or 'реестр' in name:
                    score += 2
                if p.suffix.lower() in ('.xlsx', '.xls'):
                    score += 1
                scored.append((score, p))
            scored.sort(reverse=True)
            existing.extend([p for _, p in scored])
        if not existing:
            log.warning(f"Kazakhstan register file not found. Tried: {[str(p) for p in candidates]}")
            return

        # Use the first existing candidate
        path = existing[0]
        self.REGISTER_PATH = path
        log.info(f"Загрузка Казахстанского реестра из: {path}")

        # Если используется repaired файл, пробуем его сразу
        if path.name.endswith('.repaired.xlsx'):
            try:
                df = pd.read_excel(path, sheet_name=0, header=0, dtype=str, engine='openpyxl', na_filter=False)
                if df is not None and not df.empty:
                    self.register_df = df
                    log.info(f"Казахстанский реестр загружен из исправленного файла: {len(self.register_df)} записей")
                    return
            except Exception as e:
                log.warning(f"Не удалось загрузить исправленный файл: {e}")

        # Try to repair corrupted Excel file using openpyxl repair (только если не repaired файл)
        if not path.name.endswith('.repaired.xlsx'):
            try:
                from openpyxl import load_workbook
                try:
                    # Try to load and repair
                    wb = load_workbook(self.REGISTER_PATH, data_only=True, keep_vba=False)
                    # If successful, save as repaired and try to read
                    repaired_path = self.REGISTER_PATH.with_suffix('.repaired.xlsx')
                    wb.save(repaired_path)
                    log.info(f"Файл восстановлен, сохранен как {repaired_path}")
                    # Try reading repaired file
                    df = pd.read_excel(repaired_path, sheet_name=0, header=0, dtype=str, engine='openpyxl', na_filter=False)
                    if df is not None and not df.empty:
                        self.register_df = df
                        log.info(f"Казахстанский реестр загружен из восстановленного файла: {len(self.register_df)} записей")
                        return
                except Exception as repair_error:
                    log.warning(f"Не удалось восстановить файл: {repair_error}")
            except ImportError:
                pass

        # Try multiple methods to read the original file
        # Excel readers
        try:
            # Method 1: Try reading with openpyxl and ignore corrupted cells
            try:
                df = pd.read_excel(
                    self.REGISTER_PATH, 
                    sheet_name=0,
                    header=0,
                    dtype=str,
                    engine='openpyxl',
                    na_filter=False  # Don't filter NA values
                )
                if df is not None and not df.empty and len(df) > 1:
                    self.register_df = df
                    log.info(f"Казахстанский реестр загружен: {len(self.register_df)} записей")
                    return
            except Exception as e:
                log.debug(f"Метод 1 (openpyxl) не сработал: {e}")
            
            # Method 2: Try reading without headers
            # Если заголовок в непредсказуемом месте, читаем сырые строки
            try:
                df = pd.read_excel(
                    self.REGISTER_PATH,
                    sheet_name=0,
                    header=None,
                    dtype=str,
                    engine='openpyxl',
                    na_filter=False
                )
                if df is not None and not df.empty and len(df) > 1:
                    # Try to identify header row if contains 'МНН'
                    header_idx = None
                    for i in range(min(10, len(df))):
                        row_vals = [str(v).strip() for v in df.iloc[i].tolist()]
                        if any(v.lower() == 'мнн' or 'м\u043d\u043d' in v.lower() for v in row_vals):
                            header_idx = i
                            break
                    if header_idx is not None:
                        df2 = pd.read_excel(self.REGISTER_PATH, sheet_name=0, header=header_idx, dtype=str, engine='openpyxl', na_filter=False)
                        if df2 is not None and not df2.empty:
                            self.register_df = df2
                            log.info(f"Казахстанский реестр загружен (авто-определение заголовка на строке {header_idx}): {len(self.register_df)} записей")
                            return
                    # Fallback: keep raw, use first row as header
                    df.columns = df.iloc[0]
                    df = df.drop(df.index[0])
                    self.register_df = df
                    log.info(f"Казахстанский реестр загружен (сырой режим): {len(self.register_df)} записей")
                    return
            except Exception as e:
                log.debug(f"Метод 2 (без заголовков) не сработал: {e}")

            # Method 3: CSV fallback
            try:
                if self.REGISTER_PATH.suffix.lower() == '.csv':
                    # Try semicolon first, then comma
                    try:
                        df = pd.read_csv(self.REGISTER_PATH, sep=';', dtype=str, encoding='utf-8', na_filter=False)
                    except Exception:
                        df = pd.read_csv(self.REGISTER_PATH, sep=',', dtype=str, encoding='utf-8', na_filter=False)
                    if df is not None and not df.empty:
                        self.register_df = df
                        log.info(f"Казахстанский реестр загружен из CSV: {len(self.register_df)} записей")
                        return
            except Exception as e:
                log.debug(f"CSV fallback failed: {e}")
                
        except Exception as e:
            log.error(f"Критическая ошибка при чтении казахстанского реестра: {e}")
            log.warning("⚠ ВНИМАНИЕ: Файл Register.xlsx поврежден или имеет нестандартный формат.")
            log.warning("   Проверка регистрации в Казахстане будет пропущена.")
            log.warning("   Пожалуйста, проверьте файл и при необходимости восстановите его.")
        
        self.register_df = None

    def _translate_inn_to_russian(self, inn_english: str) -> str:
        """
        Enhanced translation from English INN to Russian using Gemini if available.
        Falls back to basic dictionary if Gemini is not available.
        Uses caching to avoid repeated translations.
        """
        if not inn_english:
            return ""
        
        # Check cache first
        inn_key = inn_english.lower().strip()
        if inn_key in self._translation_cache:
            return self._translation_cache[inn_key]
        
        # First try Gemini translation for better accuracy
        if self.gemini_model:
            try:
                prompt = f"""Переведи следующее международное непатентованное название (МНН) лекарственного препарата с английского на русский язык.
                
Английское МНН: {inn_english}

Верни ТОЛЬКО русский перевод, без дополнительных объяснений. Если это уже русское название, верни его как есть.
Примеры:
- "metformin" -> "метформин"
- "omeprazole" -> "омепразол"
- "амоксициллин" -> "амоксициллин"

Перевод:"""
                
                response = self.gemini_model.generate_content(prompt)
                translated = response.text.strip()
                # Remove quotes if present
                translated = translated.strip('"').strip("'").strip()
                if translated and len(translated) > 2:
                    log.debug(f"Gemini translation: {inn_english} -> {translated}")
                    self._translation_cache[inn_key] = translated
                    return translated
            except Exception as e:
                log.debug(f"Gemini translation failed for {inn_english}: {e}, using dictionary")
        
        # Fallback to basic dictionary
        translations = {
            'metformin': 'метформин',
            'aspirin': 'аспирин',
            'ibuprofen': 'ибупрофен',
            'paracetamol': 'парацетамол',
            'acetaminophen': 'парацетамол',
            'amoxicillin': 'амоксициллин',
            'ceftriaxone': 'цефтриаксон',
            'metronidazole': 'метронидазол',
            'omeprazole': 'омепразол',
            'ranitidine': 'ранитидин',
            'heparin': 'гепарин',
            'warfarin': 'варфарин',
            'insulin': 'инсулин',
            'morphine': 'морфин',
            'fentanyl': 'фентанил',
        }
        result = translations.get(inn_english.lower(), inn_english)
        self._translation_cache[inn_key] = result
        return result
    
    def _generate_search_variations_with_gemini(self, inn_name: str) -> list:
        """
        Generate multiple search variations using Gemini for better matching.
        Returns list of search terms including variations, synonyms, and common misspellings.
        Uses caching to avoid repeated Gemini calls.
        """
        # Check cache first
        inn_key = inn_name.lower().strip()
        if inn_key in self._variations_cache:
            return self._variations_cache[inn_key]
        
        variations = [inn_name.lower().strip(), inn_name.strip()]
        
        if self.gemini_model:
            try:
                prompt = f"""Для лекарственного препарата с МНН "{inn_name}" сгенерируй список возможных вариантов написания для поиска в базе данных.
                
Включи:
1. Точное написание (как есть)
2. Варианты с разными регистрами
3. Распространенные опечатки или варианты написания
4. Если это английское название, также русский перевод

Верни ТОЛЬКО список вариантов, каждый на новой строке, без нумерации и дополнительных комментариев.
Максимум 10 вариантов.

МНН: {inn_name}
Варианты:"""
                
                response = self.gemini_model.generate_content(prompt)
                gemini_variations = [v.strip() for v in response.text.strip().split('\n') if v.strip()]
                variations.extend(gemini_variations[:10])
                log.debug(f"Generated {len(gemini_variations)} search variations via Gemini")
            except Exception as e:
                log.debug(f"Failed to generate search variations via Gemini: {e}")
        
        # Remove duplicates while preserving order
        seen = set()
        unique_variations = []
        for v in variations:
            v_lower = v.lower()
            if v_lower not in seen:
                seen.add(v_lower)
                unique_variations.append(v)
        
        result = unique_variations[:15]  # Limit to 15 variations
        self._variations_cache[inn_key] = result
        return result

    def search(self, inn_russian: str = None, inn_english: str = None) -> dict:
        """
        Searches for a drug in the Kazakhstan register.
        Enhanced search with multiple strategies and better matching.
        Args:
            inn_russian: Russian INN name (preferred)
            inn_english: English INN name (will be translated to Russian if needed)
        Returns:
            Dictionary with registration details or empty dict if not found.
        """
        if self.register_df is None:
            log.warning("Kazakhstan register DataFrame is None. Cannot search.")
            return {
                'found': False,
                'registration_status': '',
                'reregistration_status': '',
                'registration_number': '',
                'expiry_date': '',
                'atc': '',
                'dosage_forms': '',
                'manufacturer': ''
            }

        # Prepare search terms (STRICTLY RUSSIAN for Kazakhstan register)
        search_terms = []

        # Primary term: prefer Russian; if нет — переводим МНН на русский и ищем по нему
        primary_term = (inn_russian or '').strip()
        if not primary_term and inn_english:
            primary_term = self._translate_inn_to_russian(inn_english).strip()

        def _normalize_ru(s: str) -> str:
            s = (s or '').strip().lower()
            s = s.replace('ё', 'е')
            for ch in [',', ';', '.', '(', ')', '[', ']', '{', '}', '/', '\\', '–', '-', '—', ' ']:
                s = s.replace(ch, ' ')
            s = ' '.join(s.split())
            return s

        if primary_term:
            # Генерируем русские вариации только для русского запроса
            ru_variations = self._generate_search_variations_with_gemini(primary_term)
            # Удаляем потенциальные латиницу и оставляем только кириллицу/цифры/пробелы
            russian_only = []
            for v in ru_variations:
                vv = v.strip()
                if any('\u0400' <= ch <= '\u04FF' for ch in vv):
                    russian_only.append(vv)
            
            # Для составных названий (с пробелами или дефисами) добавляем поиск по частям
            # Например: "Инозин Пранобекс" -> ищем также "инозин" и "пранобекс" отдельно
            normalized_primary = _normalize_ru(primary_term)
            if ' ' in normalized_primary or '-' in normalized_primary:
                parts = normalized_primary.replace('-', ' ').split()
                # Добавляем части, если они достаточно длинные (минимум 4 символа)
                for part in parts:
                    if len(part) >= 4:
                        russian_only.append(part)
            
            # Нормализуем
            search_terms = list(dict.fromkeys([_normalize_ru(v) for v in russian_only if v]))

        if not search_terms:
            log.warning("No search terms provided for Kazakhstan register search")
            return {
                'found': False,
                'registration_status': '',
                'reregistration_status': '',
                'registration_number': '',
                'expiry_date': '',
                'atc': '',
                'dosage_forms': '',
                'manufacturer': ''
            }

        try:
            # Strategy 1: Find the specific column "МНН" (preferred)
            possible_inn_cols = []
            inn_col = None
            status_col = None
            form_col = None
            
            # Find exact column names
            for col in self.register_df.columns:
                col_str = str(col).strip()
                col_lower = col_str.lower()
                
                # Look for МНН column (exact match preferred)
                if col_str == 'МНН' or col_lower == 'мнн':
                    inn_col = col
                    possible_inn_cols.insert(0, col)  # Add as first priority
                    log.info(f"Found МНН column: '{col}'")
                
                # Look for "Вид" column (status)
                if col_str == 'Вид' or col_lower == 'вид':
                    status_col = col
                    log.info(f"Found Вид column (status): '{col}'")
                
                # Look for "Лек. форма" column (dosage form)
                if col_str == 'Лек. форма' or col_lower == 'лек. форма' or 'лек форма' in col_lower or 'лекарственная форма' in col_lower:
                    form_col = col
                    log.info(f"Found Лек. форма column: '{col}'")
                
                # Also add other potential INN columns
                if col not in possible_inn_cols:
                    if any(term in col_lower for term in ['мнг', 'мнд', 'мхн', 'мнн', 'наименование', 'препарат', 'лекарство', 'inn', 'international', 'name', 'вещество', 'актив']):
                        possible_inn_cols.append(col)
                        log.debug(f"Found potential INN column: '{col}'")

            # Strategy 2: If no specific columns found, search in all text columns
            if not possible_inn_cols:
                log.debug("No specific INN columns found, will search in first columns")
                # Try first few columns as they usually contain names
                possible_inn_cols = list(self.register_df.columns[:5]) if len(self.register_df.columns) >= 5 else list(self.register_df.columns)
            
            log.info(f"Searching Kazakhstan register with {len(search_terms)} search terms in {len(possible_inn_cols)} columns")
            log.info(f"Specific columns - МНН: {inn_col}, Вид: {status_col}, Лек. форма: {form_col}")

            # Search in all possible columns with all search terms
            matches = None
            best_match_score = 0
            best_match_row = None
            
            for col in possible_inn_cols:
                try:
                    # Convert column to string for searching
                    col_data = self.register_df[col].astype(str).fillna("")
                    col_data_norm = col_data.apply(_normalize_ru)
                    
                    for search_term in search_terms:
                        # Exact match (normalized Russian)
                        exact_mask = col_data_norm == search_term
                        if exact_mask.any():
                            # Получаем первый индекс совпадения
                            match_idx = exact_mask[exact_mask].index[0]
                            best_match_row = self.register_df.loc[match_idx]  # Получаем строку из DataFrame
                            matches = pd.Series([True], index=[match_idx])
                            best_match_score = 100
                            log.info(f"Found exact match for '{search_term}' in column '{col}' at index {match_idx}")
                            break
                        
                        # Substring match (case-insensitive)
                        if best_match_score < 100:
                            contains_mask = col_data_norm.str.contains(search_term, na=False, regex=False)
                            if contains_mask.any():
                                # Score based on how close the match is
                                for idx in contains_mask[contains_mask].index:
                                    cell_value = _normalize_ru(str(self.register_df.loc[idx, col]))
                                    if search_term in cell_value:
                                        # Prefer matches that are closer to the start
                                        position_score = 100 - (cell_value.find(search_term) * 2)
                                        if position_score > best_match_score:
                                            best_match_score = position_score
                                            best_match_row = self.register_df.loc[idx]  # Это pandas Series
                                            matches = pd.Series([True], index=[idx])
                                            log.debug(f"Found substring match for '{search_term}' in column '{col}' with score {position_score}")
                        
                        if best_match_score >= 100:
                            break
                    
                    if best_match_score >= 100:
                        break
                except Exception as e:
                    log.debug(f"Error searching in column '{col}': {e}")
                    continue

            if best_match_row is None or matches is None or matches.empty:
                log.info(f"No matches found in Kazakhstan register for search terms: {search_terms}")
                return {
                    'found': False,
                    'registration_status': '',
                    'reregistration_status': '',
                    'registration_number': '',
                    'expiry_date': '',
                    'atc': '',
                    'dosage_forms': '',
                    'manufacturer': ''
                }

            # Get the best matching row (это pandas Series)
            row = best_match_row
            log.info(f"Found match in Kazakhstan register with score {best_match_score}")
            
            # Extract data using specific column names (МНН, Вид, Лек. форма)
            result = {'found': True}
            
            # Helper function to safely get value from Series
            def _get_row_value(row, col_name):
                """Безопасное извлечение значения из pandas Series"""
                try:
                    # row это pandas Series, используем прямое обращение
                    if col_name in row:
                        value = str(row[col_name]).strip()
                        # Проверяем на пустые значения
                        if value and value.lower() not in ['nan', 'none', '', 'null', 'n/a', 'не указано', 'none', 'nan']:
                            return value
                except (KeyError, AttributeError, TypeError) as e:
                    log.debug(f"Error getting value for column '{col_name}': {e}")
                return ''
            
            # Get status from "Вид" column (registration status)
            if status_col:
                try:
                    value = _get_row_value(row, status_col)
                    if value:
                        result['registration_status'] = value
                        log.debug(f"Found registration_status in 'Вид' column: {result['registration_status']}")
                except Exception as e:
                    log.debug(f"Error extracting status from 'Вид' column: {e}")
            
            # Get dosage form from "Лек. форма" column
            if form_col:
                try:
                    value = _get_row_value(row, form_col)
                    if value:
                        result['dosage_forms'] = value
                        log.debug(f"Found dosage_forms in 'Лек. форма' column: {result['dosage_forms']}")
                except Exception as e:
                    log.debug(f"Error extracting form from 'Лек. форма' column: {e}")
            
            # Find other fields using flexible search
            col_map = {
                'reregistration_status': ['перерегистрац', 'повторн', 'продлен', 'перерегистрация', 'продление'],
                'registration_number': ['номер', 'регистрац', 'свидетельство', 'рег. номер', 'рег номер', 'номер регистрации', 'номер свидетельства'],
                'expiry_date': ['срок', 'действ', 'истечен', 'дата окончания', 'дата истечения', 'срок действия', 'срок годности', 'дата'],
                'atc': ['атх', 'atc', 'код атх', 'atc код'],
                'manufacturer': ['производитель', 'производ', 'изготовитель', 'компания', 'фирма', 'производитель/изготовитель']
            }

            # Create a comprehensive mapping of all columns
            cols_lower = {str(c).lower(): c for c in self.register_df.columns}
            
            # Search for each field (excluding those already found)
            for key, patterns in col_map.items():
                if key not in result or not result[key]:
                    result[key] = ''
                    for pattern in patterns:
                        for col_lower, col in cols_lower.items():
                            if pattern in col_lower:
                                try:
                                    value = _get_row_value(row, col)
                                    if value:
                                        result[key] = value
                                        log.debug(f"Found {key} in column '{col}': {result[key][:50]}")
                                        break
                                except Exception as e:
                                    log.debug(f"Error extracting {key} from column {col}: {e}")
                                    continue
                        if result[key]:
                            break
                
                # If still not found, try searching in all columns for this pattern
                if not result[key]:
                    for col in self.register_df.columns:
                        try:
                            col_lower = str(col).lower()
                            if any(pattern in col_lower for pattern in patterns):
                                value = _get_row_value(row, col)
                                if value:
                                    result[key] = value
                                    break
                        except:
                            continue
            
            # Initialize missing fields
            if 'registration_status' not in result:
                result['registration_status'] = ''
            if 'dosage_forms' not in result:
                result['dosage_forms'] = ''
            if 'reregistration_status' not in result:
                result['reregistration_status'] = ''
            if 'registration_number' not in result:
                result['registration_number'] = ''
            if 'expiry_date' not in result:
                result['expiry_date'] = ''
            if 'atc' not in result:
                result['atc'] = ''
            if 'manufacturer' not in result:
                result['manufacturer'] = ''

            log.info(f"Kazakhstan register search result: found={result['found']}, status={result['registration_status'][:50] if result['registration_status'] else 'N/A'}, form={result['dosage_forms'][:50] if result['dosage_forms'] else 'N/A'}")
            return result
            
        except Exception as e:
            log.error(f"Error searching Kazakhstan register for '{search_terms}': {e}", exc_info=True)
            return {
                'found': False,
                'registration_status': '',
                'reregistration_status': '',
                'registration_number': '',
                'expiry_date': '',
                'atc': '',
                'dosage_forms': '',
                'manufacturer': ''
            }

