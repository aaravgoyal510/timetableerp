-- Optional: Sample Data for Testing Timetable ERP
-- Run this after the schema is created

-- Insert Roles
INSERT INTO public.roles_master (role_name, role_description, is_active) VALUES
('Admin', 'System Administrator', true),
('Teacher', 'Faculty Member', true),
('Student', 'Student User', true),
('Department Head', 'Department Head', true);

-- Insert Sample Students
INSERT INTO public.students (roll_number, student_name, email, phone_number, admission_year, batch, is_active) VALUES
('B001', 'Aarav Kumar', 'aarav@example.com', 9876543210, 2023, 'A', true),
('B002', 'Priya Singh', 'priya@example.com', 9876543211, 2023, 'A', true),
('B003', 'Rohan Patel', 'rohan@example.com', 9876543212, 2023, 'B', true),
('B004', 'Neha Gupta', 'neha@example.com', 9876543213, 2023, 'B', true),
('B005', 'Aditya Sharma', 'aditya@example.com', 9876543214, 2024, 'A', true),
('B006', 'Sneha Verma', 'sneha@example.com', 9876543215, 2024, 'A', true);

-- Insert Sample Staff
INSERT INTO public.staff (staff_name, email, phone_number, department_id, designation, staff_type, is_active) VALUES
('Dr. Rajesh Kumar', 'rajesh@example.com', '9876543220', 1, 'Professor', 'Permanent', true),
('Ms. Anjali Singh', 'anjali@example.com', '9876543221', 1, 'Assistant Professor', 'Permanent', true),
('Mr. Vikram Sharma', 'vikram@example.com', '9876543222', 2, 'Lecturer', 'Visiting', true),
('Dr. Meera Patel', 'meera@example.com', '9876543223', 2, 'Associate Professor', 'Permanent', true),
('Mr. Arjun Singh', 'arjun@example.com', '9876543224', 3, 'Lecturer', 'Permanent', true);

-- Insert Sample Classes
INSERT INTO public.classes (course_name, semester, section, academic_year, shift, is_active) VALUES
('B.Tech CSE', 1, 'A', '2024-2025', 'Morning', true),
('B.Tech CSE', 1, 'B', '2024-2025', 'Morning', true),
('B.Tech ECE', 2, 'A', '2024-2025', 'Evening', true),
('B.Tech ME', 3, 'A', '2024-2025', 'Morning', true);

-- Insert Sample Subjects
INSERT INTO public.subjects_master (subject_code, subject_name, course_name, department_id, semester, credits, hours_per_week, is_lab, duration_years, is_active) VALUES
('CS101', 'Data Structures', 'B.Tech CSE', 1, 1, 4, 3, false, 4, true),
('CS102', 'Programming Lab', 'B.Tech CSE', 1, 1, 2, 4, true, 4, true),
('CS201', 'Database Management', 'B.Tech CSE', 1, 2, 4, 3, false, 4, true),
('CS202', 'Database Lab', 'B.Tech CSE', 1, 2, 2, 4, true, 4, true),
('EC101', 'Digital Electronics', 'B.Tech ECE', 2, 1, 4, 3, false, 4, true),
('EC102', 'Electronics Lab', 'B.Tech ECE', 1, 1, 2, 4, true, 4, true),
('ME101', 'Mechanics', 'B.Tech ME', 3, 1, 4, 3, false, 4, true);

-- Insert Sample Timeslots
INSERT INTO public.timeslots (day_of_week, start_time, end_time, slot_number, is_break, shift) VALUES
('Monday', '09:00', '10:00', 1, false, 'Morning'),
('Monday', '10:00', '11:00', 2, false, 'Morning'),
('Monday', '11:00', '11:30', 3, true, 'Morning'),
('Monday', '11:30', '12:30', 4, false, 'Morning'),
('Monday', '12:30', '01:30', 5, false, 'Morning'),
('Tuesday', '09:00', '10:00', 1, false, 'Morning'),
('Tuesday', '10:00', '11:00', 2, false, 'Morning'),
('Tuesday', '11:00', '11:30', 3, true, 'Morning'),
('Tuesday', '11:30', '12:30', 4, false, 'Morning'),
('Wednesday', '09:00', '10:00', 1, false, 'Morning'),
('Wednesday', '10:00', '11:00', 2, false, 'Morning'),
('Thursday', '09:00', '10:00', 1, false, 'Morning'),
('Thursday', '10:00', '11:00', 2, false, 'Morning'),
('Friday', '09:00', '10:00', 1, false, 'Morning'),
('Friday', '10:00', '11:00', 2, false, 'Morning'),
('Saturday', '09:00', '10:00', 1, false, 'Morning'),
('Saturday', '10:00', '11:00', 2, false, 'Morning');

