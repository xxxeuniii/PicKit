@echo off
setlocal

cd /d "%~dp0"
title PicKit Dev Server

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or is not available in PATH.
    echo Please install Node.js and try again.
    pause
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not available in PATH.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo Starting PicKit at http://localhost:3000 ...
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] PicKit failed to start.
    pause
    exit /b 1
)

endlocal
