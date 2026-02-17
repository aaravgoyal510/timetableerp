# 🎓 Timetable ERP System

Comprehensive educational institution management system with staff/student management, class assignments, timetable generation, attendance tracking, and role-based access control.

**Built with:** Node.js + React + TypeScript + PostgreSQL (Supabase)  
**Auth:** Staff ID + PIN (6-digit, bcrypt hashed)  
**Architecture:** Full-stack npm workspaces monorepo  
**Status:** Development-ready with auto-ID generation systems

---

## 📋 Quick Navigation

- [Quick Start](#quick-start)
- [ID Generation Systems](#id-generation-systems)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (LTS)
- **Supabase** account with PostgreSQL database
- **Git** (for version control)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/chaubey.git
cd chaubey

# Install all dependencies (backend + frontend)
npm install
```

### Configuration

**Backend** (`backend/.env`):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Running

```bash
# Start both servers
npm run dev
```

**Windows PowerShell:**
```powershell
.\start.ps1      # Start
.\stop.ps1       # Stop
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🆔 ID Generation Systems

### Staff ID: `0[YY]1FT[Sequential]`

**Format:**
- `0` - Fixed prefix
- `YY` - Year of joining (25 = 2025)
- `1` - Fixed digit
- `FT` - Fixed (Faculty/Teaching)
- `[Sequential]` - Auto-incremented (001, 002, 003...)

**Examples:**
- `0251ft001` - Joined 2025, faculty, #001
- `0251ft002` - Joined 2025, faculty, #002
- `0261ft001` - Joined 2026, faculty, #001

**PIN:** 6-digit numeric, bcrypt hashed, shown once after creation

**Bulk Import:** Use `custom_staff_id` to override generation

### Student ID: `0[YY]1[CourseCode][RollNumber]`

**Format:**
- `0` - Fixed prefix
- `YY` - Year of joining (25 = 2025)
- `1` - Fixed digit
- `[CourseCode]` - From class name (bca, cs, it)
- `[RollNumber]` - Sequential number

**Examples:**
- `0251bca116` - Joined 2025, BCA, roll #116
- `0261cs001` - Joined 2026, CS, roll #001

**Bulk Import:** Use `custom_student_id` to override generation

See [STAFF_ID_SPECIFICATION.md](STAFF_ID_SPECIFICATION.md) and [STUDENT_ID_SPECIFICATION.md](STUDENT_ID_SPECIFICATION.md) for full details.

---

## ✨ Features

### Staff Management
- ✅ Auto-generated alphanumeric IDs (0[YY]1FT[Sequential])
- ✅ Auto-generated 6-digit PIN verification
- ✅ Bulk import with custom ID override
- ✅ Role assignment (inline on Staff page)
- ✅ Department assignment (inline on Staff page)
- ✅ Subject assignment for teachers (inline on Staff page)
- ✅ Cascading deletion with referential integrity

### Student Management
- ✅ Auto-generated course-based IDs (0[YY]1[CourseCode][RollNumber])
- ✅ Class/batch assignment
- ✅ Bulk import with custom ID override
- ✅ Student enrollment tracking

### Administrative
- ✅ Class management (courses, semesters, sections)
- ✅ Subject management with course mapping
- ✅ Department management
- ✅ Role-based access control (RBAC)
- ✅ Timetable configuration
- ✅ Room/timeslot management
- ✅ Attendance tracking
- ✅ Holiday calendar

---

## 📁 Project Structure

```
chaubey/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express setup
│   │   ├── controllers/           # Business logic
│   │   │   ├── staffController.js
│   │   │   ├── studentController.js
│   │   │   └── ...
│   │   ├── routes/                # API endpoints
│   │   ├── middleware/            # Auth, logging
│   │   └── config/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Route pages
│   │   │   ├── Staff.tsx
│   │   │   ├── Students.tsx
│   │   │   └── ...
│   │   ├── components/            # React components
│   │   ├── api/                   # API clients
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── .env
│
├── package.json                   # Monorepo config
├── README.md                      # This file
├── QUICK_START.md                 # Development guide
├── DATABASE_SCHEMA.sql            # Schema reference
├── STAFF_ID_SPECIFICATION.md      # Staff ID docs
├── STUDENT_ID_SPECIFICATION.md    # Student ID docs
├── start.ps1                      # Windows launcher
├── stop.ps1                       # Windows stopper
└── .gitignore
```

---

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT + bcrypt
- **Language:** JavaScript

### Frontend
- **Framework:** React 18+
- **Language:** TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **HTTP:** Axios
- **Icons:** Lucide React

### Infrastructure
- **Database:** Supabase (PostgreSQL)
- **Package Manager:** npm workspaces
- **Deployment:** Ready for Vercel, Netlify, Docker

---

## 🔌 API Endpoints

### Staff
```
GET    /api/staff              # All staff
GET    /api/staff/:id          # Single staff
POST   /api/staff              # Create (auto/custom ID)
PUT    /api/staff/:id          # Update
DELETE /api/staff/:id          # Delete
```

### Students
```
GET    /api/students           # All students
GET    /api/students/:id       # Single student
POST   /api/students           # Create (auto/custom ID)
PUT    /api/students/:id       # Update
DELETE /api/students/:id       # Delete
```

### Classes
```
GET    /api/classes            # All classes
POST   /api/classes            # Create
PUT    /api/classes/:id        # Update
DELETE /api/classes/:id        # Delete
```

### Subjects
```
GET    /api/subjects           # All subjects
POST   /api/subjects           # Create
DELETE /api/subjects/:code     # Delete
```

### More: Departments, Roles, Timeslots, Rooms, Attendance, etc.

See `backend/src/routes/` for complete documentation.

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
.\stop.ps1
# or
Get-Process -Name node | Stop-Process -Force
```

### Database Connection Issues
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` in `backend/.env`
2. Check Supabase project is active
3. Verify schema tables exist (see `DATABASE_SCHEMA.sql`)

### Frontend Build Issues
```bash
cd frontend
npm run build
npm run preview
```

---

## 📝 Development Workflow

### Making Changes
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm run dev

# Commit
git commit -am "Description"

# Push
git push origin feature/your-feature
```

### Validation
```bash
npm run validate    # ESLint + TypeScript + build
npm run lint:fix    # Auto-fix linting
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment for Production
- Use strong JWT_SECRET
- Use HTTPS for connections
- Set NODE_ENV=production
- Use process manager (PM2, systemd)

---

## 📄 License

Educational ERP system - All rights reserved.

**Last Updated:** February 17, 2026

### Prerequisites
- **Node.js 18+** (LTS)
- **Supabase** account with PostgreSQL database

### Installation & Running

```bash
# Clone and enter directory
cd chaubey

# Install all dependencies (backend + frontend)
npm install

# Configure environment variables
# Backend: backend/.env (SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, PIN_SALT)
# Frontend: frontend/.env (VITE_API_URL=http://localhost:5000/api)

# Start dev servers (both backend & frontend simultaneously)
npm run dev
```

**Once running:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

### Demo Login Credentials

| Staff ID | Role   | PIN  | Access |
|----------|--------|------|--------|
| 1        | Admin  | 1234 | All modules |
| 2        | Faculty| 5678 | Teaching modules only |

---

## 🏗️ Architecture

### Project Structure

```
chaubey/
├── backend/
│   ├── src/
│   │   ├── config/           # Supabase connection
│   │   ├── controllers/      # Business logic
│   │   │   └── authController.js    # Auth logic
│   │   ├── middleware/       # Auth & validation
│   │   ├── routes/           # API endpoints
│   │   └── server.js         # Express server
│   ├── migrations/           # SQL migrations
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # API client with axios
│   │   ├── components/       # React components
│   │   │   └── Sidebar.tsx   # Role-based menu
│   │   ├── pages/            # Page components
│   │   ├── context/          # Auth context
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx           # Router setup
│   │   └── main.tsx
│   ├── .env                  # Frontend config
│   └── package.json
│
├── package.json              # Monorepo config
├── README.md                 # This file
├── SETUP.md                  # Detailed setup guide
├── VERIFICATION_CHECKLIST.md # Testing guide
└── test-auth-flow.js         # API test script
```

### System Architecture Diagram

```
User Browser (React + TypeScript)
        ↓
    [Login Page]
        ↓
    [AuthContext] ← manages tokens in localStorage
        ↓
    [API Client] ← axios with token refresh interceptors
        ↓
    [Backend] (Node.js/Express, port 5000)
        ├── authController ← JWT verification
        ├── authMiddleware ← token validation
        └── Database Layer
                ↓
            [Supabase/PostgreSQL]
                ├── auth_credentials (PIN hashes)
                ├── auth_sessions (active sessions)
                ├── staff (staff details)
                ├── staff_role_map (role assignments)
                └── auth_audit_log (event tracking)
```

---

## ✨ Features

### ✅ Implemented (MVP Complete)

**Authentication & Authorization**
- ✅ PIN-based login (Staff ID + 4-digit PIN)
- ✅ JWT tokens (Access: 24h, Refresh: 7d)
- ✅ Automatic token refresh on API calls
- ✅ Bcrypt password/PIN hashing (cost factor: 10)
- ✅ Session management with audit logging
- ✅ Logout with session invalidation
- ✅ Secure token storage (hashed in DB)
- ✅ Role-based access control (5 tiers)
- ✅ Protected routes with auto-redirect

**UI/UX**
- ✅ Professional login page
- ✅ Responsive sidebar with role-based menu
- ✅ Dashboard with user info
- ✅ Loading states and error messages
- ✅ Token persistence on page refresh
- ✅ Logout confirmation
- ✅ Mobile-responsive design (Tailwind CSS)

**Database**
- ✅ Schema with 9 core tables
- ✅ Foreign key constraints
- ✅ Automatic timestamps
- ✅ Audit logging (all auth events)
- ✅ Demo data seeding

### 📋 Role System (5 Tiers)

| Role | Access Level | Key Permissions |
|------|--------------|-----------------|
| **Admin** | Full | All modules, user management, settings |
| **HOD** | Department | Staff, classes, subjects in dept |
| **Faculty** | Teaching | Classes, subjects, attendance, timetable |
| **Staff** | Limited | Basic data view, no management |
| **Student** | View-only | Own timetable, attendance |

---

## 🛠️ Technology Stack

### Backend
- **Framework:** Express.js 4.18
- **Runtime:** Node.js 18+
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT (jsonwebtoken 9.0.2)
- **Hashing:** bcryptjs 2.4.3
- **Environment:** dotenv

### Frontend
- **Framework:** React 18
- **Language:** TypeScript 5.0
- **Build Tool:** Vite 4.x
- **Styling:** Tailwind CSS 3.x
- **HTTP Client:** Axios
- **State:** React Context API
- **Icons:** Lucide React

### Database
- **Engine:** PostgreSQL 14+
- **Host:** Supabase (cloud-hosted)
- **Schema:** 9 tables with relations
- **Migrations:** SQL (static files)

---

## 🔐 Authentication System

### Login Flow

```
1. User enters Staff ID + PIN
2. Frontend → POST /api/auth/login
3. Backend validates PIN with bcrypt
4. JWT tokens generated (access + refresh)
5. Session stored with token hashes
6. Tokens → localStorage
7. User redirected to Dashboard
8. All API calls include Authorization header
```

### Token Strategy

**Access Token** (JWT, 24-hour expiry)
- Contains: staff_id, name, email, roles
- Sent with every API request
- Short-lived for security

**Refresh Token** (JWT, 7-day expiry)
- Used only for getting new access token
- Stored separately in DB
- Longer-lived, server-side validated

**Auto-Refresh Mechanism**
- API interceptor detects 401 response
- Refresh token sent to `/auth/refresh`
- New access token issued automatically
- Request retried with new token

### Session Management

Each login creates an `auth_session` record with:
- Token hash (SHA256 of JWT)
- Refresh token hash
- Expires at timestamp
- Active status flag
- IP address and user-agent

**Logout invalidates:** `is_active = false` in session table

---

## 📡 API Endpoints

### Authentication Routes

```
POST   /api/auth/login              → Login with PIN
GET    /api/auth/verify             → Check token validity
POST   /api/auth/refresh            → Get new access token
POST   /api/auth/logout             → Logout & invalidate session
```

### Protected Routes (require valid JWT)

```
GET    /api/health                  → API health status
GET    /api/staff                   → List all staff
GET    /api/students                → List all students
GET    /api/classes                 → List all classes
GET    /api/subjects                → List all subjects
[... more routes for timetable, attendance, etc ...]
```

### Response Format

**Success (200)**
```json
{
  "message": "Success",
  "staff": {
    "staff_id": 1,
    "staff_name": "Admin User",
    "roles": ["Admin"]
  },
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**Error (401, 403, 500)**
```json
{
  "error": "Invalid Staff ID or PIN",
  "details": "Optional error details"
}
```

---

## 🧪 Testing

### Run Test Suite

```bash
# Comprehensive backend API tests
npm run test
# or manually run:
node test-auth-flow.js
```

### Test Coverage

- ✅ Health endpoint
- ✅ Login with valid credentials
- ✅ Login with invalid PIN (rejected)
- ✅ Login with invalid Staff ID (rejected)
- ✅ Token verification
- ✅ Invalid token rejection
- ✅ Token refresh mechanism
- ✅ Logout endpoint
- ✅ Session invalidation
- ✅ Protected route validation

### Manual Testing Checklist

See [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) for comprehensive manual testing guide covering:
- Phase 1: Setup verification
- Phase 2: Backend endpoint testing
- Phase 3: Frontend login flow
- Phase 4: Role-based access control
- Phase 5: Database verification
- Phase 6: Error handling
- Phase 7: Security checks
- Phase 8-11: Performance, compatibility, production readiness

---

## 🔒 Security Features

✅ **PIN Hashing**
- Bcryptjs with cost factor 10 (strong protection)
- Never store plain PINs
- Verify with bcrypt.compare()

✅ **JWT Security**
- Strong secret (32+ characters)
- Signed with HS256 algorithm
- Token expiry enforced (24h access, 7d refresh)
- No sensitive data in payload (can be decoded)

✅ **Session Security**
- Token hashes stored (SHA256), not plain tokens
- Logout immediately invalidates in database
- IP and user-agent logged for audit trail
- No token reuse after logout

✅ **API Security**
- CORS configured for frontend domain
- Authorization header validation
- Input validation on all endpoints
- Error messages don't leak system details

✅ **Frontend Security**
- React XSS protection (auto-escaping)
- No eval() or innerHTML with user data
- localStorage for tokens (no cookies to avoid CSRF)
- Tokens cleared on logout

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to backend" (Frontend shows error)

**Solution:**
```bash
# 1. Verify both servers running on correct ports
# Frontend should be on port 3000
# Backend should be on port 5000
# Check with: lsof -i :3000 and lsof -i :5000 (Mac/Linux)
# or: netstat -ano | findstr :3000 (Windows)

# 2. Check VITE_API_URL in frontend/.env
cat frontend/.env
# Should have: VITE_API_URL=http://localhost:5000/api

# 3. Check browser console (F12 → Console tab) for exact error
# Look in Network tab to see if requests reach backend

# 4. Restart dev server
npm run dev
```

### Problem: "Invalid Staff ID or PIN" (login fails)

**Solution:**
```bash
# 1. Verify credentials in database
SELECT * FROM staff WHERE staff_id = 1;
SELECT * FROM auth_credentials WHERE staff_id = 1;

# 2. Check PIN hash is correct
# Run: node backend/generate-hash.js
# This generates a proper bcrypt hash for testing

# 3. Check JWT_SECRET in backend/.env
cat backend/.env | grep JWT_SECRET
```

### Problem: "Token expired" (after 24 hours)

**Solution:**
- Automatic refresh should handle this
- If not working, clear localStorage and login again
- Check network interceptor is enabled in frontend/src/api/index.ts

### Problem: "Session doesn't persist on refresh"

**Solution:**
```bash
# 1. Check localStorage is enabled
# DevTools → Application → localStorage
# Should have: token, user

# 2. Check browser security not blocking localStorage
# Try private/incognito window
# Try different browser

# 3. Check AuthContext is wrapping App
# frontend/src/main.tsx should have <AuthProvider>
```

### Problem: "Sidebar shows wrong menu items"

**Solution:**
```bash
# 1. Clear browser cache
# DevTools → Application → Clear storage

# 2. Logout and login again

# 3. Check database role assignments
SELECT * FROM staff_role_map WHERE staff_id = 1;

# 4. Check roles_master has all 5 roles
SELECT * FROM roles_master;
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Change JWT_SECRET to strong random value (32+ chars)
- [ ] Change PIN_SALT to strong random value
- [ ] Set NODE_ENV=production
- [ ] Update VITE_API_URL to production backend domain
- [ ] Enable HTTPS/SSL on backend
- [ ] Configure CORS for frontend domain only
- [ ] Backup database before deploying
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting on /auth/login
- [ ] Enable 2FA for admin accounts (future feature)
- [ ] Test disaster recovery procedures

### Build for Production

```bash
# Build frontend
npm run build

# Backend pre-built for serving frontend in production
npm start
```

---

## 📈 Future Enhancements

- [ ] Two-factor authentication (2FA) for admin
- [ ] OAuth integration (Google, Azure AD, Okta)
- [ ] Biometric login support
- [ ] API rate limiting per user
- [ ] Advanced audit dashboard
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Backup & restore features
- [ ] Data export (PDF, Excel)
- [ ] Analytics & reporting dashboard

---

## 📞 Support & Documentation

- **Setup Guide:** See [SETUP.md](SETUP.md)
- **Testing Guide:** See [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)
- **API Tests:** Run `node test-auth-flow.js`
- **Backend Code:** `backend/src/controllers/authController.js`
- **Frontend State:** `frontend/src/context/AuthContext.tsx`

---

## 📄 License

This project is proprietary software for educational institutions.

**Version:** 1.0.0 (MVP - Auth System Complete)  
**Last Updated:** February 2026  
**Status:** Production Ready ✅
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
