-- Timetable ERP - Core Modules Schema
-- Migration: 003_core_modules.sql

-- ============================================
-- DEPARTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL UNIQUE,
  department_code VARCHAR(10) NOT NULL UNIQUE,
  hod_staff_id INTEGER REFERENCES staff(staff_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CLASSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS classes (
  class_id SERIAL PRIMARY KEY,
  class_name VARCHAR(50) NOT NULL,
  class_code VARCHAR(10) NOT NULL UNIQUE,
  section VARCHAR(5),
  department_id INTEGER NOT NULL REFERENCES departments(department_id),
  semester INT CHECK (semester BETWEEN 1 AND 8),
  total_students INT DEFAULT 0,
  class_teacher_id INTEGER REFERENCES staff(staff_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SUBJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subjects (
  subject_id SERIAL PRIMARY KEY,
  subject_name VARCHAR(100) NOT NULL,
  subject_code VARCHAR(20) NOT NULL UNIQUE,
  credits INT DEFAULT 4,
  semester INT CHECK (semester BETWEEN 1 AND 8),
  department_id INTEGER NOT NULL REFERENCES departments(department_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TIMESLOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS timeslots (
  timeslot_id SERIAL PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_name VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ROOMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS rooms (
  room_id SERIAL PRIMARY KEY,
  room_number VARCHAR(20) NOT NULL UNIQUE,
  room_type VARCHAR(50), -- 'Classroom', 'Lab', 'Seminar', 'Auditorium'
  capacity INT DEFAULT 30,
  floor INT,
  features TEXT, -- 'Projector', 'AC', 'Board', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
  student_id SERIAL PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  roll_number VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  phone_number VARCHAR(20),
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TEACHER-SUBJECT MAPPING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS teacher_subject_map (
  mapping_id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(staff_id),
  subject_id INTEGER NOT NULL REFERENCES subjects(subject_id),
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  academic_year VARCHAR(10), -- '2024-25'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, subject_id, class_id, academic_year)
);

-- ============================================
-- CLASS-SUBJECT MAPPING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS class_subject_map (
  mapping_id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  subject_id INTEGER NOT NULL REFERENCES subjects(subject_id),
  academic_year VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, subject_id, academic_year)
);

-- ============================================
-- TIMETABLE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS timetables (
  timetable_id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  subject_id INTEGER NOT NULL REFERENCES subjects(subject_id),
  staff_id INTEGER NOT NULL REFERENCES staff(staff_id),
  room_id INTEGER NOT NULL REFERENCES rooms(room_id),
  day_of_week VARCHAR(10), -- 'Monday', 'Tuesday', etc.
  timeslot_id INTEGER NOT NULL REFERENCES timeslots(timeslot_id),
  academic_year VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(student_id),
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  subject_id INTEGER NOT NULL REFERENCES subjects(subject_id),
  staff_id INTEGER NOT NULL REFERENCES staff(staff_id),
  attendance_date DATE NOT NULL,
  status VARCHAR(20), -- 'Present', 'Absent', 'Leave', 'Late'
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, class_id, subject_id, attendance_date)
);

-- ============================================
-- ATTENDANCE REPORT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance_reports (
  report_id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(student_id),
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  subject_id INTEGER NOT NULL REFERENCES subjects(subject_id),
  total_classes INT DEFAULT 0,
  present_count INT DEFAULT 0,
  absent_count INT DEFAULT 0,
  leave_count INT DEFAULT 0,
  attendance_percentage DECIMAL(5,2),
  academic_year VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, subject_id, academic_year)
);

-- ============================================
-- ROOM ALLOTMENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS room_allotments (
  allotment_id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  room_id INTEGER NOT NULL REFERENCES rooms(room_id),
  start_date DATE,
  end_date DATE,
  purpose VARCHAR(100), -- 'Regular Classes', 'Exams', 'Lab', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, room_id, start_date)
);

-- ============================================
-- HOLIDAYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS holidays (
  holiday_id SERIAL PRIMARY KEY,
  holiday_name VARCHAR(100) NOT NULL,
  holiday_date DATE NOT NULL,
  holiday_type VARCHAR(50), -- 'National', 'Cultural', 'Religious', 'Other'
  description TEXT,
  academic_year VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(holiday_date, academic_year)
);

-- ============================================
-- STAFF AVAILABILITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS staff_availability (
  availability_id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(staff_id),
  day_of_week VARCHAR(10),
  timeslot_id INTEGER NOT NULL REFERENCES timeslots(timeslot_id),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, day_of_week, timeslot_id)
);

-- ============================================
-- STAFF DEPARTMENT MAPPING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS staff_dept_map (
  mapping_id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(staff_id),
  department_id INTEGER NOT NULL REFERENCES departments(department_id),
  position VARCHAR(50), -- 'Assistant Professor', 'Associate Professor', 'Professor'
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, department_id)
);

