# 🎓 Timetable ERP System

A comprehensive full-stack timetable management system for educational institutions with student management, staff management, class scheduling, attendance tracking, and relationship management.

## 🏗️ Architecture

**Unified Monorepo** using npm workspaces with shared dependencies:

```
timetable-erp/
├── backend/              # Express.js API Server
│   ├── src/
│   │   ├── config/       # Supabase configuration
│   │   ├── controllers/  # Business logic (14 modules)
│   │   ├── routes/       # API endpoints (14 routes)
│   │   └── server.js     # Main server + production frontend serving
│   └── package.json      # Backend workspace config
│
├── frontend/             # React + TypeScript UI
│   ├── src/
│   │   ├── api/          # API client (15 service modules)
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # 15 page components
│   │   └── main.tsx      # Application entry point
│   ├── dist/             # Production build output
│   └── package.json      # Frontend workspace config
│
├── node_modules/         # Shared dependencies (single source)
├── package.json          # Root workspace configuration
└── START_HERE.md         # Quick start guide
```

## ✨ Features

### Core Management Modules (12)
- **Students** - Complete student lifecycle management
- **Staff** - Faculty and staff administration
- **Classes** - Class organization and management
- **Subjects** - Subject/course catalog
- **Timeslots** - Schedule time block management
- **Rooms** - Classroom and facility allocation
- **Timetable** - Automated timetable generation
- **Attendance** - Real-time attendance tracking
- **Room Allotment** - Dynamic room assignment
- **Holidays** - Academic calendar management
- **Roles** - User role definitions

### Relationship Management (3)
- **Staff-Role Mapping** - Assign roles to staff members
- **Student-Role Mapping** - Assign roles to students
- **Teacher-Subject Mapping** - Assign subjects to teachers

## 🚀 Quick Start

### Development Mode (Hot Reload)
```bash
npm install
npm run dev
```
- **Backend API**: http://localhost:5000/api
- **Frontend**: http://localhost:3000

### Production Mode (Single Server)
```bash
npm install
npm run build
npm run start:production
```
- **Full Application**: http://localhost:5000

## 📋 Available Commands

### Development
| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies (one command for everything) |
| `npm run dev` | Start development mode (frontend + backend) |
| `npm run dev:backend` | Start only backend server (port 5000) |
| `npm run dev:frontend` | Start only frontend server (port 3000) |

### Building
| Command | Description |
|---------|-------------|
| `npm run build` | Build frontend for production |
| `npm run build:production` | Clean + build everything |
| `npm run clean` | Remove build outputs |

### Production
| Command | Description |
|---------|-------------|
| `npm run start` | Start backend only |
| `npm run start:production` | Start unified production server |
| `npm run preview` | Preview production build |

### Validation & Quality
| Command | Description |
|---------|-------------|
| `npm run validate` | Run all checks (lint + type-check + build) |
| `npm run pre-push` | Same as validate (for pre-push validation) |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run lint:strict` | Strict linting (no warnings allowed) |
| `npm run type-check` | Validate TypeScript types |

### Testing & Deployment
| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run deploy:prepare` | Prepare for deployment (clean + build) |

## 🗄️ Database Schema

PostgreSQL database on **Supabase** with 14+ tables:

### Main Tables
- `students` - Student records
- `staff` - Staff/faculty records  
- `classes` - Class definitions
- `subjects_master` - Subject catalog
- `timeslots` - Time blocks
- `rooms` - Room inventory
- `timetable` - Schedule entries
- `attendance` - Attendance records
- `room_allotment` - Room assignments
- `holidays` - Holiday calendar
- `roles_master` - Role definitions

### Mapping Tables
- `staff_role_map` - Staff→Role relationships
- `student_role_map` - Student→Role relationships
- `teacher_subject_map` - Teacher→Subject relationships

📁 See `DATABASE_SCHEMA.sql` and `SAMPLE_DATA.sql` for complete schema

## 🔌 API Endpoints (14 Modules)

All endpoints are prefixed with `/api`:

