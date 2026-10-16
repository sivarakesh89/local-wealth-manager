@echo off
cd /d "%~dp0"
echo FinMate Split-Media Recovery Helper
node --version
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20 or newer, then run this file again.
  pause
  exit /b 1
)
node SPLIT-GOLD-MEDIA-RECOVERY.js
pause
