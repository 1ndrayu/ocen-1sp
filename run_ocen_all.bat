@echo off
echo [*] OCEN MASTER LAUNCHER
echo ========================

:: Detect Python
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PY_CMD=python3
) else (
    where python >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        set PY_CMD=python
    ) else (
        echo [!] Python not found!
        pause
        exit
    )
)

echo [*] Starting Backend (New Window)...
start "OCEN Backend" cmd /c "cd server && %PY_CMD% -m pip install -r requirements.txt && %PY_CMD% main.py"

echo [*] Waiting for backend to warm up...
timeout /t 5 /nobreak >nul

echo [*] Starting Frontend (New Window)...
start "OCEN Frontend" cmd /c "cd frontend && npm install && npm run dev"

echo ========================
echo [*] Both services are launching! 
echo Check the new windows for logs.
echo ========================
pause