| Module | Endpoints | Methods |
|--------|-----------|---------|
| Students | `/api/students` | GET, POST, PUT, DELETE |
| Staff | `/api/staff` | GET, POST, PUT, DELETE |
| Classes | `/api/classes` | GET, POST, PUT, DELETE |
| Subjects | `/api/subjects` | GET, POST, PUT, DELETE |
| Timeslots | `/api/timeslots` | GET, POST, PUT, DELETE |
| Rooms | `/api/rooms` | GET, POST, PUT, DELETE |
| Timetable | `/api/timetable` | GET, POST, PUT, DELETE |
| Attendance | `/api/attendance` | GET, POST, PUT, DELETE |
| Room Allotment | `/api/room-allotment` | GET, POST, PUT, DELETE |
| Holidays | `/api/holidays` | GET, POST, PUT, DELETE |
| Roles | `/api/roles` | GET, POST, PUT, DELETE |
| Staff-Role Map | `/api/staff-role-map` | GET, POST, PUT, DELETE |
| Student-Role Map | `/api/student-role-map` | GET, POST, PUT, DELETE |
| Teacher-Subject Map | `/api/teacher-subject-map` | GET, POST, PUT, DELETE |

**Health Check**: `GET /api/health`

## 🛠️ Technologies

### Backend Stack
- **Runtime**: Node.js (>=16.0.0)
- **Framework**: Express.js 4.18.2
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Dev Tools**: Nodemon, Jest

### Frontend Stack
- **Framework**: React 18.2.0
- **Language**: TypeScript 4.9.3
- **Build Tool**: Vite 4.1.0
- **Styling**: Tailwind CSS 3.2.7
- **Routing**: React Router 6.8.0
- **HTTP Client**: Axios 1.3.2

### Development
- **Package Manager**: npm workspaces
- **Process Manager**: Concurrently
- **Environment**: cross-env

### Quality Assurance
- **Linting**: ESLint with TypeScript & React plugins
- **Type Safety**: TypeScript strict mode
- **Pre-Push Validation**: Automated lint + type-check + build
- **Code Style**: ESLint configured for React best practices

## 🛡️ Pre-Push Validation

This project has **comprehensive automated validation** to prevent deployment crashes:

### Automatic Checks (on every `git push`)

1. **ESLint** - Code quality and style checking
2. **TypeScript** - Type safety validation  
3. **Build** - Full production compilation (mirrors Vercel)

### How It Works

```bash
git push
# → Automatically runs: lint → type-check → build
# → If ANY fail: Push is ABORTED ❌
# → If ALL pass: Push proceeds ✅
```

### Manual Validation

```bash
npm run validate    # Run all checks manually
npm run pre-push    # Same as validate
npm run lint:fix    # Auto-fix linting issues
```

### Benefits

- ✅ **Prevent Vercel crashes** - Catch build errors before deployment
- ✅ **Type safety** - No runtime type errors
- ✅ **Code quality** - Consistent style and best practices
- ✅ **Fast feedback** - Find issues locally, not in production

📖 **See [VALIDATION.md](VALIDATION.md) for complete guide**

## ⚙️ Configuration

### Backend Environment (.env)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Workspace Benefits

1. **Unified Dependencies** - Single `node_modules` for entire project (~145MB instead of ~300MB)
2. **Faster Installation** - Install once, use everywhere
3. **Consistent Versions** - No version conflicts between frontend/backend
4. **Simplified Maintenance** - Update packages in one place
5. **Easy Deployment** - Production mode serves everything from one server
6. **Better DX** - One command to rule them all

## 🚢 Deployment

### Option 1: Separate Deployment
Deploy frontend (Vercel/Netlify) and backend (Heroku/Railway) separately.

### Option 2: Unified Deployment
Deploy as single server (backend serves built frontend):
```bash
npm run build
npm run start:production
```

## 📈 Features & Capabilities

- ✅ Full CRUD operations on all entities
- ✅ Real-time data sync with Supabase
- ✅ Mock data fallback for offline development
- ✅ Responsive UI with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Environment-based configuration
- ✅ Production-ready build system
- ✅ Comprehensive error handling
- ✅ RESTful API architecture
- ✅ Modular component structure

## 📝 License

ISC

## 🤝 Contributing

This is a complete timetable management system. Feel free to extend with:
- Additional relationship types
- Bulk import/export
- Advanced reporting
- User authentication UI
- Role-based access control
- Mobile app integration

---

**For quick start instructions, see [START_HERE.md](START_HERE.md)**
