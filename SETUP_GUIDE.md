# Installation and Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account with PostgreSQL database

## Step 1: Get Supabase Credentials

1. Go to [Supabase](https://supabase.com)
2. Create a new project or use existing one
3. Create the empty database using the SQL schema provided
4. Get your API URL and Key from Project Settings → API

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-anon-key

# Start the development server
npm run dev
```

The backend will run on `http://localhost:5000`

## Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Step 4: Access the Application

Open your browser and go to `http://localhost:3000`

## Running Both Simultaneously

In a terminal with split panes or two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Building for Production

### Backend
```bash
cd backend
npm run build  # if you have a build script
```

### Frontend
```bash
cd frontend
npm run build
```

## Troubleshooting

### "Cannot connect to API"
- Ensure backend is running on port 5000
- Check SUPABASE_URL and SUPABASE_KEY in backend `.env`
- Verify API endpoint in `frontend/src/api/index.ts`

### "Database connection failed"
- Verify Supabase credentials
- Check if the database schema is properly created
- Ensure RLS (Row Level Security) policies allow access

### Port Already in Use
Change port in `.env` (backend) or `vite.config.ts` (frontend)

## API Documentation

All endpoints start with `/api/`:

- Students: `/students`
- Staff: `/staff`
- Classes: `/classes`
- Subjects: `/subjects`
- Timeslots: `/timeslots`
- Rooms: `/rooms`
- Timetable: `/timetable`
- Attendance: `/attendance`
- Room Allotment: `/room-allotment`
- Holidays: `/holidays`
- Roles: `/roles`

Each endpoint supports:
- GET / - Get all
- GET /:id - Get by ID
- POST / - Create
- PUT /:id - Update
- DELETE /:id - Delete
