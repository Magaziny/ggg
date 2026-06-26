@echo off
TITLE Wedding Invitation Server
COLOR 0B
echo.
echo ======================================================
echo    WEDDING INVITATION PLATFORM - STARTING SERVER
echo ======================================================
echo.
echo Current directory: %cd%
echo Checking for node_modules...

if not exist node_modules (
    echo [!] node_modules not found. Installing dependencies...
    call npm install
)

echo.
echo [OK] Dependencies ready. Starting Next.js...
echo.
echo ======================================================
echo    LOCAL:   http://localhost:4002
echo    NETWORK: http://0.0.0.0:4002
echo ======================================================
echo.

call npm run dev

pause
