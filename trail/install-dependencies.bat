@echo off
echo Installing MathCenter dependencies...
echo.
echo This will install all required packages for your website
echo.
npm install
echo.
if %errorlevel% == 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo Next step: Double-click start-server.bat to run your website
) else (
    echo ❌ Installation failed. Please check your internet connection.
)
echo.
pause