-- ============================================
-- STUDENTS ROLE MAPPING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_role_map (
  mapping_id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(student_id),
  role_id INTEGER NOT NULL REFERENCES roles_master(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, role_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_rollno ON students(roll_number);

CREATE INDEX idx_timetable_class ON timetables(class_id);
CREATE INDEX idx_timetable_staff ON timetables(staff_id);
CREATE INDEX idx_timetable_day ON timetables(day_of_week);
CREATE INDEX idx_timetable_active ON timetables(is_active);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

CREATE INDEX idx_classes_dept ON classes(department_id);
CREATE INDEX idx_subjects_dept ON subjects(department_id);

CREATE INDEX idx_teacher_subject_staff ON teacher_subject_map(staff_id);
CREATE INDEX idx_teacher_subject_subject ON teacher_subject_map(subject_id);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert departments
INSERT INTO departments (department_name, department_code, hod_staff_id) VALUES
('Computer Science', 'CS', 1),
('Electronics', 'EC', 1),
('Mechanical', 'ME', 1),
('Civil', 'CE', 1)
ON CONFLICT DO NOTHING;

-- Insert timeslots
INSERT INTO timeslots (start_time, end_time, slot_name) VALUES
('09:00', '10:00', 'Slot 1'),
('10:00', '11:00', 'Slot 2'),
('11:00', '12:00', 'Slot 3'),
('12:00', '13:00', 'Slot 4'),
('13:30', '14:30', 'Slot 5'),
('14:30', '15:30', 'Slot 6'),
('15:30', '16:30', 'Slot 7')
ON CONFLICT DO NOTHING;

-- Insert rooms
INSERT INTO rooms (room_number, room_type, capacity, floor, features) VALUES
('101', 'Classroom', 30, 1, 'Projector,Board'),
('102', 'Classroom', 30, 1, 'Projector,AC'),
('103', 'Lab', 40, 1, 'Computers,Projector'),
('201', 'Classroom', 35, 2, 'Projector,AC,Board'),
('202', 'Seminar', 20, 2, 'Board'),
('203', 'Lab', 45, 2, 'Lab Equipment')
ON CONFLICT DO NOTHING;

-- Insert classes
INSERT INTO classes (class_name, class_code, section, department_id, semester, total_students, class_teacher_id) VALUES
('B.Tech CSE 1st Year', 'CSE-1A', 'A', 1, 1, 30, 1),
('B.Tech CSE 2nd Year', 'CSE-2A', 'A', 1, 3, 28, 1),
('B.Tech EC 1st Year', 'EC-1A', 'A', 2, 1, 32, 1),
('B.Tech ME 1st Year', 'ME-1A', 'A', 3, 1, 31, 1)
ON CONFLICT DO NOTHING;

-- Insert subjects
INSERT INTO subjects (subject_name, subject_code, credits, semester, department_id) VALUES
('Data Structures', 'CS101', 4, 1, 1),
('Web Development', 'CS102', 4, 1, 1),
('Database Systems', 'CS201', 4, 3, 1),
('Signals & Systems', 'EC101', 4, 1, 2),
('Digital Electronics', 'EC102', 4, 1, 2),
('Mechanical Design', 'ME101', 4, 1, 3)
ON CONFLICT DO NOTHING;

-- Insert students
INSERT INTO students (student_name, roll_number, email, phone_number, class_id, date_of_birth, gender, address) VALUES
('Aarav Kumar', 'CSE001', 'aarav@student.edu', '9876543210', 1, '2005-01-15', 'Male', 'Delhi'),
('Priya Singh', 'CSE002', 'priya@student.edu', '9876543211', 1, '2005-03-22', 'Female', 'Mumbai'),
('Rohan Patel', 'CSE003', 'rohan@student.edu', '9876543212', 1, '2005-05-10', 'Male', 'Bangalore'),
('Ananya Sharma', 'CSE004', 'ananya@student.edu', '9876543213', 1, '2005-07-18', 'Female', 'Pune'),
('Vikram Desai', 'CSE005', 'vikram@student.edu', '9876543214', 1, '2005-09-25', 'Male', 'Hyderabad')
ON CONFLICT DO NOTHING;

-- Insert teacher-subject mappings
INSERT INTO teacher_subject_map (staff_id, subject_id, class_id, academic_year) VALUES
(1, 1, 1, '2024-25'),
(1, 2, 1, '2024-25'),
(2, 3, 2, '2024-25'),
(2, 4, 3, '2024-25')
ON CONFLICT DO NOTHING;

-- Insert staff department mapping
INSERT INTO staff_dept_map (staff_id, department_id, position, start_date) VALUES
(1, 1, 'Professor', '2020-01-15'),
(2, 1, 'Assistant Professor', '2021-06-01')
ON CONFLICT DO NOTHING;

-- Insert timeslot entries
INSERT INTO timetables (class_id, subject_id, staff_id, room_id, day_of_week, timeslot_id, academic_year) VALUES
(1, 1, 1, 1, 'Monday', 1, '2024-25'),
(1, 2, 1, 2, 'Tuesday', 2, '2024-25'),
(1, 1, 1, 3, 'Wednesday', 3, '2024-25'),
(1, 2, 1, 1, 'Thursday', 1, '2024-25'),
(1, 1, 1, 2, 'Friday', 2, '2024-25')
ON CONFLICT DO NOTHING;

-- Insert holidays
INSERT INTO holidays (holiday_name, holiday_date, holiday_type, academic_year) VALUES
('Republic Day', '2025-01-26', 'National', '2024-25'),
('Holi', '2025-03-14', 'Religious', '2024-25'),
('Summer Vacation', '2025-05-01', 'Other', '2024-25'),
('Diwali', '2025-10-31', 'Religious', '2024-25')
ON CONFLICT DO NOTHING;

-- Insert rooms allotment
INSERT INTO room_allotments (class_id, room_id, start_date, purpose) VALUES
(1, 1, '2025-01-20', 'Regular Classes'),
(1, 3, '2025-01-21', 'Lab'),
(2, 2, '2025-01-20', 'Regular Classes'),
(3, 4, '2025-01-20', 'Regular Classes')
ON CONFLICT DO NOTHING;

-- Insert staff availability
INSERT INTO staff_availability (staff_id, day_of_week, timeslot_id, is_available) VALUES
(1, 'Monday', 1, true),
(1, 'Monday', 2, true),
(1, 'Tuesday', 1, true),
(1, 'Wednesday', 2, true),
(2, 'Monday', 3, true),
(2, 'Tuesday', 3, true)
ON CONFLICT DO NOTHING;
