-- Khatwah Clinic Database Schema
-- Migration 001: Core Tables and Constraints

-- ============================================================================
-- 1. STAFF PROFILES
-- ============================================================================
CREATE TABLE staff_profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role      TEXT NOT NULL CHECK (role IN ('doctor', 'receptionist')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_profiles_role ON staff_profiles(role);

-- ============================================================================
-- 2. CLINIC SETTINGS (Single Row Configuration)
-- ============================================================================
CREATE TABLE clinic_settings (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name            TEXT NOT NULL DEFAULT 'عيادة خطوة',
  doctor_name            TEXT NOT NULL DEFAULT 'د. محمد',
  shift_config           JSONB NOT NULL DEFAULT '{
    "slot_duration_minutes": 30,
    "days": {
      "sun": [{"start": "10:00", "end": "14:00"}],
      "mon": [{"start": "10:00", "end": "14:00"}],
      "tue": [],
      "wed": [{"start": "10:00", "end": "14:00"}],
      "thu": [{"start": "10:00", "end": "14:00"}],
      "fri": [],
      "sat": []
    },
    "blocked_dates": []
  }'::jsonb,
  is_accepting_bookings  BOOLEAN NOT NULL DEFAULT true,
  booking_pause_message  TEXT DEFAULT 'الحجز متوقف مؤقتاً. يرجى التواصل معنا هاتفياً.',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. PATIENTS
-- ============================================================================
CREATE TABLE patients (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          TEXT UNIQUE NOT NULL,
  full_name      TEXT NOT NULL,
  date_of_birth  DATE,
  gender         TEXT CHECK (gender IN ('male', 'female')),
  internal_notes TEXT,
  is_verified    BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phone must be Egyptian format: 01XXXXXXXXX (11 digits starting with 01)
ALTER TABLE patients ADD CONSTRAINT phone_format 
  CHECK (phone ~ '^01[0-9]{9}$');

CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_full_name ON patients(full_name);

-- ============================================================================
-- 4. APPOINTMENTS
-- ============================================================================
CREATE TABLE appointments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_code    TEXT UNIQUE NOT NULL,
  patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date                DATE NOT NULL,
  start_time          TIME NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('consultation', 'follow_up', 'procedure')),
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','confirmed','arrived','in_session','completed','canceled')),
  visit_notes         TEXT,
  cancellation_reason TEXT,
  booked_by           TEXT NOT NULL CHECK (booked_by IN ('patient_online', 'walk_in', 'staff')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- CRITICAL: Double-booking prevention at database level
  UNIQUE(date, start_time)
);

-- Indexes for RLS policies and common queries
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_date_time ON appointments(date, start_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_reservation_code ON appointments(reservation_code);

-- ============================================================================
-- 5. TRANSACTIONS (Financial Ledger)
-- ============================================================================
CREATE TABLE transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id   UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id       UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  amount_expected  NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid      NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method   TEXT CHECK (payment_method IN ('cash', 'card', 'instapay', 'vodafone_cash')),
  notes            TEXT,
  logged_by        UUID REFERENCES staff_profiles(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for financial queries
CREATE INDEX idx_transactions_appointment_id ON transactions(appointment_id);
CREATE INDEX idx_transactions_patient_id ON transactions(patient_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================================================
-- 6. WHATSAPP TEMPLATES
-- ============================================================================
CREATE TABLE whatsapp_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_whatsapp_templates_active ON whatsapp_templates(is_active, sort_order);

-- ============================================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clinic_settings_updated_at
  BEFORE UPDATE ON clinic_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at
  BEFORE UPDATE ON whatsapp_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
