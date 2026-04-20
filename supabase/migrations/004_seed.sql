-- Khatwah Clinic Seed Data
-- Migration 004: Default Settings and Templates

-- ============================================================================
-- 1. CLINIC SETTINGS (Single Row)
-- ============================================================================
INSERT INTO clinic_settings (
  id,
  clinic_name,
  doctor_name,
  shift_config,
  is_accepting_bookings,
  booking_pause_message
)
VALUES (
  gen_random_uuid(),
  'عيادة خطوة',
  'د. محمد',
  '{
    "slot_duration_minutes": 30,
    "days": {
      "sun": [{"start": "10:00", "end": "14:00"}, {"start": "17:00", "end": "20:00"}],
      "mon": [{"start": "10:00", "end": "14:00"}, {"start": "17:00", "end": "20:00"}],
      "tue": [{"start": "10:00", "end": "14:00"}],
      "wed": [{"start": "10:00", "end": "14:00"}, {"start": "17:00", "end": "20:00"}],
      "thu": [{"start": "10:00", "end": "14:00"}, {"start": "17:00", "end": "20:00"}],
      "fri": [],
      "sat": [{"start": "10:00", "end": "13:00"}]
    },
    "blocked_dates": []
  }'::jsonb,
  true,
  'الحجز الإلكتروني متوقف مؤقتاً. يرجى التواصل مع العيادة هاتفياً.'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. WHATSAPP TEMPLATES (Default Arabic Templates)
-- ============================================================================

-- Template 1: Appointment Confirmation
INSERT INTO whatsapp_templates (title, body, is_active, sort_order)
VALUES (
  'تأكيد الموعد',
  'مرحباً {{patient_name}}، تم تأكيد موعدك في {{clinic_name}} يوم {{date}} الساعة {{time}}. كود الحجز: {{code}}

نراك قريباً! 🏥',
  true,
  1
)
ON CONFLICT DO NOTHING;

-- Template 2: Appointment Reminder
INSERT INTO whatsapp_templates (title, body, is_active, sort_order)
VALUES (
  'تذكير بالموعد',
  'مرحباً {{patient_name}}، نذكرك بموعدك مع {{doctor_name}} في {{clinic_name}} يوم {{date}} الساعة {{time}}.

كود الحجز: {{code}}

نتطلع لرؤيتك! 🩺',
  true,
  2
)
ON CONFLICT DO NOTHING;

-- Template 3: Follow-up Reminder
INSERT INTO whatsapp_templates (title, body, is_active, sort_order)
VALUES (
  'تذكير بالمتابعة',
  'مرحباً {{patient_name}}، حان وقت متابعتك مع {{doctor_name}} في {{clinic_name}}.

يرجى التواصل معنا لحجز موعد أو احجز مباشرة من هنا:
{{booking_url}}

نتمنى لك الصحة والعافية! 💚',
  true,
  3
)
ON CONFLICT DO NOTHING;

-- Template 4: Cancellation Acknowledgment
INSERT INTO whatsapp_templates (title, body, is_active, sort_order)
VALUES (
  'تأكيد الإلغاء',
  'مرحباً {{patient_name}}، تم إلغاء موعدك بنجاح.

نتمنى لك الصحة والعافية. للحجز مجدداً:
{{booking_url}}

{{clinic_name}} 🏥',
  true,
  4
)
ON CONFLICT DO NOTHING;

-- Template 5: Appointment Arrived
INSERT INTO whatsapp_templates (title, body, is_active, sort_order)
VALUES (
  'شكراً لحضورك',
  'شكراً لزيارتك {{clinic_name}} اليوم يا {{patient_name}}! 

نتمنى لك الشفاء العاجل. إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.

{{doctor_name}} وفريق العمل 💙',
  true,
  5
)
ON CONFLICT DO NOTHING;

-- Template 6: Payment Reminder
INSERT INTO whatsapp_templates (title, body, is_active, sort_order)
VALUES (
  'تذكير بالدفع',
  'مرحباً {{patient_name}}، نذكرك بوجود رصيد متبقي من زيارتك في {{clinic_name}}.

يمكنك الدفع في زيارتك القادمة أو التواصل معنا لترتيب الدفع.

شكراً لثقتك 🙏',
  true,
  6
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTES FOR MANUAL SETUP
-- ============================================================================

-- After running these migrations, you need to:
-- 
-- 1. Create two auth users in Supabase Dashboard:
--    - Doctor account: doctor@khatwah.clinic
--    - Receptionist account: receptionist@khatwah.clinic
--
-- 2. Insert their profiles into staff_profiles table:
--    
--    INSERT INTO staff_profiles (id, full_name, role)
--    VALUES 
--      ('<doctor-user-id>', 'د. محمد أحمد', 'doctor'),
--      ('<receptionist-user-id>', 'سارة حسن', 'receptionist');
--
-- 3. Enable Realtime for appointments table:
--    - Go to Supabase Dashboard → Database → Replication
--    - Enable replication for 'appointments' table
--
-- 4. Update clinic_settings with actual clinic information:
--    - Clinic name, doctor name, actual schedule
