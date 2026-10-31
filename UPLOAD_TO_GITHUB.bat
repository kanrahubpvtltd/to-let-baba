@echo off
chcp 65001 >nul
title Upload To-Let Baba to GitHub
color 0A

echo ======================================================================
echo              UPLOADING TO-LET BABA TO GITHUB
echo ======================================================================
echo.

set "PATH=C:\Users\SANTOSH KUMAR\AppData\Local\GitHubDesktop\app-3.6.8\resources\app\git\cmd;C:\Program Files\nodejs;%PATH%"

cd /d "%~dp0"

git add .
git commit -m "Update To-Let Baba codebase" >nul 2>nul

echo Pushing to GitHub (kanrahubpvtltd/to-let-baba)...
git push -u origin main

pause
