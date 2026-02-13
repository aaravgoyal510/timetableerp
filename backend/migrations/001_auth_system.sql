-- Auth System Tables for Staff ID + PIN

-- Create auth_credentials table to store staff login credentials
CREATE TABLE IF NOT EXISTS public.auth_credentials (
  credential_id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL UNIQUE,
  pin_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  CONSTRAINT auth_credentials_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE CASCADE
);

-- Create sessions table for token management
CREATE TABLE IF NOT EXISTS public.auth_sessions (
  session_id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  refresh_token_hash VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT auth_sessions_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE CASCADE
);

-- Create audit_log table for auth-related events
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  log_id SERIAL PRIMARY KEY,
  staff_id INTEGER,
  event_type VARCHAR(50) NOT NULL, -- 'LOGIN', 'LOGOUT', 'FAILED_LOGIN', 'TOKEN_REFRESH'
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT auth_audit_log_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES public.staff(staff_id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_credentials_staff_id ON public.auth_credentials(staff_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_staff_id ON public.auth_sessions(staff_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON public.auth_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_active ON public.auth_sessions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_auth_audit_staff_id ON public.auth_audit_log(staff_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created ON public.auth_audit_log(created_at);

-- Insert default roles if they don't exist
INSERT INTO public.roles_master (role_name, role_description, is_active) VALUES
  ('Admin', 'System Administrator - Full access', true),
  ('HOD', 'Head of Department - Manages department staff and schedules', true),
  ('Faculty', 'Faculty Member - Can view and manage assigned subjects', true),
  ('Staff', 'Supporting Staff - Limited access to timetables and attendance', true),
  ('Student', 'Student - Can view their own timetable and attendance', true)
ON CONFLICT (role_name) DO NOTHING;
