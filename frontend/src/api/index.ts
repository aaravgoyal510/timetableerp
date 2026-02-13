import axios from 'axios';
import type {
  Student,
  Staff,
  Class,
  Subject,
  Timeslot,
  Room,
  Timetable,
  Attendance,
  RoomAllotment,
  Department,
  StaffDeptMap,
  StaffAvailability,
  Holiday,
  Role,
  StaffRoleMap,
  StudentRoleMap,
  TeacherSubjectMap,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (staff_id: number, pin: string) => {
    const authClient = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
    return authClient.post('/auth/login', { staff_id, pin });
  },
  refresh: (refreshToken: string) => {
    const authClient = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });
    return authClient.post('/auth/refresh', { refreshToken });
  },
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
};

// ============================================
// LEGACY API (Keep for backward compatibility)
// ============================================

// Timeslots API
export const timeslotAPI = {
  getAll: () => api.get('/timeslots'),
  getById: (id: number) => api.get(`/timeslots/${id}`),
  create: (data: Omit<Timeslot, 'timeslot_id'>) => api.post('/timeslots', data),
  update: (id: number, data: Partial<Timeslot>) => api.put(`/timeslots/${id}`, data),
  delete: (id: number) => api.delete(`/timeslots/${id}`),
};

// Room Allotment API
export const roomAllotmentAPI = {
  getAll: () => api.get('/room-allotment'),
  getById: (id: number) => api.get(`/room-allotment/${id}`),
  create: (data: Omit<RoomAllotment, 'booking_id'>) => api.post('/room-allotment', data),
  update: (id: number, data: Partial<RoomAllotment>) => api.put(`/room-allotment/${id}`, data),
  delete: (id: number) => api.delete(`/room-allotment/${id}`),
};

// Roles API
export const roleAPI = {
  getAll: () => api.get('/roles'),
  getById: (id: number) => api.get(`/roles/${id}`),
  create: (data: Omit<Role, 'role_id'>) => api.post('/roles', data),
  update: (id: number, data: Partial<Role>) => api.put(`/roles/${id}`, data),
  delete: (id: number) => api.delete(`/roles/${id}`),
};

// Staff Role Mapping API
export const staffRoleMapAPI = {
  getAll: () => api.get('/staff-role-map'),
  getById: (id: number) => api.get(`/staff-role-map/${id}`),
  create: (data: Omit<StaffRoleMap, 'staff_role_map_id'>) => api.post('/staff-role-map', data),
  update: (id: number, data: Partial<StaffRoleMap>) => api.put(`/staff-role-map/${id}`, data),
  delete: (id: number) => api.delete(`/staff-role-map/${id}`),
};

// Student Role Mapping API
export const studentRoleMapAPI = {
  getAll: () => api.get('/student-role-map'),
  getById: (id: number) => api.get(`/student-role-map/${id}`),
  create: (data: Omit<StudentRoleMap, 'student_role_map_id'>) => api.post('/student-role-map', data),
  update: (id: number, data: Partial<StudentRoleMap>) => api.put(`/student-role-map/${id}`, data),
  delete: (id: number) => api.delete(`/student-role-map/${id}`),
};

// Teacher Subject Mapping API
export const teacherSubjectMapAPI = {
  getAll: () => api.get('/teacher-subject-map'),
  getById: (id: number) => api.get(`/teacher-subject-map/${id}`),
  create: (data: Omit<TeacherSubjectMap, 'teacher_subject_map_id'>) => api.post('/teacher-subject-map', data),
  update: (id: number, data: Partial<TeacherSubjectMap>) => api.put(`/teacher-subject-map/${id}`, data),
  delete: (id: number) => api.delete(`/teacher-subject-map/${id}`),
};
// ============================================
// DASHBOARD API
// ============================================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// ============================================
// STUDENTS API (Comprehensive)
// ============================================
export const studentsAPI = {
  getAll: (classId?: number) => api.get('/students', { params: { class_id: classId } }),
  getById: (id: number) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: number, data: any) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// ============================================
