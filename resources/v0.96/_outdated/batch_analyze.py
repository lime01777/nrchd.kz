#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Batch analysis script for parallel processing of multiple protocol files.
Processes all files from data/inputs directory in parallel.
"""

import subprocess
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
from tqdm import tqdm
import os

# Mapping of file names to indications
INDICATION_MAP = {
    "КП Вр кистозн трансф.docx": "Врожденная кистозная трансформация",
    "КП Кисты поджел.docx": "Кисты поджелудочной железы",
    "КП Легочная гипертензия.docx": "Легочная гипертензия",
    "КП Остр вос забол матки.docx": "Острые воспалительные заболевания матки",
    "КП Откр переломы верх и ниж.docx": "Открытые переломы верхних и нижних конечностей",
    "КП Рестриктивная кардио.docx": "Рестриктивная кардиомиопатия",
    "КП Эрозия.docx": "Эрозия",
    "КП Язвенная болезнь.docx": "Язвенная болезнь желудка и двенадцатиперстной кишки"
}

def analyze_file(file_path: Path, indication: str, output_dir: Path, max_workers: int = 2):
    """
    Analyze a single protocol file.
    
    Args:
        file_path: Path to the input file
        indication: Clinical indication for the protocol
        output_dir: Directory for output files
        max_workers: Number of workers for parallel processing
        
    Returns:
        Tuple of (success: bool, file_name: str, duration: float, error: str)
    """
    file_name = file_path.name
    output_file = output_dir / f"report_{file_path.stem}.xlsx"
    script_dir = Path(__file__).parent
    
    start_time = time.time()
    
    try:
        # Set up environment
        env = os.environ.copy()
        env['PYTHONIOENCODING'] = 'utf-8'
        
        cmd = [
            sys.executable,
            str(script_dir / "main.py"),
            "-i", str(file_path),
            "-o", str(output_file),
            "--indication", indication,
            "--max-workers", str(max_workers),
            "--word"  # Generate Word report too
        ]
        
        print(f"  [START] Начинаю анализ: {file_name}")
        
        result = subprocess.run(
            cmd,
            cwd=str(script_dir),
            capture_output=True,
            text=True,
            timeout=1800,  # 30 minutes timeout per file
            env=env,
            encoding='utf-8',
            errors='replace'
        )
        
        duration = time.time() - start_time
        
        if result.returncode == 0:
            print(f"  [OK] Завершен: {file_name} ({duration:.1f}s)")
            return (True, file_name, duration, None)
        else:
            error_msg = result.stderr[-500:] if result.stderr else result.stdout[-500:] if result.stdout else "Unknown error"
            print(f"  [ERROR] Ошибка в {file_name}: {error_msg[:100]}")
            return (False, file_name, duration, error_msg)
            
    except subprocess.TimeoutExpired:
        duration = time.time() - start_time
        print(f"  [TIMEOUT] Превышено время ожидания для {file_name}")
        return (False, file_name, duration, "Timeout (30 minutes)")
    except Exception as e:
        duration = time.time() - start_time
        error_msg = str(e)
        print(f"  [EXCEPTION] Исключение при обработке {file_name}: {error_msg}")
        return (False, file_name, duration, error_msg)

def main():
    """Main function to run batch analysis."""
    script_dir = Path(__file__).parent
    inputs_dir = script_dir / "data" / "inputs"
    outputs_dir = script_dir / "data" / "outputs"
    
    # Ensure output directory exists
    outputs_dir.mkdir(parents=True, exist_ok=True)
    
    # Find all DOCX files in inputs directory
    input_files = list(inputs_dir.glob("*.docx"))
    
    if not input_files:
        print("ERROR: No DOCX files found in data/inputs directory")
        return 1
    
    print("=" * 80)
    print("ЗАПУСК ПАРАЛЛЕЛЬНОГО АНАЛИЗА ПРОТОКОЛОВ")
    print("=" * 80)
    print(f"Найдено файлов для анализа: {len(input_files)}")
    print(f"Входная папка: {inputs_dir}")
    print(f"Выходная папка: {outputs_dir}")
    print(f"Параллельных процессов: {min(4, len(input_files))}")
    print("=" * 80)
    print()
    
    # Prepare tasks
    tasks = []
    for file_path in input_files:
        indication = INDICATION_MAP.get(file_path.name, file_path.stem)
        tasks.append((file_path, indication))
    
    # Run analysis in parallel using threads (more reliable than processes)
    start_time = time.time()
    results = []
    
    # Use ThreadPoolExecutor for parallel processing (simpler and more reliable)
    max_parallel = min(3, len(input_files))  # Limit to 3 parallel threads to avoid overload
    
    print(f"Запуск анализа {len(tasks)} файлов в {max_parallel} потоках...")
    print()
    
    with ThreadPoolExecutor(max_workers=max_parallel) as executor:
        # Submit all tasks
        future_to_task = {
            executor.submit(analyze_file, file_path, indication, outputs_dir, max_workers=2): (file_path.name, indication)
            for file_path, indication in tasks
        }
        
        # Process completed tasks with progress bar
        print("Прогресс обработки:")
        with tqdm(total=len(tasks), desc="Анализ", unit="файл", ncols=100, position=0, leave=True) as pbar:
            for future in as_completed(future_to_task):
                file_name, indication = future_to_task[future]
                try:
                    result = future.result(timeout=2000)  # Increased timeout for result retrieval
                    results.append(result)
                    if result[0]:
                        pbar.set_postfix_str(f"OK: {file_name[:25]}")
                    else:
                        pbar.set_postfix_str(f"ERROR: {file_name[:25]}")
                except Exception as e:
                    error_msg = str(e)
                    results.append((False, file_name, 0, error_msg))
                    print(f"  [EXCEPTION] Ошибка получения результата для {file_name}: {error_msg}")
                    pbar.set_postfix_str(f"ERROR: {file_name[:25]}")
                finally:
                    pbar.update(1)
    
    total_duration = time.time() - start_time
    
    # Print summary
    print()
    print("=" * 80)
    print("ИТОГОВЫЙ ОТЧЕТ")
    print("=" * 80)
    
    successful = [r for r in results if r[0]]
    failed = [r for r in results if not r[0]]
    
    print(f"[OK] Успешно обработано: {len(successful)}/{len(results)}")
    print(f"[ERROR] Ошибок: {len(failed)}")
    print(f"Общее время: {total_duration:.1f}s ({total_duration/60:.1f} минут)")
    print()
    
    if successful:
        print("[OK] Успешно обработанные файлы:")
        for success, file_name, duration, _ in successful:
            print(f"   - {file_name} ({duration:.1f}s)")
        print()
    
    if failed:
        print("[ERROR] Файлы с ошибками:")
        for success, file_name, duration, error in failed:
            print(f"   - {file_name} ({duration:.1f}s)")
            if error:
                print(f"     Ошибка: {error[:100]}")
        print()
    
    print("=" * 80)
    print(f"Все отчеты сохранены в: {outputs_dir}")
    print("=" * 80)
    
    return 0 if len(failed) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())

