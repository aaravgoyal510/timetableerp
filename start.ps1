# ERP Timetable System - Single Instance Startup Script
# This script starts both backend and frontend in one process

Write-Host "Starting ERP Timetable System (single instance)..." -ForegroundColor Cyan
Write-Host ""

# Kill any existing node processes on ports 5000 and 3000
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
$backendProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($backendProcess) {
    $procId = $backendProcess.OwningProcess
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Write-Host "   Killed process on port 5000" -ForegroundColor Green
}

$frontendProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendProcess) {
    $procId = $frontendProcess.OwningProcess
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Write-Host "   Killed process on port 3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting backend + frontend together..." -ForegroundColor Cyan
npm run dev

Write-Host ""
Write-Host "System is starting up!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