// STAFF API (Comprehensive)
// ============================================
export const staffAPI = {
  getAll: (departmentId?: number) => api.get('/staff', { params: { department_id: departmentId } }),
  getById: (id: number) => api.get(`/staff/${id}`),
  create: (data: any) => api.post('/staff', data),
  update: (id: number, data: any) => api.put(`/staff/${id}`, data),
};

// ============================================
// CLASSES API (Comprehensive)
// ============================================
export const classesAPI = {
  getAll: (departmentId?: number) => api.get('/classes', { params: { department_id: departmentId } }),
  getById: (id: number) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: number, data: any) => api.put(`/classes/${id}`, data),
};

// ============================================
// SUBJECTS API (Comprehensive)
// ============================================
export const subjectsAPI = {
  getAll: (departmentId?: number, semester?: number) => 
    api.get('/subjects', { params: { department_id: departmentId, semester } }),
  getById: (id: number) => api.get(`/subjects/${id}`),
  create: (data: any) => api.post('/subjects', data),
  update: (id: number, data: any) => api.put(`/subjects/${id}`, data),
};

// ============================================
// TIMETABLE API (Comprehensive)
// ============================================
export const timetableAPI = {
  getAll: (classId?: number, staffId?: number, dayOfWeek?: string, academicYear?: string) =>
    api.get('/timetable', { params: { class_id: classId, staff_id: staffId, day_of_week: dayOfWeek, academic_year: academicYear } }),
  getById: (id: number) => api.get(`/timetable/${id}`),
  create: (data: any) => api.post('/timetable', data),
  update: (id: number, data: any) => api.put(`/timetable/${id}`, data),
};

// ============================================
// ATTENDANCE API (Comprehensive)
// ============================================
export const attendanceAPI = {
  getAll: (studentId?: number, classId?: number, subjectId?: number, date?: string) =>
    api.get('/attendance', { params: { student_id: studentId, class_id: classId, subject_id: subjectId, attendance_date: date } }),
  mark: (data: any) => api.post('/attendance/mark', data),
  getReports: (studentId?: number, academicYear?: string) =>
    api.get('/attendance/reports', { params: { student_id: studentId, academic_year: academicYear } }),
};

// ============================================
// ROOMS API (Comprehensive)
// ============================================
export const roomsAPI = {
  getAll: (roomType?: string, isAvailable?: boolean) =>
    api.get('/rooms', { params: { room_type: roomType, is_available: isAvailable } }),
  getById: (id: number) => api.get(`/rooms/${id}`),
  create: (data: any) => api.post('/rooms', data),
  update: (id: number, data: any) => api.put(`/rooms/${id}`, data),
};

// ============================================
// HOLIDAYS API (Comprehensive)
// ============================================
export const holidaysAPI = {
  getAll: (academicYear?: string) => api.get('/holidays', { params: { academic_year: academicYear } }),
  getById: (id: number) => api.get(`/holidays/${id}`),
  create: (data: any) => api.post('/holidays', data),
  update: (id: number, data: any) => api.put(`/holidays/${id}`, data),
  delete: (id: number) => api.delete(`/holidays/${id}`),
};

// ============================================
// DEPARTMENTS API (Comprehensive)
// ============================================
export const departmentsAPI = {
  getAll: () => api.get('/departments'),
  getById: (id: number) => api.get(`/departments/${id}`),
  create: (data: any) => api.post('/departments', data),
  update: (id: number, data: any) => api.put(`/departments/${id}`, data),
  delete: (id: number) => api.delete(`/departments/${id}`),
};

// ============================================
// STAFF AVAILABILITY API (Placeholder)
// ============================================
export const staffAvailabilityAPI = {
  getAll: () => api.get('/staff-availability'),
  create: (data: any) => api.post('/staff-availability', data),
  delete: (id: number) => api.delete(`/staff-availability/${id}`),
};

// ============================================
// STAFF DEPARTMENT MAPPING API (Placeholder)
// ============================================
export const staffDeptMapAPI = {
  getAll: () => api.get('/staff-dept-map'),
  create: (data: any) => api.post('/staff-dept-map', data),
  delete: (id: number) => api.delete(`/staff-dept-map/${id}`),
};