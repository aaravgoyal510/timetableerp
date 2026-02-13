# 🎯 JUST RUN THIS ONE COMMAND

## Quick Start
```bash
npm install && npm run dev
```

This installs all dependencies in one place and starts both backend (port 5000) and frontend (port 3000) together!

## Open Browser
```
http://localhost:3000
```

---

## 📦 Workspace Structure

This project uses **npm workspaces** - all dependencies are installed at the root level and shared between frontend and backend. This saves disk space and makes dependency management simpler!

**Benefits:**
- ✅ Single `npm install` for everything
- ✅ No duplicate node_modules
- ✅ Faster installation
- ✅ Easier dependency management

---

## Alternative: Run Separately

If you prefer to run them separately:

### Backend Only
```bash
npm run dev:backend
```

### Frontend Only
```bash
npm run dev:frontend
```

---

**That's all! Your complete Timetable ERP is running.** ✨

## Available Commands

- `npm install` - Install all dependencies (frontend & backend)
- `npm run dev` - Run both frontend & backend
- `npm run dev:backend` - Run only backend
- `npm run dev:frontend` - Run only frontend
- `npm run build` - Build frontend for production
- `npm run start` - Start backend in production mode
