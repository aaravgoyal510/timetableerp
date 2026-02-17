-- ================================================
-- MIGRATION: Add class_id to students table
-- ================================================
-- Run this in your Supabase SQL Editor to add the class_id column

-- Add the class_id column to students table
ALTER TABLE public.students ADD COLUMN class_id integer;

-- Add foreign key constraint
ALTER TABLE public.students 
ADD CONSTRAINT students_class_id_fkey 
FOREIGN KEY (class_id) REFERENCES public.classes(class_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);
