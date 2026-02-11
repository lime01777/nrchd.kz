#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Direct analysis script"""

import subprocess
import sys
from pathlib import Path

def main():
    script_dir = Path(__file__).parent
    
    # Use the specified file
    input_file = script_dir / "data" / "inputs" / "КП Хр вос забол матки.doc"
    output_file = script_dir / "data" / "outputs" / "report_v3.1.xlsx"
    indication = "Хронические воспалительные заболевания матки"
    
    if not input_file.exists():
        print(f"Input file not found: {input_file}")
        sys.exit(1)
    
    # Create output directory
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    cmd = [
        sys.executable,
        "main.py",
        "-i", str(input_file),
        "-o", str(output_file),
        "--indication", indication,
        "--max-workers", "2"
    ]
    
    print(f"Running analysis on: {input_file.name}")
    print(f"Output will be: {output_file}")
    
    result = subprocess.run(cmd, cwd=str(script_dir))
    return result.returncode

if __name__ == "__main__":
    sys.exit(main())

