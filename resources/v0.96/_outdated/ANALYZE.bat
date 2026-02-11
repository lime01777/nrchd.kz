@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
cd /d %~dp0
echo ================================================================================
echo Protocol Analyzer v3.1 - Starting Analysis
echo ================================================================================
echo.

call venv\Scripts\activate.bat
python main.py -i "data\inputs\КП Перф язва 4.08 (1).docx" -o "data\outputs\report_v3.1.xlsx" --indication "Пептическая язва" --max-workers 2

echo.
echo ================================================================================
pause

