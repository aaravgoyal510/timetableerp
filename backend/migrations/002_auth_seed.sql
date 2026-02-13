-- Seed Authentication Credentials for Demo

-- This script creates sample auth credentials for staff members
-- In production, use a proper admin interface to create credentials

-- Create demo staff members with explicit staff IDs
-- Admin User (Staff ID: 1)
INSERT INTO public.staff (staff_id, staff_name, email, phone_number, designation, staff_type, is_active)
VALUES (1, 'Admin User', 'admin@school.com', '9999999999', 'Administrator', 'Permanent', true)
ON CONFLICT (staff_id) DO UPDATE SET 
  staff_name = EXCLUDED.staff_name,
  email = EXCLUDED.email,
  designation = EXCLUDED.designation;

-- Create auth credentials for admin (Staff ID: 1, PIN: 1234)
-- Hash: bcrypt hash of "1234"
INSERT INTO public.auth_credentials (staff_id, pin_hash, is_active)
VALUES (1, '$2a$10$Nb2LvV/xXhXY4m5j2Vp5fuvZFYXJ6H7p2R1Q8t3q4n5r6p7s8t9u0w', true)
ON CONFLICT (staff_id) DO UPDATE SET pin_hash = EXCLUDED.pin_hash;

-- Assign Admin role to staff ID 1
INSERT INTO public.staff_role_map (staff_id, role_id)
SELECT 1, role_id FROM public.roles_master WHERE role_name = 'Admin'
ON CONFLICT (staff_id, role_id) DO NOTHING;

-- Faculty member (Staff ID: 2, PIN: 5678)
INSERT INTO public.staff (staff_id, staff_name, email, phone_number, designation, staff_type, is_active)
VALUES (2, 'Faculty Member', 'faculty@school.com', '8888888888', 'Associate Professor', 'Permanent', true)
ON CONFLICT (staff_id) DO UPDATE SET 
  staff_name = EXCLUDED.staff_name,
  email = EXCLUDED.email,
  designation = EXCLUDED.designation;

-- Create auth credentials for faculty (Staff ID: 2, PIN: 5678)
INSERT INTO public.auth_credentials (staff_id, pin_hash, is_active)
VALUES (2, '$2a$10$Nb2LvV/xXhXY4m5j2Vp5fuvZFYXJ6H7p2R1Q8t3q4n5r6p7s8t9u0w', true)
ON CONFLICT (staff_id) DO UPDATE SET pin_hash = EXCLUDED.pin_hash;

-- Assign Faculty role to staff ID 2
INSERT INTO public.staff_role_map (staff_id, role_id)
SELECT 2, role_id FROM public.roles_master WHERE role_name = 'Faculty'
ON CONFLICT (staff_id, role_id) DO NOTHING;
