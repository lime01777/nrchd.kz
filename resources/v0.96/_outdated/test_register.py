#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Тест загрузки казахстанского реестра"""

from modules.kazakhstan_register import KazakhstanRegister
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

print("=" * 60)
print("Тест загрузки казахстанского реестра")
print("=" * 60)

try:
    reg = KazakhstanRegister()
    
    if reg.register_df is not None:
        count = len(reg.register_df)
        print(f"\n[OK] Реестр загружен успешно!")
        print(f"  Количество записей: {count}")
        print(f"  Использован файл: {reg.REGISTER_PATH}")
        print(f"  Колонки: {list(reg.register_df.columns)[:5]}...")
    else:
        print("\n[ERROR] Реестр не загружен (register_df = None)")
        print(f"  Пробовали файл: {reg.REGISTER_PATH}")
        
except Exception as e:
    print(f"\n[ERROR] Ошибка при загрузке реестра: {e}")
    import traceback
    traceback.print_exc()

print("=" * 60)

