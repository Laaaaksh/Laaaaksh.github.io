@echo off
REM 🚀 Laksh's Adventure Portfolio - Windows Server Launcher

echo.
echo 🚀 LAKSH'S ADVENTURE PORTFOLIO SERVER
echo ======================================

REM Check for Python 3
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐍 Starting Python server...
    python start-server.py
    goto :end
)

REM Check for Python 3 explicitly
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo 🐍 Starting Python 3 server...
    python3 start-server.py
    goto :end
)

REM Check for Node.js
node --version >nul 2>&1
if %errorlevel% == 0 (
    if exist package.json (
        echo 🟢 Starting Node.js server...
        npm start
        goto :end
    )
)

REM No server found
echo ❌ Error: No suitable server found!
echo Please install Python 3 or Node.js to run the local server.
echo.
echo 🔧 Quick fixes:
echo    • Install Python 3: https://python.org
echo    • Install Node.js: https://nodejs.org
echo.
echo 🌐 Alternatively, you can use any static file server:
echo    • Live Server extension in VS Code
echo    • http-server: npm install -g http-server
pause

:end