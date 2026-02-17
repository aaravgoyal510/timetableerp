-- ================================================
-- MIGRATION: Convert staff_id and student_id from INTEGER to VARCHAR
-- ================================================
-- Run this in your Supabase SQL Editor to update ID column types
-- WARNING: This will affect multiple tables. Backup your data first!

-- STEP 1: Drop all foreign key constraints that reference staff_id
ALTER TABLE public.timetable DROP CONSTRAINT IF EXISTS timetable_staff_id_fkey;
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS attendance_staff_id_fkey;
ALTER TABLE public.room_allotment DROP CONSTRAINT IF EXISTS room_bookings_staff_id_fkey;
ALTER TABLE public.staff_role_map DROP CONSTRAINT IF EXISTS staff_role_map_staff_id_fkey;
ALTER TABLE public.staff_dept_map DROP CONSTRAINT IF EXISTS staff_dept_map_staff_id_fkey;
ALTER TABLE public.teacher_subject_map DROP CONSTRAINT IF EXISTS teacher_subject_map_staff_id_fkey;
ALTER TABLE public.staff_availability DROP CONSTRAINT IF EXISTS staff_availability_staff_id_fkey;
ALTER TABLE public.attendance_audit_log DROP CONSTRAINT IF EXISTS attendance_audit_log_changed_by_fkey;
ALTER TABLE public.auth_credentials DROP CONSTRAINT IF EXISTS auth_credentials_staff_id_fkey;
ALTER TABLE public.auth_sessions DROP CONSTRAINT IF EXISTS auth_sessions_staff_id_fkey;
ALTER TABLE public.auth_audit_log DROP CONSTRAINT IF EXISTS auth_audit_log_staff_id_fkey;

-- STEP 2: Drop all foreign key constraints that reference student_id
ALTER TABLE public.attendance DROP CONSTRAINT IF EXISTS attendance_student_id_fkey;
ALTER TABLE public.student_role_map DROP CONSTRAINT IF EXISTS student_role_map_student_id_fkey;

-- STEP 3: Drop sequences (no longer needed for alphanumeric IDs)
DROP SEQUENCE IF EXISTS public.staff_staff_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.students_student_id_seq CASCADE;

-- STEP 4: Change staff_id from INTEGER to VARCHAR in all tables
ALTER TABLE public.staff ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.timetable ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.attendance ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.room_allotment ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.staff_role_map ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.staff_dept_map ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.teacher_subject_map ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.staff_availability ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.attendance_audit_log ALTER COLUMN changed_by TYPE VARCHAR USING changed_by::VARCHAR;
ALTER TABLE public.auth_credentials ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.auth_sessions ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;
ALTER TABLE public.auth_audit_log ALTER COLUMN staff_id TYPE VARCHAR USING staff_id::VARCHAR;

-- STEP 5: Change student_id from INTEGER to VARCHAR in all tables
ALTER TABLE public.students ALTER COLUMN student_id TYPE VARCHAR USING student_id::VARCHAR;
ALTER TABLE public.attendance ALTER COLUMN student_id TYPE VARCHAR USING student_id::VARCHAR;
ALTER TABLE public.student_role_map ALTER COLUMN student_id TYPE VARCHAR USING student_id::VARCHAR;

-- STEP 6: Recreate foreign key constraints with VARCHAR types
ALTER TABLE public.timetable 
  ADD CONSTRAINT timetable_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);

ALTER TABLE public.attendance 
  ADD CONSTRAINT attendance_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);

ALTER TABLE public.attendance 
  ADD CONSTRAINT attendance_student_id_fkey 
  FOREIGN KEY (student_id) REFERENCES public.students(student_id);

ALTER TABLE public.room_allotment 
  ADD CONSTRAINT room_bookings_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);

ALTER TABLE public.staff_role_map 
  ADD CONSTRAINT staff_role_map_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);

ALTER TABLE public.staff_dept_map 
  ADD CONSTRAINT staff_dept_map_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);

ALTER TABLE public.teacher_subject_map 
  ADD CONSTRAINT teacher_subject_map_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);

ALTER TABLE public.staff_availability 
  ADD CONSTRAINT staff_availability_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id);

ALTER TABLE public.attendance_audit_log 
  ADD CONSTRAINT attendance_audit_log_changed_by_fkey 
  FOREIGN KEY (changed_by) REFERENCES public.staff(staff_id);

ALTER TABLE public.student_role_map 
  ADD CONSTRAINT student_role_map_student_id_fkey 
  FOREIGN KEY (student_id) REFERENCES public.students(student_id);

ALTER TABLE public.auth_credentials 
  ADD CONSTRAINT auth_credentials_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE CASCADE;

ALTER TABLE public.auth_sessions 
  ADD CONSTRAINT auth_sessions_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE CASCADE;

ALTER TABLE public.auth_audit_log 
  ADD CONSTRAINT auth_audit_log_staff_id_fkey 
  FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE SET NULL;

-- STEP 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staff_id ON public.staff(staff_id);
CREATE INDEX IF NOT EXISTS idx_students_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_timetable_staff_id ON public.timetable(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_staff_id ON public.attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_auth_credentials_staff_id ON public.auth_credentials(staff_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_staff_id ON public.auth_sessions(staff_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_staff_id ON public.auth_audit_log(staff_id);

-- ================================================
-- MIGRATION COMPLETE
-- ================================================
-- After running this migration:
-- 1. staff_id will be VARCHAR format: 0[YY]1FT[Sequential] (e.g., 0251ft001)
-- 2. student_id will be VARCHAR format: 0[YY]1[CourseCode][RollNumber] (e.g., 0251bca116)
-- 3. All foreign key relationships will be maintained
-- ================================================
