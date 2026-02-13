const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const coreController = require('../controllers/coreController');

// All routes require authentication
router.use(verifyToken);

// ============================================
// DASHBOARD ROUTES
// ============================================
router.get('/dashboard/stats', coreController.getDashboardStats);

// ============================================
// STUDENTS ROUTES
// ============================================
// GET students (visible to: Admin, HOD, Faculty)
router.get('/students', coreController.getStudents);
router.get('/students/:id', coreController.getStudentById);

// POST/PUT students (only Admin and HOD)
router.post('/students', requireRole('Admin', 'HOD'), coreController.createStudent);
router.put('/students/:id', requireRole('Admin', 'HOD'), coreController.updateStudent);

// ============================================
// STAFF ROUTES
// ============================================
// GET staff (visible to: Admin, HOD)
router.get('/staff', coreController.getStaff);
router.get('/staff/:id', coreController.getStaffById);

// ============================================
// CLASSES ROUTES
// ============================================
// GET classes
router.get('/classes', coreController.getClasses);

// POST/PUT classes (only Admin and HOD)
router.post('/classes', requireRole('Admin', 'HOD'), coreController.createClass);

// ============================================
// SUBJECTS ROUTES
// ============================================
// GET subjects
router.get('/subjects', coreController.getSubjects);

// ============================================
// TIMETABLE ROUTES
// ============================================
// GET timetable (visible to all)
router.get('/timetable', coreController.getTimetable);

// POST timetable (only Admin)
router.post('/timetable', requireRole('Admin'), coreController.createTimetable);

// ============================================
// ATTENDANCE ROUTES
// ============================================
// GET attendance records (visible to: Admin, Faculty, HOD)
router.get('/attendance', coreController.getAttendance);

// POST mark attendance (only Faculty and teachers)
router.post('/attendance/mark', requireRole('Admin', 'Faculty'), coreController.markAttendance);

// GET attendance reports
router.get('/attendance/reports', coreController.getAttendanceReport);

// ============================================
// ROOMS ROUTES
// ============================================
// GET rooms (visible to all)
router.get('/rooms', coreController.getRooms);

// ============================================
// HOLIDAYS ROUTES
// ============================================
// GET holidays
router.get('/holidays', coreController.getHolidays);

// POST holidays (only Admin)
router.post('/holidays', requireRole('Admin'), coreController.createHoliday);

// ============================================
// DEPARTMENTS ROUTES
// ============================================
// GET departments
router.get('/departments', coreController.getDepartments);

// POST departments (only Admin)
router.post('/departments', requireRole('Admin'), coreController.createDepartment);

module.exports = router;
