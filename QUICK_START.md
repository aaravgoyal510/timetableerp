# Quick Start Guide

## Starting the Application

### Single Command (Recommended)
```powershell
.\start.ps1
```

This will automatically:
- Kill any existing processes on ports 5000 and 3000
- Start the backend server on port 5000
- Start the frontend server on port 3000
- Open two new terminal windows for each server

### Stopping the Application
```powershell
.\stop.ps1
```

This will stop all backend and frontend processes.

### Manual Start (Alternative)
If you need to start servers separately:

**Backend:**
```powershell
cd backend
npm start
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

## Login Credentials

**Admin Account:**
- Staff ID: `1`
- PIN: `1234`

**Faculty Account:**
- Staff ID: `2`
- PIN: `5678`

## URLs

- Frontend: http://localhost:3000 (or 3001 if 3000 is busy)
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

## Important Notes

1. **Always use `start.ps1`** to launch the application - it handles both servers together
2. Backend must be running before you can log in
3. If ports are already in use, the start script will automatically kill existing processes
4. Keep both terminal windows open while using the application
