@echo off
REM Protocol Analyzer v3.1 - Installation Script

echo ========================================================================
echo Protocol Analyzer v3.1 - Installation
echo ========================================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.10+
    pause
    exit /b 1
)

echo [1/3] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo [2/3] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/3] Installing dependencies (this may take a few minutes)...
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================================================
echo Installation Complete!
echo ========================================================================
echo.
echo Next steps:
echo 1. Copy .env file from protocol_v2
echo 2. Run: python main.py -i data\inputs\protocol.docx -o report.xlsx --indication "Indication"
echo.
pause

