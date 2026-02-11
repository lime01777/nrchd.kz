#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Universal protocol parser supporting DOCX, DOC, PDF and TXT formats.
Combines robust extraction (paragraphs + tables for DOCX) and
clean-up for PDFs. Used by main pipeline before NER step.
"""

import docx
import logging
from pathlib import Path
import fitz  # PyMuPDF

try:
    import textract
    TEXTRACT_AVAILABLE = True
except ImportError:
    TEXTRACT_AVAILABLE = False

# Альтернативный метод для Windows через COM (требует установленный Word)
try:
    import win32com.client
    WIN32COM_AVAILABLE = True
except ImportError:
    WIN32COM_AVAILABLE = False

log = logging.getLogger(__name__)


class UniversalProtocolParser:
    """
    Universal parser for clinical protocol files:
    - DOCX: paragraphs and tables in document order
    - DOC: via textract (optional)
    - PDF: via PyMuPDF + cleanup
    - TXT: plain read
    """

    @staticmethod
    def read_docx(file_path: Path) -> str:
        """Reads text content from a .docx file."""
        try:
            log.info(f"Reading DOCX file: {file_path}")
            doc = docx.Document(file_path)
            
            full_text = []
            # Process both paragraphs and tables in their order
            for block in doc.element.body:
                if block.tag.endswith('p'):
                    paragraph = docx.text.paragraph.Paragraph(block, doc)
                    full_text.append(paragraph.text)
                elif block.tag.endswith('tbl'):
                    table = docx.table.Table(block, doc)
                    for row in table.rows:
                        row_text = []
                        for cell in row.cells:
                            cell_text = "\n".join([p.text for p in cell.paragraphs])
                            row_text.append(cell_text)
                        full_text.append("\t".join(row_text))
            
            text = "\n".join(full_text)
            log.info(f"Successfully extracted {len(text)} characters from DOCX")
            return text
            
        except Exception as e:
            log.error(f"Failed to read DOCX file {file_path}: {e}")
            raise

    @staticmethod
    def read_pdf(file_path: Path) -> str:
        """Reads text content from a .pdf file using PyMuPDF."""
        try:
            log.info(f"Reading PDF file: {file_path}")
            text_chunks = []
            with fitz.open(file_path) as doc:
                for page in doc:
                    text_chunks.append(page.get_text("text"))
            text = "\n".join(text_chunks)
            
            # Clean up the extracted text
            text = text.replace('-\n', '')  # De-hyphenate
            import re
            text = re.sub(r'\s+', ' ', text)  # Collapse excessive whitespace
            
            log.info(f"Successfully extracted {len(text)} characters from PDF")
            return text.strip()
            
        except Exception as e:
            log.error(f"Failed to read PDF file {file_path}: {e}")
            raise

    @staticmethod
    def read_doc(file_path: Path) -> str:
        """
        Reads text content from a .doc file.
        Пробует использовать textract, если недоступен - использует win32com (Windows).
        """
        abs_path = Path(file_path).resolve()
        import os
        file_path_str = os.fspath(abs_path)
        
        # Метод 1: Попытка использовать textract
        if TEXTRACT_AVAILABLE:
            try:
                log.info(f"Reading DOC file via textract: {file_path}")
                text = textract.process(file_path_str).decode('utf-8')
                log.info(f"Successfully extracted {len(text)} characters from DOC")
                return text.strip()
            except Exception as e:
                log.warning(f"textract failed, trying alternative method: {e}")
        
        # Метод 2: Использование win32com (Windows, требует установленный Word)
        if WIN32COM_AVAILABLE:
            try:
                log.info(f"Reading DOC file via win32com: {file_path}")
                word = win32com.client.Dispatch("Word.Application")
                word.Visible = False
                try:
                    doc = word.Documents.Open(file_path_str)
                    text = doc.Content.Text
                    doc.Close()
                    word.Quit()
                    log.info(f"Successfully extracted {len(text)} characters from DOC")
                    return text.strip()
                except Exception as e:
                    try:
                        word.Quit()
                    except:
                        pass
                    raise e
            except Exception as e:
                log.warning(f"win32com failed: {e}")
        
        # Если оба метода не сработали
        error_msg = "Не удалось прочитать .doc файл. "
        if not TEXTRACT_AVAILABLE and not WIN32COM_AVAILABLE:
            error_msg += "Установите textract (pip install textract) или pywin32 (pip install pywin32) для Windows."
        else:
            error_msg += "Проверьте, что файл не поврежден и доступен для чтения."
        raise ImportError(error_msg)

    @staticmethod
    def read_txt(file_path: Path) -> str:
        """Reads text content from a .txt file."""
        try:
            log.info(f"Reading TXT file: {file_path}")
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            log.info(f"Successfully extracted {len(text)} characters from TXT")
            return text
        except Exception as e:
            log.error(f"Failed to read TXT file {file_path}: {e}")
            raise

    def parse_protocol(self, file_path: Path) -> str:
        """
        Parses a protocol file based on its extension.
        
        Args:
            file_path: Path to the protocol file (DOCX, PDF, or TXT)
            
        Returns:
            Extracted text content
            
        Raises:
            ValueError: If file format is not supported
        """
        file_ext = file_path.suffix.lower()
        
        if file_ext == '.docx':
            return self.read_docx(file_path)
        elif file_ext == '.pdf':
            return self.read_pdf(file_path)
        elif file_ext == '.txt':
            return self.read_txt(file_path)
        elif file_ext == '.doc':
            return self.read_doc(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_ext}. Supported: .docx, .doc, .pdf, .txt")


def parse_protocol_file(file_path: Path) -> str:
    """
    Convenience function to parse any supported protocol file.
    
    Args:
        file_path: Path to the protocol file
        
    Returns:
        Extracted text content
    """
    parser = UniversalProtocolParser()
    return parser.parse_protocol(file_path)


if __name__ == '__main__':
    # For testing
    logging.basicConfig(level=logging.INFO)
    # Test code here if needed
    pass

