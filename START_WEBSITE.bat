@echo off
chcp 65001 >nul
title To-Let Baba - Local Rentals Portal
color 0B

echo ======================================================================
echo                 🏠 TO-LET BABA (toletbaba.in)
echo       Direct Owner to Tenant • Zero Brokerage Local Rentals
echo ======================================================================
echo.

:: Ensure Node.js is on PATH
set "PATH=C:\Program Files\nodejs;%LOCALAPPDATA%\Programs\node;%PATH%"

echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js nahi mila! Kripya Node.js install karein.
    pause
    exit /b 1
)
echo [OK] Node.js ready.
echo.

echo [2/3] Starting To-Let Baba Web Portal...
cd /d "C:\Users\SANTOSH KUMAR\Downloads\Novel\Nayan The Eye\to-let-baba"

:: Open browser after 3 seconds in background
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

echo [3/3] Browser automatically opening at http://localhost:3000 ...
echo.
echo ======================================================================
echo  Website LIVE ho rahi hai!
echo  Agar browser apne aap na khule to is link par click karein:
echo  👉 http://localhost:3000
echo.
echo  Website band karne ke liye is black window ko close kar dein.
echo ======================================================================
echo.

call npm.cmd run dev
pause
