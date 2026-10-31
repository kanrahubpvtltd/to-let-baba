@echo off
chcp 65001 >nul
title To-Let Baba (Production Mode)
color 0A

echo ======================================================================
echo           🏠 TO-LET BABA - FAST PRODUCTION SERVER
echo       Direct Owner to Tenant • Zero Brokerage Local Rentals
echo ======================================================================
echo.

set "PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\node;%PATH%"

cd /d "C:\Users\SANTOSH KUMAR\Downloads\Novel\Nayan The Eye\to-let-baba"

:: Open browser after 2 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

echo Opening browser at http://localhost:3000 ...
echo.
echo ======================================================================
echo  Production Server is LIVE!
echo  👉 http://localhost:3000
echo ======================================================================
echo.

call npm.cmd start
pause
