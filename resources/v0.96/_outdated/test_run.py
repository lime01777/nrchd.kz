#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Simple test script to verify installation"""

import sys
from pathlib import Path

print("=" * 80)
print("Protocol Analyzer v3.1 - Test Run")
print("=" * 80)

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    print("\n[1/5] Testing imports...")
    from modules import protocol_parser
    from modules import nlp_extractor
    from modules import api_clients
    from modules import verification_engine
    from modules import formulary_indexer
    from modules import kazakhstan_register
    from modules import evidence_synthesizer
    from modules import report_generator
    print("[OK] All modules imported successfully")
    
    print("\n[2/5] Testing data files...")
    inputs_dir = Path("data/inputs")
    pdf_dir = Path("data/pdf_sources")
    
    files = list(inputs_dir.glob("*.docx"))
    print(f"[OK] Found {len(files)} DOCX files in inputs")
    
    pdfs = list(pdf_dir.glob("*.pdf"))
    print(f"[OK] Found {len(pdfs)} PDF files in sources")
    
    xlsx = list(pdf_dir.glob("*.xlsx"))
    print(f"[OK] Found {len(xlsx)} Excel files")
    
    print("\n[3/5] Testing .env file...")
    env_file = Path(".env")
    if env_file.exists():
        print("[OK] .env file found")
    else:
        print("[WARNING] .env file not found - please copy from protocol_v2")
    
    print("\n[4/5] Installation status:")
    import pandas
    import docx
    import google.generativeai
    import tqdm
    print("[OK] All dependencies installed")
    
    print("\n" + "=" * 80)
    print("[SUCCESS] ALL CHECKS PASSED!")
    print("=" * 80)
    print("\nSystem is ready to use!")
    print("Run: python main.py -i data/inputs/protocol.docx -o report.xlsx --indication 'Indication'")
    print("=" * 80)
    
except ImportError as e:
    print(f"[ERROR] Import error: {e}")
    print("Please install dependencies: pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"[ERROR] Error: {e}")
    sys.exit(1)

