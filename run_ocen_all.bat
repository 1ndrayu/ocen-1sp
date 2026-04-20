@echo off
echo [*] OCEN MASTER LAUNCHER
echo ========================

:: Robust Python Detection
set PY_CMD=
for %%p in (python3.11, python3, python, py) do (
    where %%p >nul 2>nul
    if not errorlevel 1 (
        set PY_CMD=%%p
        goto :found
    )
)

:: Try specific Windows Store path as fallback
if exist "%LOCALAPPDATA%\Microsoft\WindowsApps\python3.11.exe" (
    set "PY_CMD=%LOCALAPPDATA%\Microsoft\WindowsApps\python3.11.exe"
    goto :found
)

:found
if "%PY_CMD%"=="" (
    echo [!] Python not found in PATH or WindowsApps!
    echo [!] Please ensure Python is installed and added to PATH.
    pause
    exit
)

echo [*] Using %PY_CMD%
echo [*] Starting Backend (New Window)...
start "OCEN Backend" cmd /c "cd server && "%PY_CMD%" -m pip install -r requirements.txt && "%PY_CMD%" main.py"

echo [*] Waiting for backend...
timeout /t 5 /nobreak >nul

echo [*] Starting Frontend (New Window)...
start "OCEN Frontend" cmd /c "cd frontend && npm install && npm run dev"

echo ========================
echo [*] Launching! Check the new windows.
echo ========================
pause
