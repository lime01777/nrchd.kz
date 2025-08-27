@echo off
echo 🔍 Поиск файлов с ошибками const и функций t...
echo.

echo 📁 Поиск файлов с layout функциями...
findstr /s /n "\.layout =" resources\js\*.jsx
echo.

echo 📁 Поиск файлов с функциями t в layout...
findstr /s /n "\.layout.*t(" resources\js\*.jsx
echo.

echo 📁 Поиск файлов с const t = ...
findstr /s /n "const t =" resources\js\*.jsx
echo.

echo 📁 Поиск файлов с window.__INERTIA_PROPS__...
findstr /s /n "window\.__INERTIA_PROPS__" resources\js\*.jsx
echo.

echo ✅ Поиск завершен!
pause
