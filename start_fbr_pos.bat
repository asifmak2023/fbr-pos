@echo off
TITLE FBR POS System Launcher

:: Go to the project root
cd /d K:\fbr-pos

echo ========================================
echo      STARTING FBR POS SYSTEM
echo ========================================
echo.

:: -------------------------------------------------
:: 1. Start XAMPP (MySQL)
:: -------------------------------------------------
if exist "C:\xampp\xampp-control.exe" (
    echo [1/3] Opening XAMPP Control Panel...
    echo        (Please click "Start" on MySQL if not running)
    start "" "C:\xampp\xampp-control.exe"
) else (
    echo [1/3] Warning: XAMPP not found at C:\xampp.
    echo        Please start MySQL manually.
    timeout /t 2 >nul
)

timeout /t 2 >nul

:: -------------------------------------------------
:: 2. Start Backend (FastAPI)
:: -------------------------------------------------
echo [2/3] Starting Backend Server (FastAPI)...
start "FBR Backend" powershell -NoExit -Command "cd 'K:\fbr-pos'; .\venv\Scripts\Activate.ps1; cd backend; uvicorn app.main:app --reload"

timeout /t 2 >nul

:: -------------------------------------------------
:: 3. Start Frontend (Angular)
:: -------------------------------------------------
echo [3/3] Starting Frontend Server (Angular)...
start "FBR Frontend" powershell -NoExit -Command "cd 'K:\fbr-pos\frontend'; npx ng serve"

:: -------------------------------------------------
:: Summary
:: -------------------------------------------------
echo.
echo ========================================
echo       SYSTEM STARTING UP...
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:4200
echo.
echo IMPORTANT: Log in with admin / admin123
echo.
pause