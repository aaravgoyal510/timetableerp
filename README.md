# Timetable ERP System

A comprehensive timetable management system for educational institutions with student management, staff management, class scheduling, attendance tracking, and more.

## Project Structure

```
├── backend/           # Node.js Express API
│   ├── src/
│   │   ├── config/   # Database configuration
│   │   ├── controllers/  # Business logic
│   │   ├── routes/   # API routes
│   │   └── server.js # Main server file
│   └── package.json
│
└── frontend/         # React TypeScript UI
    ├── src/
    │   ├── api/      # API client
    │   ├── components/  # Reusable components
    │   ├── pages/    # Page components
    │   └── main.tsx  # Entry point
    └── package.json
```

## Features

- **Student Management**: Add, edit, and manage students
- **Staff Management**: Manage faculty members
- **Class Management**: Create and organize classes
- **Subject Management**: Manage subjects and courses
- **Timeslot Management**: Schedule class timeslots
- **Room Management**: Manage classroom inventory
- **Timetable Creation**: Generate and manage timetables
- **Attendance Tracking**: Mark and track student attendance
- **Room Allotment**: Allocate rooms for classes
- **Holiday Management**: Manage academic holidays
- **Role Management**: User role and permission management

## Setup Instructions

### ⚡ Quick Start (3 minutes)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm install
npm run dev
```

**Then open:** http://localhost:3000 ✓

Note: Database tables are already created in your Supabase instance. No schema setup needed!

## API Endpoints

- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `POST /api/staff` - Create new staff
- `GET /api/classes` - Get all classes
- `POST /api/timetable` - Create timetable entry
- `POST /api/attendance` - Mark attendance
- And more...

## Database

Your Supabase database has all tables already created:
- students
- staff
- classes
- subjects_master
- timeslots
- rooms
- timetable
- attendance
- room_allotment
- holidays
- roles_master

📁 `DATABASE_SCHEMA.sql` - Reference backup only (tables already exist)

## Technologies Used

- **Backend**: Node.js, Express.js, Supabase
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (via Supabase)

## Default API Configuration

The frontend is configured to connect to `http://localhost:5000/api` by default. Change this in `frontend/src/api/index.ts` if your backend runs on a different URL.
