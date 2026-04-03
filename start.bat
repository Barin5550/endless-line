@echo off
title Endless Line — Запуск сайта
echo.
echo  ================================
echo   Endless Line — Запуск сайта
echo  ================================
echo.

cd /d "%~dp0"

echo  [1/2] Запуск сервера (порт 5000)...
start "Endless Line Server" cmd /k "cd /d %~dp0server && node server.js"

timeout /t 2 /nobreak >nul

echo  [2/2] Открываю браузер...
start "" "http://localhost:5000"

echo.
echo  Сайт запущен: http://localhost:5000
echo  Для остановки закройте окно "Endless Line Server"
echo.
pause
