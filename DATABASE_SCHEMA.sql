-- ⚠️ NOTE: Tables already exist in Supabase
-- This file is kept for reference/backup only
-- DO NOT run this unless you want to recreate all tables
-- Your tables are already created and data is ready to use

-- Schema Reference (DO NOT RUN):
-- Create sequences
CREATE SEQUENCE IF NOT EXISTS attendance_attendance_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS attendance_audit_log_log_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS classes_class_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS holidays_holiday_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS roles_master_role_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS room_bookings_booking_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS rooms_room_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS staff_staff_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS students_student_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS timeslots_timeslot_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS timetable_timetable_id_seq START 1;

-- Role Masters Table
CREATE TABLE IF NOT EXISTS public.roles_master (
  role_id integer NOT NULL DEFAULT nextval('roles_master_role_id_seq'::regclass),
  role_name character varying NOT NULL UNIQUE,
  role_description text,
  is_active boolean DEFAULT true,
  CONSTRAINT roles_master_pkey PRIMARY KEY (role_id)
);

-- Students Table
CREATE TABLE IF NOT EXISTS public.students (
  student_id integer NOT NULL DEFAULT nextval('students_student_id_seq'::regclass),
  roll_number character varying NOT NULL UNIQUE,
  student_name character varying NOT NULL,
  email character varying UNIQUE,
  phone_number numeric,
  admission_year integer NOT NULL,
  batch character varying,
  is_active boolean DEFAULT true,
  CONSTRAINT students_pkey PRIMARY KEY (student_id)
);

-- Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
  staff_id integer NOT NULL DEFAULT nextval('staff_staff_id_seq'::regclass),
  staff_name character varying NOT NULL,
  email character varying UNIQUE,
  phone_number character varying,
  department_id integer,
  designation character varying,
  staff_type character varying NOT NULL CHECK (staff_type::text = ANY (ARRAY['Permanent'::character varying, 'Visiting'::character varying]::text[])),
  is_active boolean DEFAULT true,
  CONSTRAINT staff_pkey PRIMARY KEY (staff_id)
);

-- Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  class_id integer NOT NULL DEFAULT nextval('classes_class_id_seq'::regclass),
  course_name character varying NOT NULL,
  semester integer NOT NULL,
  section character varying,
  academic_year character varying NOT NULL,
  shift character varying CHECK (shift::text = ANY (ARRAY['Morning'::character varying, 'Evening'::character varying]::text[])),
  is_active boolean DEFAULT true,
  CONSTRAINT classes_pkey PRIMARY KEY (class_id)
);

-- Subjects Master Table
CREATE TABLE IF NOT EXISTS public.subjects_master (
  subject_code character varying NOT NULL,
  subject_name character varying NOT NULL,
  course_name character varying NOT NULL,
  department_id integer,
  semester integer NOT NULL,
  credits integer,
  hours_per_week integer NOT NULL,
  is_lab boolean DEFAULT false,
  duration_years integer,
  is_active boolean DEFAULT true,
  CONSTRAINT subjects_master_pkey PRIMARY KEY (subject_code)
);

-- Timeslots Table
CREATE TABLE IF NOT EXISTS public.timeslots (
  timeslot_id integer NOT NULL DEFAULT nextval('timeslots_timeslot_id_seq'::regclass),
  day_of_week character varying NOT NULL CHECK (day_of_week::text = ANY (ARRAY['Monday'::character varying, 'Tuesday'::character varying, 'Wednesday'::character varying, 'Thursday'::character varying, 'Friday'::character varying, 'Saturday'::character varying]::text[])),
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  slot_number integer NOT NULL,
  is_break boolean DEFAULT false,
  shift character varying NOT NULL CHECK (shift::text = ANY (ARRAY['Morning'::character varying, 'Evening'::character varying]::text[])),
  CONSTRAINT timeslots_pkey PRIMARY KEY (timeslot_id)
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  room_id integer NOT NULL DEFAULT nextval('rooms_room_id_seq'::regclass),
  room_number character varying NOT NULL,
  room_type character varying,
  block_name character varying,
  floor_number integer,
  capacity integer,
  has_projector boolean DEFAULT false,
  has_ac boolean DEFAULT false,
  computer_count integer DEFAULT 0,
  availability_status character varying DEFAULT 'Free'::character varying CHECK (availability_status::text = ANY (ARRAY['Free'::character varying, 'Occupied'::character varying]::text[])),
  is_active boolean DEFAULT true,
  CONSTRAINT rooms_pkey PRIMARY KEY (room_id)
);

