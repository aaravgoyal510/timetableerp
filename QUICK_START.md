# 🚀 Quick Start Guide - Timetable ERP System

Your system is ready! Follow these steps to get it running.

## Prerequisites Checklist
- ✅ Node.js installed (v16+)
- ✅ npm installed
- ✅ Supabase credentials in `.env` files ✓ (Already configured)
- ✅ Database tables already created ✓ (Already in Supabase)
- ✅ Internet connection

## Step-by-Step Setup

### 1️⃣ Install Dependencies & Start Backend

**Option A: Windows (Easy)**
```bash
setup.bat
```

**Option B: Manual Setup**
```bash
cd backend
npm install
npm run dev
```

✅ **Backend running on http://localhost:5000**

---

### 2️⃣ Start Frontend (New Terminal Window)

```bash
cd frontend
npm install
npm run dev
```

✅ **Frontend running on http://localhost:3000**

---

### 3️⃣ Access Your Application

Open your browser:
```
http://localhost:3000
```

🎉 **You're all set!**

---

## 📋 What You Can Do Now

| Feature | Details |
|---------|---------|
| 👨‍🎓 **Students** | Add, view, and manage student records |
| 👨‍🏫 **Staff** | Manage faculty members and their details |
| 🏫 **Classes** | Create and organize classes |
| 📚 **Subjects** | Manage course subjects |
| ⏰ **Timeslots** | Schedule class time slots |
| 🚪 **Rooms** | Manage classroom inventory |
| 📅 **Timetable** | Create and view timetables |
| ✓ **Attendance** | Mark and track attendance |
| 🔑 **Room Allotment** | Allocate rooms for classes |
| 🎉 **Holidays** | Manage academic holidays |
| 👥 **Roles** | Manage user roles |

---

## 🔧 Project Structure

```
chaubey/
├── backend/                 # Node.js API Server
│   ├── src/
│   │   ├── controllers/    # Business Logic
│   │   ├── routes/         # API Endpoints
│   │   └── server.js       # Main Server
│   ├── package.json
│   └── .env               # Configuration
│
├── frontend/              # React Application
│   ├── src/
│   │   ├── api/          # API Client
│   │   ├── pages/        # Page Components
│   │   └── main.tsx      # Entry Point
│   ├── package.json
│   └── .env              # Configuration
│
├── DATABASE_SCHEMA.sql   # Database Setup
├── SAMPLE_DATA.sql       # Optional Test Data
└── README.md             # Full Documentation
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/`:

```
GET    /students           # Get all students
POST   /students           # Create student
PUT    /students/{id}      # Update student
DELETE /students/{id}      # Delete student

GET    /staff              # Get all staff
POST   /staff              # Create staff
... (similar pattern for all modules)

/classes, /subjects, /timeslots, /rooms, /timetable, 
/attendance, /room-allotment, /holidays, /roles
```

---

## ⚠️ Troubleshooting

### Port Already in Use

**Backend Port 5000 is in use:**
```bash
# Change in backend/.env
PORT=5001
```

**Frontend Port 3000 is in use:**
```bash
# Change in frontend/vite.config.ts
server: { port: 3001 }
```

### Database Connection Error

1. Check `.env` file has correct credentials
2. Verify Supabase URL and Key
3. Check if database schema is created
4. Run `DATABASE_SCHEMA.sql` again

### API Connection Failed

1. Backend must be running (`npm run dev`)
2. Check API URL in `frontend/src/api/index.ts`
3. Ensure port 5000 is accessible
4. Check browser console for error details

### npm install fails

```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# If still fails, delete node_modules and try again
rm -rf node_modules
npm install
```

---

## 📞 API Configuration

**Backend API:** `http://localhost:5000/api`

**Frontend connects to:**
```
REACT_APP_API_URL=http://localhost:5000/api
```
(Configured in frontend/.env)

---

## 📊 Database Info

- **Provider:** Supabase (PostgreSQL)
- **Tables:** 11 main tables + 3 mapping tables
- **Features:** RLS ready, Indexes for performance
- **Backup:** Automatic in Supabase

---

## 🎯 Next Steps

After everything is working:

1. **Add Real Data:** Use the UI to add your institution data
2. **Create Users:** Set up admin accounts via roles
3. **Customize:** Modify theme colors in `tailwind.config.js`
4. **Deploy:** Ready for production deployment

---

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 💡 Tips

- Use browser DevTools (F12) to check API calls
- Check backend console for errors
- Sample data helps test features quickly
- Explore Supabase SQL Editor for database queries

---

**Happy Coding! 🚀**

For issues or questions, check the README.md file for more details.
