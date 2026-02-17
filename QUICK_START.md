# Quick Start Guide

## Starting the Application

### Single Command (Recommended)
```powershell
.\start.ps1
```

This will:
- Kill any existing processes on ports 5000 and 3000
- Start backend server on port 5000
- Start frontend server on port 3000
- Both run in unified dev mode with hot reload

### Stopping the Application
```powershell
.\stop.ps1
```

This will stop all running processes.

### Manual Start (Alternative)
```bash
npm install    # One-time installation
npm run dev    # Start both servers
```

## Login Credentials

After creating staff:
- **Staff ID**: Auto-generated (e.g., `0251ft001`)
- **PIN**: Shown in popup after creation (save it!)

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health: http://localhost:5000/api/health

## ID Formats

### Staff IDs: `0[YY]1FT[Sequential]`
Example: `0251ft001`, `0251ft002`

### Student IDs: `0[YY]1[CourseCode][RollNumber]`
Example: `0251bca116`, `0261cs001`

## Important Notes

1. IDs are auto-generated based on year and course
2. Staff PIN is shown once after creation—save it immediately!
3. For bulk import of old data, use `custom_staff_id` or `custom_student_id` to override generation
4. See [README.md](README.md) for complete documentation
