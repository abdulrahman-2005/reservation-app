-- Khatwah Clinic Database Functions
-- Migration 003: RPC Functions and Stored Procedures

-- ============================================================================
-- FUNCTION: Generate unique short reservation code
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_reservation_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Removed ambiguous chars (0,O,1,I)
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..4 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- ============================================================================
-- FUNCTION: Book appointment (atomic upsert patient + insert appointment)
-- This is the ONLY way public users can create appointments
-- Runs as SECURITY DEFINER to bypass RLS during the transaction
-- ============================================================================
CREATE OR REPLACE FUNCTION book_appointment(
  p_name TEXT,
  p_phone TEXT,
  p_date DATE,
  p_time TIME,
  p_type TEXT,
  p_booked_by TEXT DEFAULT 'patient_online'
)
RETURNS JSON AS $$
DECLARE
  v_patient_id UUID;
  v_appt_id UUID;
  v_code TEXT;
  v_attempts INT := 0;
  v_max_attempts INT := 10;
BEGIN
  -- Validate inputs
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_name');
  END IF;
  
  IF p_phone !~ '^01[0-9]{9}$' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_phone');
  END IF;
  
  IF p_type NOT IN ('consultation', 'follow_up', 'procedure') THEN
    RETURN json_build_object('success', false, 'error', 'invalid_type');
  END IF;
  
  IF p_booked_by NOT IN ('patient_online', 'walk_in', 'staff') THEN
    RETURN json_build_object('success', false, 'error', 'invalid_booked_by');
  END IF;

  -- Check if booking is currently enabled (for online bookings only)
  IF p_booked_by = 'patient_online' THEN
    IF NOT (SELECT is_accepting_bookings FROM clinic_settings LIMIT 1) THEN
      RETURN json_build_object(
        'success', false, 
        'error', 'booking_closed',
        'message', (SELECT booking_pause_message FROM clinic_settings LIMIT 1)
      );
    END IF;
  END IF;

  -- Upsert patient by phone (update name if exists, insert if new)
  INSERT INTO patients (phone, full_name)
  VALUES (p_phone, trim(p_name))
  ON CONFLICT (phone) 
  DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    updated_at = now()
  RETURNING id INTO v_patient_id;

  -- Generate unique reservation code (retry if collision)
  LOOP
    v_code := generate_reservation_code();
    v_attempts := v_attempts + 1;
    
    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM appointments WHERE reservation_code = v_code) THEN
      EXIT;
    END IF;
    
    -- Safety: prevent infinite loop
    IF v_attempts >= v_max_attempts THEN
      RETURN json_build_object('success', false, 'error', 'code_generation_failed');
    END IF;
  END LOOP;

  -- Insert appointment (will fail if slot taken due to UNIQUE constraint)
  BEGIN
    INSERT INTO appointments (
      reservation_code,
      patient_id,
      date,
      start_time,
      type,
      booked_by,
      status
    )
    VALUES (
      v_code,
      v_patient_id,
      p_date,
      p_time,
      p_type,
      p_booked_by,
      'pending'
    )
    RETURNING id INTO v_appt_id;
    
    RETURN json_build_object(
      'success', true,
      'code', v_code,
      'appointment_id', v_appt_id,
      'patient_id', v_patient_id
    );
    
  EXCEPTION 
    WHEN unique_violation THEN
      -- Slot already taken
      RETURN json_build_object('success', false, 'error', 'slot_taken');
    WHEN OTHERS THEN
      -- Other database errors
      RETURN json_build_object('success', false, 'error', 'database_error');
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION book_appointment TO anon, authenticated;

-- ============================================================================
-- FUNCTION: Lookup appointment by phone and reservation code
-- ============================================================================
CREATE OR REPLACE FUNCTION lookup_appointment(
  p_phone TEXT,
  p_code TEXT
)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Validate inputs
  IF p_phone !~ '^01[0-9]{9}$' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_phone');
  END IF;
  
  IF p_code IS NULL OR trim(p_code) = '' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_code');
  END IF;

  -- Find appointment matching both phone and code
  SELECT json_build_object(
    'success', true,
    'appointment', json_build_object(
      'id', a.id,
      'code', a.reservation_code,
      'date', a.date,
      'time', a.start_time,
      'type', a.type,
      'status', a.status,
      'patient_name', p.full_name,
      'patient_phone', p.phone,
      'booked_by', a.booked_by,
      'created_at', a.created_at
    )
  )
  INTO v_result
  FROM appointments a
  JOIN patients p ON a.patient_id = p.id
  WHERE p.phone = p_phone
    AND UPPER(a.reservation_code) = UPPER(trim(p_code))
  LIMIT 1;

  -- If no match found
  IF v_result IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION lookup_appointment TO anon, authenticated;

-- ============================================================================
-- FUNCTION: Cancel appointment (patient self-service)
-- ============================================================================
CREATE OR REPLACE FUNCTION cancel_appointment(
  p_phone TEXT,
  p_code TEXT,
  p_reason TEXT DEFAULT 'Patient canceled online'
)
RETURNS JSON AS $$
DECLARE
  v_appt_id UUID;
  v_appt_status TEXT;
BEGIN
  -- Validate inputs
  IF p_phone !~ '^01[0-9]{9}$' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_phone');
  END IF;
  
  IF p_code IS NULL OR trim(p_code) = '' THEN
    RETURN json_build_object('success', false, 'error', 'invalid_code');
  END IF;

  -- Find appointment
  SELECT a.id, a.status
  INTO v_appt_id, v_appt_status
  FROM appointments a
  JOIN patients p ON a.patient_id = p.id
  WHERE p.phone = p_phone
    AND UPPER(a.reservation_code) = UPPER(trim(p_code))
  LIMIT 1;

  -- If not found
  IF v_appt_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;

  -- Check if already canceled or completed
  IF v_appt_status = 'canceled' THEN
    RETURN json_build_object('success', false, 'error', 'already_canceled');
  END IF;
  
  IF v_appt_status = 'completed' THEN
    RETURN json_build_object('success', false, 'error', 'cannot_cancel_completed');
  END IF;

  -- Cancel the appointment
  UPDATE appointments
  SET 
    status = 'canceled',
    cancellation_reason = p_reason,
    updated_at = now()
  WHERE id = v_appt_id;

  RETURN json_build_object('success', true, 'message', 'Appointment canceled successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION cancel_appointment TO anon, authenticated;

-- ============================================================================
-- FUNCTION: Get available slots for a given date
-- Returns array of time slots that are not yet booked
-- ============================================================================
CREATE OR REPLACE FUNCTION get_available_slots(p_date DATE)
RETURNS JSON AS $$
DECLARE
  v_booked_times TEXT[];
BEGIN
  -- Get all booked times for the date (excluding canceled)
  SELECT array_agg(start_time::TEXT)
  INTO v_booked_times
  FROM appointments
  WHERE date = p_date
    AND status != 'canceled';

  -- Return booked times (slot generation happens on frontend)
  RETURN json_build_object(
    'success', true,
    'date', p_date,
    'booked_times', COALESCE(v_booked_times, ARRAY[]::TEXT[])
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_available_slots TO anon, authenticated;
