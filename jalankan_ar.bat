@echo off
title Menjalankan AR Red Bull RB19 Server
echo ====================================================
echo   MEMULAI SERVER AR RED BULL RB19 (SEMESTER 5 TUGAS)
echo ====================================================
echo.
echo Server akan aktif di port 8080.
echo.
echo [1] Buka di Laptop: http://localhost:8080
echo.
echo Tekan CTRL + C di jendela ini untuk mematikan server.
echo.
python -m http.server 8080
pause
