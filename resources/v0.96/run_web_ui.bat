@echo off
cd /d "%~dp0"
echo Starting Protocol Analyzer Web UI...
python -m streamlit run web_ui.py
pause
