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
  Holiday,
  Role,
  StaffRoleMap,
  StudentRoleMap,
  TeacherSubjectMap,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Students API
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id: number) => api.get(`/students/${id}`),
  create: (data: Omit<Student, 'student_id'>) => api.post('/students', data),
  update: (id: number, data: Partial<Student>) => api.put(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// Staff API
export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id: number) => api.get(`/staff/${id}`),
  create: (data: Omit<Staff, 'staff_id'>) => api.post('/staff', data),
  update: (id: number, data: Partial<Staff>) => api.put(`/staff/${id}`, data),
  delete: (id: number) => api.delete(`/staff/${id}`),
};

// Classes API
export const classAPI = {
  getAll: () => api.get('/classes'),
  getById: (id: number) => api.get(`/classes/${id}`),
  create: (data: Omit<Class, 'class_id'>) => api.post('/classes', data),
  update: (id: number, data: Partial<Class>) => api.put(`/classes/${id}`, data),
  delete: (id: number) => api.delete(`/classes/${id}`),
};

// Subjects API
export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  getByCode: (code: string) => api.get(`/subjects/${code}`),
  create: (data: Subject) => api.post('/subjects', data),
  update: (code: string, data: Partial<Subject>) => api.put(`/subjects/${code}`, data),
  delete: (code: string) => api.delete(`/subjects/${code}`),
};

// Timeslots API
export const timeslotAPI = {
  getAll: () => api.get('/timeslots'),
  getById: (id: number) => api.get(`/timeslots/${id}`),
  create: (data: Omit<Timeslot, 'timeslot_id'>) => api.post('/timeslots', data),
  update: (id: number, data: Partial<Timeslot>) => api.put(`/timeslots/${id}`, data),
  delete: (id: number) => api.delete(`/timeslots/${id}`),
};

// Rooms API
export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id: number) => api.get(`/rooms/${id}`),
  create: (data: Omit<Room, 'room_id'>) => api.post('/rooms', data),
  update: (id: number, data: Partial<Room>) => api.put(`/rooms/${id}`, data),
  delete: (id: number) => api.delete(`/rooms/${id}`),
};

// Timetable API
export const timetableAPI = {
  getAll: () => api.get('/timetable'),
  getById: (id: number) => api.get(`/timetable/${id}`),
  getByClass: (classId: number) => api.get(`/timetable/class/${classId}`),
  create: (data: Omit<Timetable, 'timetable_id'>) => api.post('/timetable', data),
  update: (id: number, data: Partial<Timetable>) => api.put(`/timetable/${id}`, data),
  delete: (id: number) => api.delete(`/timetable/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getById: (id: number) => api.get(`/attendance/${id}`),
  getByStudent: (studentId: number) => api.get(`/attendance/student/${studentId}`),
  create: (data: Omit<Attendance, 'attendance_id'>) => api.post('/attendance', data),
  update: (id: number, data: Partial<Attendance>) => api.put(`/attendance/${id}`, data),
  delete: (id: number) => api.delete(`/attendance/${id}`),
};

// Room Allotment API
export const roomAllotmentAPI = {
  getAll: () => api.get('/room-allotment'),
  getById: (id: number) => api.get(`/room-allotment/${id}`),
  create: (data: Omit<RoomAllotment, 'booking_id'>) => api.post('/room-allotment', data),
  update: (id: number, data: Partial<RoomAllotment>) => api.put(`/room-allotment/${id}`, data),
  delete: (id: number) => api.delete(`/room-allotment/${id}`),
};

// Holidays API
export const holidayAPI = {
  getAll: () => api.get('/holidays'),
  getById: (id: number) => api.get(`/holidays/${id}`),
  create: (data: Omit<Holiday, 'holiday_id'>) => api.post('/holidays', data),
  update: (id: number, data: Partial<Holiday>) => api.put(`/holidays/${id}`, data),
  delete: (id: number) => api.delete(`/holidays/${id}`),
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
