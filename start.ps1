# ERP Timetable System - Unified Startup Script
# This script starts both backend and frontend servers

Write-Host "Starting ERP Timetable System..." -ForegroundColor Cyan
Write-Host ""

# Kill any existing node processes on ports 5000 and 3000
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
$backendProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($backendProcess) {
    $pid = $backendProcess.OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "   Killed process on port 5000" -ForegroundColor Green
}

$frontendProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendProcess) {
    $pid = $frontendProcess.OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "   Killed process on port 3000" -ForegroundColor Green
}

# Start Backend Server
Write-Host ""
Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host 'Backend Server' -ForegroundColor Green; npm start"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host 'Frontend Server' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "System is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Gray
