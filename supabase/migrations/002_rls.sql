-- Khatwah Clinic Row Level Security Policies
-- Migration 002: RLS Policies

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTION: Get current user's role
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM staff_profiles WHERE id = (SELECT auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- 1. STAFF_PROFILES POLICIES
-- ============================================================================

-- Staff can read their own profile
CREATE POLICY "staff can read own profile"
  ON staff_profiles FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

-- Only doctor can insert new staff
CREATE POLICY "doctor can insert staff"
  ON staff_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT get_user_role()) = 'doctor'
  );

-- Only doctor can update staff profiles
CREATE POLICY "doctor can update staff"
  ON staff_profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );

-- Only doctor can delete staff
CREATE POLICY "doctor can delete staff"
  ON staff_profiles FOR DELETE
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );

-- ============================================================================
-- 2. CLINIC_SETTINGS POLICIES
-- ============================================================================

-- Public can read clinic settings (for booking page)
CREATE POLICY "public can read clinic settings"
  ON clinic_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only doctor can update clinic settings
CREATE POLICY "doctor can update clinic settings"
  ON clinic_settings FOR UPDATE
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );

-- ============================================================================
-- 3. PATIENTS POLICIES
-- ============================================================================

-- Public can insert patient records (during booking)
CREATE POLICY "public can insert patients"
  ON patients FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public can read their own patient record (for lookup page)
CREATE POLICY "public can read own patient record"
  ON patients FOR SELECT
  TO anon
  USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

-- Staff can read all patients
CREATE POLICY "staff can read all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    (SELECT get_user_role()) IN ('doctor', 'receptionist')
  );

-- Staff can update patients
CREATE POLICY "staff can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (
    (SELECT get_user_role()) IN ('doctor', 'receptionist')
  );

-- ============================================================================
-- 4. APPOINTMENTS POLICIES
-- ============================================================================

-- Public CANNOT directly insert appointments (must use RPC function)
-- This is intentional - no INSERT policy for anon users

-- Public can read their own appointments (for lookup page)
-- Verified by matching reservation_code + phone in application logic
CREATE POLICY "public can read own appointments"
  ON appointments FOR SELECT
  TO anon
  USING (
    patient_id IN (
      SELECT id FROM patients 
      WHERE phone = current_setting('request.jwt.claims', true)::json->>'phone'
    )
  );

-- Staff can read all appointments
CREATE POLICY "staff can read all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    (SELECT get_user_role()) IN ('doctor', 'receptionist')
  );

-- Staff can update appointments
CREATE POLICY "staff can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    (SELECT get_user_role()) IN ('doctor', 'receptionist')
  );

-- Staff can insert appointments (walk-ins)
CREATE POLICY "staff can insert appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT get_user_role()) IN ('doctor', 'receptionist')
  );

-- Staff can delete appointments (if needed)
CREATE POLICY "staff can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    (SELECT get_user_role()) IN ('doctor', 'receptionist')
  );

-- ============================================================================
-- 5. TRANSACTIONS POLICIES (DOCTOR ONLY)
-- ============================================================================

-- Only doctor can read transactions
CREATE POLICY "doctor can read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );

-- Only doctor can insert transactions
CREATE POLICY "doctor can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT get_user_role()) = 'doctor'
  );

-- Only doctor can update transactions
CREATE POLICY "doctor can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );

-- Only doctor can delete transactions
CREATE POLICY "doctor can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );

-- ============================================================================
-- 6. WHATSAPP_TEMPLATES POLICIES
-- ============================================================================

-- Staff can read templates
CREATE POLICY "staff can read templates"
  ON whatsapp_templates FOR SELECT
  TO authenticated
  USING (
    (SELECT get_user_role()) IN ('doctor', 'receptionist')
  );

-- Only doctor can insert templates
CREATE POLICY "doctor can insert templates"
  ON whatsapp_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT get_user_role()) = 'doctor'
  );

-- Only doctor can update templates
CREATE POLICY "doctor can update templates"
  ON whatsapp_templates FOR UPDATE
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );

-- Only doctor can delete templates
CREATE POLICY "doctor can delete templates"
  ON whatsapp_templates FOR DELETE
  TO authenticated
  USING (
    (SELECT get_user_role()) = 'doctor'
  );
