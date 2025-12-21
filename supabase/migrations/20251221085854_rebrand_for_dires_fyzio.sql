-- Rebrand for Dires Fyzio Physiotherapy Clinic
-- Add client-specific fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS medical_history jsonb DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact jsonb DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_confirmed boolean DEFAULT true;

-- Update role constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('client', 'therapist', 'admin', 'student', 'instructor'));

-- Create services table
CREATE TABLE IF NOT EXISTS fyzio_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_minutes integer DEFAULT 60,
  price numeric DEFAULT 0 CHECK (price >= 0),
  category text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create therapists table
CREATE TABLE IF NOT EXISTS therapists (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialization text[] DEFAULT ARRAY[]::text[],
  certifications text[] DEFAULT ARRAY[]::text[],
  years_of_experience integer DEFAULT 0,
  languages_spoken text[] DEFAULT ARRAY['Czech']::text[],
  availability jsonb DEFAULT '{}',
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE,
  service_id uuid REFERENCES fyzio_services(id) ON DELETE SET NULL,
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes text,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create treatment_plans table
CREATE TABLE IF NOT EXISTS treatment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE,
  diagnosis text,
  goals text[] DEFAULT ARRAY[]::text[],
  plan_details jsonb DEFAULT '{}',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
  progress_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create client_notes table
CREATE TABLE IF NOT EXISTS client_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  therapist_id uuid REFERENCES therapists(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  note_type text DEFAULT 'session' CHECK (note_type IN ('session', 'progress', 'assessment', 'other')),
  content text NOT NULL,
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_therapists_specialization ON therapists USING GIN (specialization);
CREATE INDEX IF NOT EXISTS idx_fyzio_services_category ON fyzio_services(category);
CREATE INDEX IF NOT EXISTS idx_fyzio_services_active ON fyzio_services(is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_therapist ON appointments(therapist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_client ON treatment_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_plans_therapist ON treatment_plans(therapist_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_client ON client_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_client_notes_therapist ON client_notes(therapist_id);

-- Enable RLS
ALTER TABLE fyzio_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Anyone can view active fyzio services" ON fyzio_services FOR SELECT USING (is_active = true);

-- Therapists policies
CREATE POLICY "Anyone can view therapist profiles" ON therapists FOR SELECT TO authenticated USING (true);
CREATE POLICY "Therapists can update own profile" ON therapists FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Therapists can insert own profile" ON therapists FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Appointments policies
CREATE POLICY "Clients can view own appointments" ON appointments FOR SELECT TO authenticated USING (client_id = auth.uid());
CREATE POLICY "Therapists can view assigned appointments" ON appointments FOR SELECT TO authenticated USING (therapist_id = auth.uid());
CREATE POLICY "Clients can create appointments" ON appointments FOR INSERT TO authenticated WITH CHECK (client_id = auth.uid());
CREATE POLICY "Clients can update own appointments" ON appointments FOR UPDATE TO authenticated USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());
CREATE POLICY "Therapists can update assigned appointments" ON appointments FOR UPDATE TO authenticated USING (therapist_id = auth.uid()) WITH CHECK (therapist_id = auth.uid());

-- Treatment plans policies
CREATE POLICY "Clients can view own treatment plans" ON treatment_plans FOR SELECT TO authenticated USING (client_id = auth.uid());
CREATE POLICY "Therapists can view assigned treatment plans" ON treatment_plans FOR SELECT TO authenticated USING (therapist_id = auth.uid());
CREATE POLICY "Therapists can create treatment plans" ON treatment_plans FOR INSERT TO authenticated WITH CHECK (therapist_id = auth.uid());
CREATE POLICY "Therapists can update assigned treatment plans" ON treatment_plans FOR UPDATE TO authenticated USING (therapist_id = auth.uid()) WITH CHECK (therapist_id = auth.uid());

-- Client notes policies
CREATE POLICY "Therapists can view own client notes" ON client_notes FOR SELECT TO authenticated USING (therapist_id = auth.uid());
CREATE POLICY "Therapists can create client notes" ON client_notes FOR INSERT TO authenticated WITH CHECK (therapist_id = auth.uid());
CREATE POLICY "Therapists can update own client notes" ON client_notes FOR UPDATE TO authenticated USING (therapist_id = auth.uid()) WITH CHECK (therapist_id = auth.uid());

-- Triggers
CREATE TRIGGER update_fyzio_services_updated_at BEFORE UPDATE ON fyzio_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapists_updated_at BEFORE UPDATE ON therapists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_notes_updated_at BEFORE UPDATE ON client_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();