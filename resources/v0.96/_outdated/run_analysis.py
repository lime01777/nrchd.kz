#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Run analysis from Python directly"""

import subprocess
import sys
from pathlib import Path

def main():
    script_dir = Path(__file__).parent
    input_file = script_dir / "data" / "inputs" / "КП Перф язва 4.08 (1).docx"
    output_file = script_dir / "data" / "outputs" / "report_v3.1.xlsx"
    indication = "Пептическая язва"
    
    if not input_file.exists():
        print(f"Error: Input file not found: {input_file}")
        sys.exit(1)
    
    cmd = [
        sys.executable,
        "main.py",
        "-i", str(input_file),
        "-o", str(output_file),
        "--indication", indication,
        "--max-workers", "2"
    ]
    
    print("=" * 80)
    print("Starting Protocol Analyzer v3.1")
    print("=" * 80)
    print(f"Input: {input_file.name}")
    print(f"Output: {output_file}")
    print(f"Indication: {indication}")
    print("=" * 80)
    print()
    
    try:
        result = subprocess.run(
            cmd,
            cwd=str(script_dir),
            capture_output=False,
            text=True
        )
        return result.returncode
    except Exception as e:
        print(f"Error running analysis: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())

