// API Types for Timetable ERP System

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Student
export interface Student {
  student_id?: number;
  roll_number: string;
  student_name: string;
  email: string;
  phone_number: string | number;
  admission_year: number;
  batch: string;
  class_id: number;
  is_active?: boolean;
}

// Staff
export interface Staff {
  staff_id?: number;
  staff_name: string;
  email: string;
  phone_number: string;
  department_id: number;
  designation: string;
  staff_type: string;
  is_active?: boolean;
}

// Class
export interface Class {
  class_id?: number;
  course_name: string;
  semester: number;
  section: string;
  academic_year: string;
  shift: string;
  student_count?: number;
  is_active?: boolean;
}

// Subject
export interface Subject {
  subject_code: string;
  subject_name: string;
  course_name: string;
  department_id: number;
  semester: number;
  credits: number;
  hours_per_week: number;
  is_lab: boolean;
  duration_years: number;
  is_active?: boolean;
}

// Timeslot
export interface Timeslot {
  timeslot_id?: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_number: number;
  is_break: boolean;
  shift: string;
}

// Room
export interface Room {
  room_id?: number;
  room_number: string;
  room_type: string;
  block_name: string;
  floor_number: number;
  capacity: number;
  has_projector: boolean;
  has_ac: boolean;
  computer_count: number;
  availability_status: string;
  is_active?: boolean;
}

// Timetable
export interface Timetable {
  timetable_id?: number;
  class_id: number;
  subject_code: string;
  staff_id: number;
  room_id: number;
  timeslot_id: number;
  timetable_date: string;
  is_lab: boolean;
}

// Attendance
export interface Attendance {
  attendance_id?: number;
  student_id: number;
  class_id: number;
  subject_code: string;
  staff_id: number;
  timeslot_id: number;
  attendance_date: string;
  status: string;
}

// Room Allotment
export interface RoomAllotment {
  booking_id?: number;
  room_id: number;
  class_id: number;
  staff_id: number;
  subject_code: string;
  timeslot_id: number;
  allotment_date: string;
}

// Holiday
export interface Holiday {
  holiday_id?: number;
  holiday_date: string;
  holiday_name: string;
}

// Role
export interface Role {
  role_id?: number;
  role_name: string;
  role_description: string;
  is_active?: boolean;
}

// Department
export interface Department {
  department_id?: number;
  name: string;
}

// Staff Role Map
export interface StaffRoleMap {
  staff_role_map_id?: number;
  staff_id: number;
  role_id: number;
  staff_name?: string;
  role_name?: string;
  is_active?: boolean;
}

// Staff Department Map
export interface StaffDeptMap {
  staff_dept_map_id?: number;
  staff_id: number;
  department_id: number;
  staff_name?: string;
  department_name?: string;
  is_active?: boolean;
}

// Student Role Map
export interface StudentRoleMap {
  student_role_map_id?: number;
  student_id: number;
  role_id: number;
  student_name?: string;
  role_name?: string;
  is_active?: boolean;
}

// Teacher Subject Map
export interface TeacherSubjectMap {
  teacher_subject_map_id?: number;
  staff_id: number;
  subject_id: number;
  staff_name?: string;
  subject_name?: string;
  subject_code?: string;
  is_active?: boolean;
}

// Staff Availability
export interface StaffAvailability {
  availability_id?: number;
  staff_id: number;
  timeslot_id: number;
  is_recurring: boolean;
  day_of_week?: string;
  date?: string;
  reason?: string;
  is_active?: boolean;
}

// Generic entity for pages that need dynamic typing
export type EntityData = Record<string, string | number | boolean | undefined>;
