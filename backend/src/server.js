require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
let studentRoutes, staffRoutes, classRoutes, subjectRoutes, timeslotRoutes, 
    roomRoutes, timetableRoutes, attendanceRoutes, roomAllotmentRoutes, 
    holidayRoutes, roleRoutes;

try {
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
} catch (err) {
  console.error('Error loading routes:', err.message);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Routes
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
