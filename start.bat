@echo off
title OdysseyTour — Запуск сайта
echo.
echo  ================================
echo   OdysseyTour — Запуск сайта
echo  ================================
echo.

cd /d "%~dp0"

echo  [1/2] Запуск сервера (порт 5000)...
start "OdysseyTour Server" cmd /k "cd /d %~dp0 && node api/index.js"

timeout /t 2 /nobreak >nul

echo  [2/2] Открываю браузер...
start "" "http://localhost:5000"

echo.
echo  Сайт запущен: http://localhost:5000
echo  Для остановки закройте окно "OdysseyTour Server"
echo.
pause
