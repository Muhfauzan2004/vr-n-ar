@echo off
title Scanner 3D Racing Showcase
cls
echo ========================================================
echo    SCANNER KAMERA 3D RACING SHOWCASE
echo    Red Bull RB19 - Ferrari F1-75 - Ducati Desmosedici
echo ========================================================
echo.
echo [1] Menjalankan Server Lokal di Port 8080...
echo [2] Membuka Peramban ke Scanner Kamera...
echo.

start "" "http://localhost:8080/index.html"
start "" "http://localhost:8080/lembar_ar.html"

python -m http.server 8080
pause