-- Insert Sample Rooms
INSERT INTO public.rooms (room_number, room_type, block_name, floor_number, capacity, has_projector, has_ac, computer_count, availability_status, is_active) VALUES
('101', 'Classroom', 'A', 1, 40, true, true, 0, 'Free', true),
('102', 'Classroom', 'A', 1, 40, true, true, 0, 'Free', true),
('103', 'Lab', 'A', 1, 30, true, true, 25, 'Free', true),
('201', 'Classroom', 'B', 2, 50, true, true, 0, 'Free', true),
('202', 'Classroom', 'B', 2, 50, true, true, 0, 'Free', true),
('203', 'Lab', 'B', 2, 30, true, true, 25, 'Free', true),
('104', 'Auditorium', 'A', 1, 100, true, false, 0, 'Free', true);

-- Insert Sample Holidays
INSERT INTO public.holidays (holiday_date, holiday_name) VALUES
('2024-01-26', 'Republic Day'),
('2024-03-08', 'Maha Shivaratri'),
('2024-03-25', 'Holi'),
('2024-04-21', 'Ram Navami'),
('2024-05-23', 'Buddha Purnima'),
('2024-08-15', 'Independence Day'),
('2024-08-26', 'Janmashtami'),
('2024-09-16', 'Milad un-Nabi'),
('2024-10-02', 'Gandhi Jayanti'),
('2024-10-12', 'Dussehra'),
('2024-10-31', 'Diwali'),
('2024-11-01', 'Diwali Holiday'),
('2024-11-15', 'Guru Nanak Jayanti'),
('2024-12-25', 'Christmas Day');

-- Insert Sample Teacher Subject Mappings
INSERT INTO public.teacher_subject_map (staff_id, subject_code) VALUES
(1, 'CS101'),
(1, 'CS201'),
(2, 'CS102'),
(2, 'CS202'),
(3, 'EC101'),
(3, 'EC102'),
(4, 'ME101');

-- Insert Sample Timetable Entries
INSERT INTO public.timetable (class_id, subject_code, staff_id, room_id, timeslot_id, timetable_date, is_lab) VALUES
(1, 'CS101', 1, 1, 1, '2024-02-12', false),
(1, 'CS101', 1, 1, 2, '2024-02-12', false),
(1, 'CS102', 2, 3, 4, '2024-02-12', true),
(2, 'CS101', 1, 2, 1, '2024-02-12', false),
(3, 'EC101', 3, 4, 1, '2024-02-13', false);

-- Insert Sample Attendance (Optional)
INSERT INTO public.attendance (student_id, class_id, subject_code, staff_id, timeslot_id, attendance_date, status) VALUES
(1, 1, 'CS101', 1, 1, '2024-02-12', 'Present'),
(2, 1, 'CS101', 1, 1, '2024-02-12', 'Present'),
(3, 1, 'CS101', 1, 1, '2024-02-12', 'Absent'),
(4, 1, 'CS101', 1, 1, '2024-02-12', 'Present'),
(5, 2, 'CS101', 1, 1, '2024-02-12', 'Present'),
(6, 2, 'CS101', 1, 1, '2024-02-12', 'Present');

-- Insert Sample Room Allotments
INSERT INTO public.room_allotment (room_id, class_id, staff_id, subject_code, timeslot_id, allotment_date) VALUES
(1, 1, 1, 'CS101', 1, '2024-02-12'),
(3, 1, 2, 'CS102', 4, '2024-02-12'),
(4, 3, 3, 'EC101', 1, '2024-02-13');
