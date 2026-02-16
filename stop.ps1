# Stop all ERP Timetable System processes

Write-Host "Stopping ERP Timetable System..." -ForegroundColor Red
Write-Host ""

# Stop Backend (Port 5000)
$backendProcess = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($backendProcess) {
    $procId = $backendProcess.OwningProcess
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Write-Host "Backend stopped (Port 5000)" -ForegroundColor Green
} else {
    Write-Host "Backend not running" -ForegroundColor Gray
}

# Stop Frontend (Port 3000-3010 range for Vite)
for ($port = 3000; $port -le 3010; $port++) {
    $frontendProcess = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($frontendProcess) {
        $procId = $frontendProcess.OwningProcess
        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        Write-Host "Frontend stopped (Port $port)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "All servers stopped!" -ForegroundColor Green
