@echo off
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Timetable ERP System - Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js v16 or higher
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo Node.js is installed: %%i

echo.
echo Setting up Backend...
cd backend

if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
    echo Backend dependencies installed
) else (
    echo Backend dependencies already installed
)

echo.
echo Setting up Frontend...
cd ..\frontend

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
    echo Frontend dependencies installed
) else (
    echo Frontend dependencies already installed
)

cd ..

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo.
echo 1. Set up Supabase Database:
echo    - Go to https://app.supabase.com
echo    - Navigate to SQL Editor
echo    - Copy all content from DATABASE_SCHEMA.sql
echo    - Paste into Supabase SQL Editor
echo    - Click 'Run'
echo.
echo 2. Start Backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open Application:
echo    http://localhost:3000
echo.
echo Happy coding!
echo.
pause
