@echo off
echo Checking if Node.js is installed...
echo.

node -v >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js is installed!
    echo Version: 
    node -v
    echo.
    echo npm version:
    npm -v
    echo.
    echo You can now run: npm install
) else (
    echo ❌ Node.js is NOT installed
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org
    echo.
    echo Choose the LTS version (recommended)
)

echo.
pause