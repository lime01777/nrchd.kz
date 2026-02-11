@echo off
REM Protocol Analyzer v3.1 - Run Script
REM Usage: run.bat input_file.docx "Indication Name"

if "%1"=="" (
    echo Error: Please provide input file
    echo Usage: run.bat ^<input_file^> ^<indication^>
    echo Example: run.bat data\inputs\protocol.docx "Diabetes"
    exit /b 1
)

if "%2"=="" (
    echo Error: Please provide indication
    echo Usage: run.bat ^<input_file^> ^<indication^>
    echo Example: run.bat data\inputs\protocol.docx "Diabetes"
    exit /b 1
)

set INPUT_FILE=%1
set INDICATION=%2
set OUTPUT_FILE=data\outputs\report_%~n1.xlsx

echo ========================================================================
echo Protocol Analyzer v3.1 - Starting Analysis
echo ========================================================================
echo Input: %INPUT_FILE%
echo Indication: %INDICATION%
echo Output: %OUTPUT_FILE%
echo ========================================================================
echo.

python main.py --input "%INPUT_FILE%" --output "%OUTPUT_FILE%" --indication "%INDICATION%" --max-workers 4

echo.
echo ========================================================================
echo Analysis Complete!
echo ========================================================================
pause