-- Timetable Table
CREATE TABLE IF NOT EXISTS public.timetable (
  timetable_id integer NOT NULL DEFAULT nextval('timetable_timetable_id_seq'::regclass),
  class_id integer,
  subject_code character varying,
  staff_id integer,
  room_id integer,
  timeslot_id integer,
  timetable_date date NOT NULL,
  is_lab boolean DEFAULT false,
  CONSTRAINT timetable_pkey PRIMARY KEY (timetable_id),
  CONSTRAINT timetable_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(class_id),
  CONSTRAINT timetable_subject_code_fkey FOREIGN KEY (subject_code) REFERENCES public.subjects_master(subject_code),
  CONSTRAINT timetable_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id),
  CONSTRAINT timetable_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(room_id),
  CONSTRAINT timetable_timeslot_id_fkey FOREIGN KEY (timeslot_id) REFERENCES public.timeslots(timeslot_id)
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  attendance_id integer NOT NULL DEFAULT nextval('attendance_attendance_id_seq'::regclass),
  student_id integer,
  class_id integer,
  subject_code character varying,
  staff_id integer,
  timeslot_id integer,
  attendance_date date NOT NULL,
  status character varying CHECK (status::text = ANY (ARRAY['Present'::character varying, 'Absent'::character varying]::text[])),
  CONSTRAINT attendance_pkey PRIMARY KEY (attendance_id),
  CONSTRAINT attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id),
  CONSTRAINT attendance_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(class_id),
  CONSTRAINT attendance_subject_code_fkey FOREIGN KEY (subject_code) REFERENCES public.subjects_master(subject_code),
  CONSTRAINT attendance_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id),
  CONSTRAINT attendance_timeslot_id_fkey FOREIGN KEY (timeslot_id) REFERENCES public.timeslots(timeslot_id)
);

-- Attendance Audit Log Table
CREATE TABLE IF NOT EXISTS public.attendance_audit_log (
  log_id integer NOT NULL DEFAULT nextval('attendance_audit_log_log_id_seq'::regclass),
  attendance_id integer,
  changed_by integer,
  change_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  old_status character varying,
  new_status character varying,
  CONSTRAINT attendance_audit_log_pkey PRIMARY KEY (log_id),
  CONSTRAINT attendance_audit_log_attendance_id_fkey FOREIGN KEY (attendance_id) REFERENCES public.attendance(attendance_id),
  CONSTRAINT attendance_audit_log_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.staff(staff_id)
);

-- Room Allotment Table
CREATE TABLE IF NOT EXISTS public.room_allotment (
  booking_id integer NOT NULL DEFAULT nextval('room_bookings_booking_id_seq'::regclass),
  room_id integer,
  class_id integer,
  staff_id integer,
  subject_code character varying,
  timeslot_id integer,
  allotment_date date NOT NULL,
  CONSTRAINT room_allotment_pkey PRIMARY KEY (booking_id),
  CONSTRAINT room_bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(room_id),
  CONSTRAINT room_bookings_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(class_id),
  CONSTRAINT room_bookings_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id),
  CONSTRAINT room_bookings_subject_code_fkey FOREIGN KEY (subject_code) REFERENCES public.subjects_master(subject_code),
  CONSTRAINT room_bookings_timeslot_id_fkey FOREIGN KEY (timeslot_id) REFERENCES public.timeslots(timeslot_id)
);

-- Holidays Table
CREATE TABLE IF NOT EXISTS public.holidays (
  holiday_id integer NOT NULL DEFAULT nextval('holidays_holiday_id_seq'::regclass),
  holiday_date date NOT NULL UNIQUE,
  holiday_name character varying,
  CONSTRAINT holidays_pkey PRIMARY KEY (holiday_id)
);

-- Staff Role Mapping Table
CREATE TABLE IF NOT EXISTS public.staff_role_map (
  staff_id integer NOT NULL,
  role_id integer NOT NULL,
  assigned_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT staff_role_map_pkey PRIMARY KEY (staff_id, role_id),
  CONSTRAINT staff_role_map_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id),
  CONSTRAINT staff_role_map_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles_master(role_id)
);

-- Student Role Mapping Table
CREATE TABLE IF NOT EXISTS public.student_role_map (
  student_id integer NOT NULL,
  role_id integer NOT NULL,
  assigned_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT student_role_map_pkey PRIMARY KEY (student_id),
  CONSTRAINT student_role_map_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(student_id),
  CONSTRAINT student_role_map_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles_master(role_id)
);

-- Teacher Subject Mapping Table
CREATE TABLE IF NOT EXISTS public.teacher_subject_map (
  staff_id integer NOT NULL,
  subject_code character varying NOT NULL,
  CONSTRAINT teacher_subject_map_pkey PRIMARY KEY (staff_id, subject_code),
  CONSTRAINT teacher_subject_map_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id),
  CONSTRAINT teacher_subject_map_subject_code_fkey FOREIGN KEY (subject_code) REFERENCES public.subjects_master(subject_code)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_timetable_date ON public.timetable(timetable_date);
CREATE INDEX IF NOT EXISTS idx_room_allotment_date ON public.room_allotment(allotment_date);
