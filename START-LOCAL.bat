@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  echo Starting FinMate at http://localhost:8000
  start "FinMate" http://localhost:8000
  py -m http.server 8000
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting FinMate at http://localhost:8000
  start "FinMate" http://localhost:8000
  python -m http.server 8000
  goto :eof
)
echo Python is not installed. If your computer permits no installers, use a trusted HTTPS static hosting service for the PWA.
pause
