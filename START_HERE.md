# 🎯 Timetable ERP - Unified Full-Stack Application

## Quick Start

### Development Mode (Frontend + Backend)
```bash
npm install
npm run dev
```

- Backend API: http://localhost:5000/api
- Frontend: http://localhost:3000

### Production Mode (Single Server)
```bash
npm install
npm run build
npm run start:production
```

- Everything at: http://localhost:5000

---

## 📦 Project Structure

This is a **unified monorepo** using npm workspaces:

```
timetable-erp/
├── backend/          # Express API server
├── frontend/         # React + TypeScript UI
├── node_modules/     # Shared dependencies (all packages)
└── package.json      # Root workspace configuration
```

**Key Features:**
- ✅ Single `node_modules` - no duplication
- ✅ Shared dependencies between frontend & backend
- ✅ Unified build and deployment process
- ✅ Production mode serves frontend from backend

---

## Available Commands

### Development
```bash
npm run dev              # Run both frontend & backend
npm run dev:backend      # Run only backend (port 5000)
npm run dev:frontend     # Run only frontend (port 3000)
```

### Building
```bash
npm run build            # Build frontend for production
npm run build:production # Clean + build everything
npm run clean            # Remove build outputs
```

### Production
```bash
npm run start            # Start backend only
npm run start:production # Start unified app (backend serves frontend)
```

### Testing & Validation
```bash
npm test                 # Run all tests
npm run check            # Validate entire project
npm run preview          # Preview production build
```

### Deployment
```bash
npm run deploy:prepare   # Prepare for deployment (clean + build)
```

### Pre-Push Validation
```bash
npm run pre-push         # Validate build before pushing to GitHub
```

**Note**: A git pre-push hook automatically runs the build before every push to prevent deployment crashes.

---

## 🚀 Deployment Options

### Option 1: Development (Recommended for Local)
Two separate servers for hot-reload:
```bash
npm run dev
```

### Option 2: Production (Single Server)
Backend serves the built frontend:
```bash
npm run build
npm run start:production
```
Access everything at http://localhost:5000

---

## 📊 Benefits of This Structure

1. **Unified Dependencies** - Install once, use everywhere
2. **Faster Builds** - No duplicate installations
3. **Less Disk Space** - Single node_modules (~145MB vs ~300MB)
4. **Simplified Deployment** - Single server in production
5. **Easy Maintenance** - Update packages once, applies to all
6. **Environment Aware** - Automatically adapts dev vs production

---

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

**That's it! Your complete Timetable ERP system is ready.** ✨
