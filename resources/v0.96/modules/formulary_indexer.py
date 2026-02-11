import sqlite3
import gdown
import fitz  # PyMuPDF
from pathlib import Path
import logging

log = logging.getLogger(__name__)

"""
FormularyIndexer builds a local searchable index from PDF sources:
- WHO EML, BNF, BNF Children
Provides presence checks and detailed matching with simple confidence.
"""

class FormularyIndexer:
    """
    Handles the preprocessing of PDF formularies (BNF, WHO EML) by downloading,
    parsing, and creating a local searchable SQLite database.
    (Fulfills requirement from TZ 3.1.4.6)
    """
    PDF_DIR = Path("data/pdf_sources")
    INDEX_DB = Path("data/index/local_formulary_index.sqlite")

    def __init__(self, pdf_sources: list[dict]):
        """
        Initializes the indexer with a list of PDF sources.
        Args:
            pdf_sources: A list of dicts, where each dict has 'name' and 'url' keys.
                         e.g., [{'name': 'BNF', 'url': 'http://...'}]
        """
        self.pdf_sources = pdf_sources
        self.PDF_DIR.mkdir(parents=True, exist_ok=True)
        self.INDEX_DB.parent.mkdir(parents=True, exist_ok=True)

    def _download_pdfs(self):
        """
        Downloads the PDF files from the specified URLs if they don't already exist.
        Uses gdown to handle Google Drive links.
        """
        log.info("Checking and downloading PDF sources...")
        for source in self.pdf_sources:
            output_path = self.PDF_DIR / f"{source['name']}.pdf"
            if not output_path.exists():
                log.info(f"Downloading {source['name']} from {source['url']}...")
                try:
                    gdown.download(source['url'], str(output_path), quiet=False, fuzzy=True)
                    log.info(f"Successfully downloaded {output_path.name}.")
                except Exception as e:
                    log.error(f"Failed to download {source['name']}. Error: {e}")
            else:
                log.info(f"{output_path.name} already exists. Skipping download.")

    def _create_index(self):
        """
        Creates the SQLite database and the 'formulary' table if they don't exist.
        Table Schema: (id, source_name, full_text)
        """
        log.info(f"Initializing SQLite index at {self.INDEX_DB}...")
        try:
            with sqlite3.connect(self.INDEX_DB) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS formulary (
                        id INTEGER PRIMARY KEY,
                        source_name TEXT NOT NULL UNIQUE,
                        full_text TEXT NOT NULL
                    )
                """)
                conn.commit()
                log.info("Database and table 'formulary' are ready.")
        except sqlite3.Error as e:
            log.error(f"Database error during index creation: {e}")
            raise

    def _parse_and_fill_index(self):
        """
        Parses each downloaded PDF to extract its full text content using PyMuPDF (fitz)
        and inserts the content into the SQLite database.
        (Ref: Analysis of PDF parsing libraries TZ 1, Analysis 4, 5)
        """
        log.info("Parsing PDFs and populating the index. This may take a while...")
        try:
            with sqlite3.connect(self.INDEX_DB) as conn:
                cursor = conn.cursor()
                for source in self.pdf_sources:
                    pdf_path = self.PDF_DIR / f"{source['name']}.pdf"
                    if not pdf_path.exists():
                        log.warning(f"PDF {pdf_path.name} not found. Cannot parse.")
                        continue

                    # Check if the source is already indexed
                    cursor.execute("SELECT id FROM formulary WHERE source_name = ?", (source['name'],))
                    if cursor.fetchone():
                        log.info(f"'{source['name']}' is already in the index. Skipping parsing.")
                        continue

                    log.info(f"Parsing {pdf_path.name}...")
                    full_text = ""
                    with fitz.open(pdf_path) as doc:
                        for page in doc:
                            full_text += page.get_text() + "\n"

                    log.info(f"Inserting text from {source['name']} into the index...")
                    cursor.execute(
                        "INSERT INTO formulary (source_name, full_text) VALUES (?, ?)",
                        (source['name'], full_text)
                    )
                conn.commit()
                log.info("Finished parsing and indexing all PDF sources.")
        except sqlite3.Error as e:
            log.error(f"Database error during index population: {e}")
            raise
        except Exception as e:
            log.error(f"An error occurred during PDF parsing: {e}")
            raise

    def check_inn_presence(self, inn: str) -> dict:
        """
        Checks for the presence of a given INN (International Nonproprietary Name)
        within the indexed formulary texts. The search is case-insensitive.
        Args:
            inn: The INN string to search for.
        Returns:
            A dictionary indicating the presence of the INN in each source document.
            e.g., {'BNF': True, 'WHO_EML': False}
        """
        presence = {source['name']: False for source in self.pdf_sources}
        if not inn or not self.INDEX_DB.exists():
            return presence

        try:
            with sqlite3.connect(self.INDEX_DB) as conn:
                cursor = conn.cursor()
                # Case-insensitive search
                cursor.execute(
                    "SELECT source_name FROM formulary WHERE LOWER(full_text) LIKE LOWER(?)",
                    (f"%{inn}%",)
                )
                results = cursor.fetchall()
                for row in results:
                    source_name = row[0]
                    if source_name in presence:
                        presence[source_name] = True
        except sqlite3.Error as e:
            log.error(f"Failed to query index for INN '{inn}'. Error: {e}")
        return presence

    def check_inn_detailed(self, inn: str, dosage: str = None, route: str = None) -> dict:
        """
        Enhanced check for INN with detailed information including confidence, snippets, and flags.
        Args:
            inn: The INN string to search for.
            dosage: Optional dosage to check for match.
            route: Optional route of administration to check for match.
        Returns:
            Dictionary with detailed matching information for each formulary source.
            Structure: {
                'BNF': {
                    'found': bool,
                    'confidence': int (0-100),
                    'search_location': str,
                    'snippet': str (200-300 chars),
                    'matches_nosology': bool,
                    'matches_dosage': bool,
                    'matches_route': bool
                },
                ...
            }
        """
        result = {source['name']: {
            'found': False,
            'confidence': 0,
            'search_location': '',
            'snippet': '',
            'matches_nosology': False,
            'matches_dosage': False,
            'matches_route': False
        } for source in self.pdf_sources}
        
        if not inn or not self.INDEX_DB.exists():
            return result

        try:
            with sqlite3.connect(self.INDEX_DB) as conn:
                cursor = conn.cursor()
                # Search for INN in each source
                for source in self.pdf_sources:
                    cursor.execute(
                        "SELECT full_text FROM formulary WHERE source_name = ?",
                        (source['name'],)
                    )
                    row = cursor.fetchone()
                    if not row:
                        continue
                    
                    full_text = row[0]
                    inn_lower = inn.lower()
                    text_lower = full_text.lower()
                    
                    if inn_lower in text_lower:
                        result[source['name']]['found'] = True
                        
                        # Find the position and extract snippet
                        pos = text_lower.find(inn_lower)
                        start = max(0, pos - 150)
                        end = min(len(full_text), pos + len(inn) + 150)
                        snippet = full_text[start:end].strip()
                        result[source['name']]['snippet'] = snippet
                        
                        # Calculate confidence (simple heuristic)
                        # If exact match: 100, if partial: 70-90
                        if f" {inn} " in f" {full_text} " or f" {inn}," in full_text or f"({inn}" in full_text:
                            result[source['name']]['confidence'] = 100
                        else:
                            result[source['name']]['confidence'] = 80
                        
                        result[source['name']]['search_location'] = f"Found in {source['name']} formulary"
                        
                        # Check for dosage match if provided
                        if dosage:
                            dosage_lower = str(dosage).lower()
                            if dosage_lower in text_lower:
                                result[source['name']]['matches_dosage'] = True
                        
                        # Check for route match if provided
                        if route:
                            route_lower = str(route).lower()
                            route_synonyms = {
                                'intravenous': ['intravenous', 'iv', 'внутривенно', 'в/в'],
                                'oral': ['oral', 'po', 'per os', 'перорально'],
                                'intramuscular': ['intramuscular', 'im', 'внутримышечно', 'в/м'],
                            }
                            for route_type, synonyms in route_synonyms.items():
                                if route_lower == route_type:
                                    if any(syn in text_lower for syn in synonyms):
                                        result[source['name']]['matches_route'] = True
                                    break
        except sqlite3.Error as e:
            log.error(f"Failed to query detailed index for INN '{inn}'. Error: {e}")
        
        return result

    def run_indexing(self):
        """
        Public method to run the entire indexing pipeline.
        It checks if the index already exists before running the process.
        """
        if self.INDEX_DB.exists():
            log.info(f"Index database {self.INDEX_DB} already exists. Indexing process is considered complete.")
            return

        log.info("Starting the one-time formulary indexing process.")
        self._download_pdfs()
        self._create_index()
        self._parse_and_fill_index()
        log.info("Formulary indexing process finished successfully.")

