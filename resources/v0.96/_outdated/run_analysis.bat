@echo off
chcp 65001 >nul
cd /d D:\v0.92
python main.py -i "data\inputs\КП Откр переломы верх и ниж.docx" -o "data\outputs\report_open_fractures.xlsx" --indication "Open fractures" --max-workers 12
pause
