require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
let authRoutes, coreRoutes, studentRoutes, staffRoutes, classRoutes, subjectRoutes, timeslotRoutes, 
  roomRoutes, timetableRoutes, attendanceRoutes, roomAllotmentRoutes, 
  holidayRoutes, roleRoutes, staffRoleMapRoutes, studentRoleMapRoutes, teacherSubjectMapRoutes,
  departmentRoutes, staffDeptMapRoutes, staffAvailabilityRoutes;

try {
  authRoutes = require('./routes/auth');
  coreRoutes = require('./routes/coreRoutes');
  studentRoutes = require('./routes/students');
  staffRoutes = require('./routes/staff');
  classRoutes = require('./routes/classes');
  subjectRoutes = require('./routes/subjects');
  timeslotRoutes = require('./routes/timeslots');
  roomRoutes = require('./routes/rooms');
  timetableRoutes = require('./routes/timetable');
  attendanceRoutes = require('./routes/attendance');
  roomAllotmentRoutes = require('./routes/roomAllotment');
  holidayRoutes = require('./routes/holidays');
  roleRoutes = require('./routes/roles');
  staffRoleMapRoutes = require('./routes/staffRoleMap');
  studentRoleMapRoutes = require('./routes/studentRoleMap');
  teacherSubjectMapRoutes = require('./routes/teacherSubjectMap');
  departmentRoutes = require('./routes/departments');
  staffDeptMapRoutes = require('./routes/staffDeptMap');
  staffAvailabilityRoutes = require('./routes/staffAvailability');
} catch (err) {
  console.error('Error loading routes:', err.message);
}

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend build in production
if (isProduction) {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  console.log(`📦 Serving frontend from: ${frontendPath}`);
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);  // Main API routes (students, classes, timetable, etc.)
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timeslots', timeslotRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/room-allotment', roomAllotmentRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/staff-role-map', staffRoleMapRoutes);
app.use('/api/student-role-map', studentRoleMapRoutes);
app.use('/api/teacher-subject-map', teacherSubjectMapRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/staff-dept-map', staffDeptMapRoutes);
app.use('/api/staff-availability', staffAvailabilityRoutes);

// Serve frontend for all non-API routes in production
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Timetable ERP Server`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`⚡ API: http://localhost:${PORT}/api`);
  if (isProduction) {
    console.log(`📱 Frontend: http://localhost:${PORT}`);
  }
});
