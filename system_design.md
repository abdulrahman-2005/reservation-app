# System Design Document: Khatwah Clinic
### Version 2.0 — Arish Market Edition

---

## 0. Design Philosophy & Market Constraints

This system is built for a specific reality: a medical clinic in Arish, North Sinai, serving patients who primarily discover services through Facebook and phone calls, operated by staff who are comfortable with smartphones but not necessarily tech-savvy. Every decision in this document is filtered through three constraints:

1. **Zero recurring cost** — No paid APIs, no paid third-party services, no per-message or per-action fees.
2. **Low UX complexity** — Every interaction must be learnable in under 5 minutes with no training manual.
3. **Offline-tolerant** — Connection quality in Arish can be inconsistent. The system must degrade gracefully.

**What this means in practice:**
- No WhatsApp Business API (costs money per message). We use the free `wa.me` deep-link instead.
- No SMS notifications. WhatsApp is universal and free.
- No AI features, no complex analytics, no multi-branch support. One clinic, one doctor, one truth.
- No native app. A PWA on Vercel costs nothing and works on any phone.

---

## 1. High-Level Architecture

```
Patient's Phone
    │
    ▼
Next.js PWA on Vercel (free tier)
    │
    ├── Public routes: /book, /lookup
    ├── Receptionist routes: /dashboard
    └── Doctor routes: /admin
    │
    ▼
Supabase (free tier)
    ├── PostgreSQL database
    ├── Supabase Auth (staff login)
    ├── Supabase Realtime (live queue)
    └── Row Level Security (access control)
```

**Tech Stack:**
- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS
- **Backend-as-a-Service:** Supabase (PostgreSQL + Auth + Realtime + RLS)
- **Hosting:** Vercel (free tier — adequate for a single clinic)
- **Messaging:** WhatsApp deep links (`wa.me`) — zero cost, zero API

**Cost at launch: 0 EGP/month**

---

## 2. UI/UX Design System

### 2.1 Theme: "Modern Medical Light"

The aesthetic targets **trust and cleanliness** without the coldness of a hospital. It should feel like the best private clinic app in Cairo — even though it's built for Arish.

| Token | Tailwind Class | Hex | Usage |
|---|---|---|---|
| Background | `bg-slate-50` | `#F8FAFC` | Page background |
| Surface | `bg-white` | `#FFFFFF` | Cards, modals |
| Primary | `bg-cyan-500` / `text-cyan-500` | `#06B6D4` | FAB, active states, CTAs |
| Text primary | `text-slate-800` | `#1E293B` | Headings, body |
| Text muted | `text-slate-400` | `#94A3B8` | Labels, hints |
| Success | `bg-emerald-100 text-emerald-700` | — | Completed status |
| Warning | `bg-amber-100 text-amber-700` | — | Pending status |
| Danger | `bg-red-100 text-red-700` | — | Canceled status |
| Info | `bg-blue-100 text-blue-700` | — | Arrived/In-session |

### 2.2 Geometry

- **Border radius:** `rounded-2xl` (16px) for cards, `rounded-full` for pills and FAB
- **Shadows:** `shadow-sm` only — no heavy drop shadows
- **Transitions:** `transition-all duration-200` for interactive elements
- **Typography:** System sans-serif stack. Large, confident font sizes (no tiny text)

### 2.3 Layout Architecture

#### Patient Portal (`/book`, `/lookup`)
Single-column, centered, max-width `max-w-md`. Designed to be used once on a phone and never again. No navigation needed.

#### Receptionist Dashboard (`/dashboard`)
- **Top bar:** Clinic name left, today's date + appointment count right
- **Body:** Scrollable vertical feed of patient cards
- **Bottom nav:** Fixed, 4 icons + center FAB. Icons: Queue, Calendar, Patients, (FAB), Settings

#### Doctor Admin (`/admin`)
- Same bottom nav but with Accounting tab visible
- Desktop-friendly: cards expand to 2-column grid on wider screens

### 2.4 The Bottom Navigation Bar (FAB Design)

```
┌─────────────────────────────────────┐
│  [Queue]  [Cal]  ( + )  [Pat]  [⚙] │
│              ⬆ FAB                  │
└─────────────────────────────────────┘
```

The FAB is a `rounded-full` cyan button elevated above the bar. Pressing it opens a **bottom sheet** with two quick actions:
- "Add walk-in patient"
- "Log a payment" (doctor only — hidden for receptionist)

Bottom sheet uses a sliding `transform translateY` animation, no external library needed.

---

## 3. Database Schema (Supabase / PostgreSQL)

### 3.1 `staff_profiles`

```sql
CREATE TABLE staff_profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  role      TEXT NOT NULL CHECK (role IN ('doctor', 'receptionist'))
);
```

**RLS Policy:**
- Staff can read their own row
- Only `doctor` role can insert/update/delete

### 3.2 `clinic_settings` (Single row)

```sql
CREATE TABLE clinic_settings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name          TEXT NOT NULL DEFAULT 'Khatwah Clinic',
  doctor_name          TEXT NOT NULL DEFAULT 'Dr. Name',
  shift_config         JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_accepting_bookings BOOLEAN NOT NULL DEFAULT true,
  booking_pause_message TEXT DEFAULT 'Booking is temporarily paused. Please call us.'
);
```

`shift_config` example:
```json
{
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
  "blocked_dates": ["2025-01-01", "2025-04-25"]
}
```

**Notes:**
- Empty array for a day = closed that day
- `blocked_dates` handles holidays and personal time without a separate table
- `booking_pause_message` is shown to patients when `is_accepting_bookings = false`

**RLS Policy:**
- Public: SELECT only
- Doctor: full access

### 3.3 `patients`

```sql
CREATE TABLE patients (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          TEXT UNIQUE NOT NULL,
  full_name      TEXT NOT NULL,
  date_of_birth  DATE,
  gender         TEXT CHECK (gender IN ('male', 'female')),
  internal_notes TEXT,
  is_verified    BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Notes:**
- `phone` is the primary identity. Patients do not have passwords.
- `internal_notes` is staff-only. Example: "Allergic to penicillin", "Prefers female staff".
- `is_verified` is toggled manually by the receptionist for first-time callers they've confirmed.

**RLS Policy:**
- Public: INSERT only (create patient record on booking)
- Public: SELECT only when `phone` matches (used in /lookup)
- Staff/Doctor: full access

### 3.4 `appointments`

```sql
CREATE TABLE appointments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_code    TEXT UNIQUE NOT NULL,
  patient_id          UUID NOT NULL REFERENCES patients(id),
  date                DATE NOT NULL,
  start_time          TIME NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('consultation', 'follow_up', 'procedure')),
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','confirmed','arrived','in_session','completed','canceled')),
  visit_notes         TEXT,
  cancellation_reason TEXT,
  booked_by           TEXT NOT NULL CHECK (booked_by IN ('patient_online', 'walk_in', 'staff')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(date, start_time)
);
```

**Notes:**
- `UNIQUE(date, start_time)` is the database-level double-booking guard — this is the most important constraint in the schema.
- `reservation_code` is generated as a short 4-character alphanumeric code (e.g., `A4K2`). Generated in an Edge Function to avoid collisions.
- `booked_by` lets the doctor see the source of each appointment in the ledger.
- `visit_notes` is writeable by the receptionist (quick context notes) and the doctor.

**RLS Policy:**
- Public: INSERT via Edge Function / RPC only (never direct insert — this enforces the double-booking guard)
- Public: SELECT only when `reservation_code` + `patient.phone` both match
- Staff/Doctor: full SELECT + UPDATE

### 3.5 `transactions`

```sql
CREATE TABLE transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id   UUID NOT NULL REFERENCES appointments(id),
  patient_id       UUID NOT NULL REFERENCES patients(id),
  amount_expected  NUMERIC(10,2) NOT NULL DEFAULT 0,
  amount_paid      NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method   TEXT CHECK (payment_method IN ('cash', 'card', 'instapay', 'vodafone_cash')),
  notes            TEXT,
  logged_by        UUID REFERENCES staff_profiles(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Notes:**
- `payment_method` includes `instapay` and `vodafone_cash` — the dominant mobile payment methods in Egypt.
- `logged_by` creates an audit trail of who recorded the payment.
- Multiple `transaction` rows per `appointment_id` is how installments work. The frontend calculates the balance dynamically as `SUM(amount_expected) - SUM(amount_paid)`.
- A `amount_expected = 0, amount_paid = 0` row with `notes = 'Follow-up — no charge'` is the correct way to log zero-cost visits. This ensures every appointment has a financial record.

**RLS Policy:**
- **Doctor ONLY** — full access
- Receptionist: NO access (enforced at both RLS and UI level)

### 3.6 `whatsapp_templates`

```sql
CREATE TABLE whatsapp_templates (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title     TEXT NOT NULL,
  body      TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);
```

**Default templates to seed on setup:**

| Title | Body |
|---|---|
| Appointment reminder | `مرحباً {{patient_name}}، نذكرك بموعدك في عيادة {{clinic_name}} يوم {{date}} الساعة {{time}}. نراك قريباً!` |
| Appointment confirmed | `تم تأكيد موعدك في {{clinic_name}} يوم {{date}} الساعة {{time}}. كود الحجز: {{code}}` |
| Follow-up reminder | `مرحباً {{patient_name}}، حان وقت متابعتك مع {{doctor_name}}. يرجى التواصل لحجز موعد.` |
| Cancellation ack | `تم إلغاء موعدك بنجاح. نتمنى لك الصحة والعافية. للحجز مجدداً: {{booking_url}}` |

**Tags supported:** `{{patient_name}}`, `{{doctor_name}}`, `{{clinic_name}}`, `{{date}}`, `{{time}}`, `{{code}}`, `{{booking_url}}`

**RLS Policy:**
- Staff/Doctor: SELECT
- Doctor: full access

---

## 4. Feature Specifications

### 4.1 Patient Portal (Zero-Auth)

**Route:** `/book`

**Booking flow:**

```
Step 1: Select appointment type
        [Consultation] [Follow-up] [Procedure]

Step 2: Select date (calendar showing only available days from shift_config)

Step 3: Select time slot (only unbooked slots shown, generated on-demand)

Step 4: Enter details
        Name: [_______________]
        Phone: [_______________]  (Egyptian format: 01XXXXXXXXX)

Step 5: Success screen
        Your code: A4K2
        [Share on WhatsApp] ← wa.me deep link to share their own code
```

**Slot generation logic (frontend):**
```javascript
// Given shift_config and existing appointments for that date,
// generate available slots. Run on the client using data fetched
// from Supabase. No server-side slot generation needed.

function getAvailableSlots(date, shiftConfig, bookedTimes) {
  const dayName = getDayName(date); // 'sun', 'mon', etc.
  const shifts = shiftConfig.days[dayName];
  if (!shifts || shifts.length === 0) return [];

  const slots = [];
  for (const shift of shifts) {
    let current = parseTime(shift.start);
    const end = parseTime(shift.end);
    while (current < end) {
      const timeStr = formatTime(current);
      if (!bookedTimes.includes(timeStr)) {
        slots.push(timeStr);
      }
      current += shiftConfig.slot_duration_minutes;
    }
  }
  return slots;
}
```

**Anti-spam:** Rate limiting handled at the database level via the `UNIQUE(date, start_time)` constraint prevents double-booking. Additional rate limiting can be added via Supabase Edge Functions if needed.

**`localStorage` usage:**
```javascript
// After successful booking, save to localStorage for convenience
localStorage.setItem('khatwah_patient', JSON.stringify({
  name: 'Ahmed Hassan',
  phone: '01012345678'
}));
// On next visit to /book, pre-fill the form. Patient can change.
```

**Booking RPC Function (prevents double-booking):**
```sql
-- Called via supabase.rpc('book_appointment', {...})
-- Runs in a transaction to prevent race conditions
CREATE OR REPLACE FUNCTION book_appointment(
  p_name TEXT, p_phone TEXT, p_date DATE,
  p_time TIME, p_type TEXT
)
RETURNS JSON AS $$
DECLARE
  v_patient_id UUID;
  v_appt_id UUID;
  v_code TEXT;
BEGIN
  -- Upsert patient by phone
  INSERT INTO patients (phone, full_name)
  VALUES (p_phone, p_name)
  ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name
  RETURNING id INTO v_patient_id;

  -- Generate unique short code
  v_code := upper(substring(md5(random()::text) from 1 for 4));

  -- Insert appointment (will fail if slot taken due to UNIQUE constraint)
  INSERT INTO appointments (reservation_code, patient_id, date, start_time, type, booked_by)
  VALUES (v_code, v_patient_id, p_date, p_time, p_type, 'patient_online')
  RETURNING id INTO v_appt_id;

  RETURN json_build_object('success', true, 'code', v_code, 'appointment_id', v_appt_id);
EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object('success', false, 'error', 'slot_taken');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Route:** `/lookup`

```
Enter your phone: [01XXXXXXXXX]
Your booking code: [A4K2    ]
[Find my appointment]

─────────────────────────
Result card:
  Ahmed Hassan
  Tuesday, Dec 10 · 10:30 AM
  Status: Confirmed ✓
  Code: A4K2

  [Cancel appointment]
─────────────────────────
```

Cancellation sets `status = 'canceled'` and `cancellation_reason = 'Patient self-canceled online'`. No auth needed — phone + code is the identity check.

---

### 4.2 Receptionist Dashboard

**Route:** `/dashboard` (requires Supabase Auth — receptionist login)

#### Live Queue

Uses `supabase.channel()` with Postgres Changes to subscribe to real-time updates on `appointments` for today's date. Auto-refreshes without page reload.

**Patient card anatomy:**
```
┌─────────────────────────────────────────┐
│ 10:30 AM  · Consultation                │
│ Ahmed Hassan                            │  ← full_name
│ 01012345678                             │  ← phone (tappable → calls)
│                          [Pending ▾]   │  ← status dropdown
│                    [WhatsApp] [Notes]   │
└─────────────────────────────────────────┘
```

**Status flow (tap the pill to advance):**
```
Pending → Confirmed → Arrived → In Session → Completed
                                           → Canceled (with reason)
```

Each status change is a single `UPDATE` to the `appointments` table.

#### Walk-in Entry

Tapping the FAB → "Add walk-in patient" opens a bottom sheet:

```
Add walk-in
───────────
Name:   [___________]
Phone:  [___________]
Time:   [10:30 AM ▾]  ← only shows open slots for today
Type:   [Consultation ▾]

[Add to queue]
```

This calls the same `book_appointment` RPC with `booked_by = 'walk_in'`.

#### WhatsApp Engine

Tapping the WhatsApp button on a card opens a bottom sheet:

```
Send WhatsApp to Ahmed
───────────────────────
Template: [Appointment reminder ▾]

Preview:
"مرحباً Ahmed، نذكرك بموعدك في عيادة
Khatwah يوم الثلاثاء 10 ديسمبر الساعة
10:30. نراك قريباً!"

[Open WhatsApp ↗]
```

The "Open WhatsApp" button constructs and opens:
```javascript
const msg = encodeURIComponent(parsedTemplate);
window.open(`https://wa.me/2${phone}?text=${msg}`, '_blank');
// Note: Egyptian numbers need country code 20, so 01012345678 → 201012345678
```

This requires zero API cost. The receptionist simply clicks Send in WhatsApp when it opens.

#### Patient Notes Modal

Tapping "Notes" on a card opens a simple modal:
```
Ahmed Hassan — Notes
────────────────────
Internal notes (staff only):
[Prefers morning appointments.      ]
[Called twice to confirm.           ]

Visit notes (this appointment):
[Patient reports 3-day headache.    ]

[Save]
```

Two separate text areas: `internal_notes` saves to the `patients` table, `visit_notes` saves to the `appointments` table.

#### Patient Search

A search bar at the top of the queue page filters the displayed list by name or phone in real-time (client-side filter, no extra query needed since today's queue is already loaded).

For looking up past patients: a separate `/dashboard/patients` route with a server-side search query.

---

### 4.3 Doctor Command Center

**Route:** `/admin` (requires Supabase Auth — doctor login only)

RBAC is enforced at two levels:
1. **RLS** — `transactions` table is inaccessible to non-doctor roles at the database level
2. **UI** — The accounting tab and FAB "Log payment" option are hidden if `staff_profiles.role !== 'doctor'`

#### Schedule Engine

A settings page to update `clinic_settings`:
- Toggle individual days on/off
- Set start/end times per day
- Set slot duration (15, 20, 30, 45, 60 minutes)
- Add blocked dates via a date picker
- Toggle `is_accepting_bookings` with a custom pause message

All changes write to the single `clinic_settings` row. Changes take effect immediately — patients refreshing the booking page will see the updated availability.

#### Financial Ledger

**Appointment card with financials (Doctor view):**
```
┌─────────────────────────────────────────────────┐
│ 10:30 AM · Ahmed Hassan · Consultation           │
│ Status: Completed ✓                              │
│─────────────────────────────────────────────────│
│ Expected:    500 EGP                             │
│ Paid:        300 EGP                             │
│ Remaining:   200 EGP  ← highlighted in amber    │
│─────────────────────────────────────────────────│
│ [+ Log payment]   [View history]                 │
└─────────────────────────────────────────────────┘
```

**Log payment modal:**
```
Log payment — Ahmed Hassan
───────────────────────────
Amount expected: [500  ] EGP
Amount paid:     [300  ] EGP
Method: [Cash ▾]  (Cash / Card / InstaPay / Vodafone Cash)
Notes:  [First installment of 2]

[Save]
```

Each "Log payment" creates a new row in `transactions`. Multiple rows per appointment = installment history.

**Balance calculation (frontend):**
```javascript
const balance = transactions.reduce((acc, t) => {
  return acc + (t.amount_expected - t.amount_paid);
}, 0);
// If balance > 0 → show amber "Remaining: X EGP"
// If balance === 0 → show green "Paid in full"
// If balance < 0 → show blue "Overpaid: X EGP" (edge case)
```

#### Revenue Dashboard

A summary view with four metric cards:
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Today   │ │  Week    │ │  Month   │ │ Pending  │
│  800 EGP │ │ 4,200 EGP│ │17,500 EGP│ │  600 EGP │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

Followed by a list of today's completed appointments with their payment status, sorted by time.

**No charting library needed** — this is a small clinic. A clean table view is more useful than a graph and requires zero external dependencies.

---

## 5. Authentication & Security

### 5.1 Staff Login

Standard Supabase Auth email/password flow. Two accounts total: one doctor, one receptionist.

```
/login
──────
Email:    [doctor@khatwah.clinic]
Password: [•••••••••]
[Sign in]
```

After login, the session is stored in a Supabase auth cookie. Next.js middleware checks the session on protected routes and redirects to `/login` if unauthenticated.

### 5.2 Route Protection

```javascript
// middleware.js
export async function middleware(request) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

Additionally, on the `/admin` route, the app checks `staff_profiles.role` after login. If the logged-in user is a receptionist who navigates to `/admin`, they see a "Access denied" screen.

### 5.3 RLS Summary

| Table | Public | Receptionist | Doctor |
|---|---|---|---|
| `clinic_settings` | SELECT | SELECT | ALL |
| `patients` | INSERT, limited SELECT | ALL | ALL |
| `appointments` | INSERT (via RPC), limited SELECT | ALL | ALL |
| `transactions` | NONE | NONE | ALL |
| `whatsapp_templates` | NONE | SELECT | ALL |
| `staff_profiles` | NONE | own row only | ALL |

---

## 6. PWA Configuration

The app is a Progressive Web App. This means patients and staff can "Add to Home Screen" on their phones and use it like a native app.

**`manifest.json`:**
```json
{
  "name": "Khatwah Clinic",
  "short_name": "Khatwah",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8FAFC",
  "theme_color": "#06B6D4",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service worker strategy:** Cache-first for static assets, network-first for API calls. If the API fails (offline), the receptionist sees the last-loaded queue with a "No connection" banner. No data loss — any updates they make are queued and retried when connection restores (using the browser's Background Sync API if available, or a simple retry loop).

---

## 7. Deployment & Environment

### 7.1 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only, never exposed to client
NEXT_PUBLIC_BOOKING_URL=https://khatwah.clinic/book
```

### 7.2 Vercel Setup

- Connect GitHub repo to Vercel
- Set all environment variables in Vercel project settings
- Deploy. Done.
- Custom domain (optional): point the clinic's domain to Vercel — free SSL included.

### 7.3 Supabase Setup Checklist

- [ ] Create project
- [ ] Run schema migrations (all `CREATE TABLE` statements from Section 3)
- [ ] Enable Realtime on `appointments` table
- [ ] Create two auth users (doctor + receptionist)
- [ ] Insert their rows into `staff_profiles`
- [ ] Insert one row into `clinic_settings` with the doctor's actual schedule
- [ ] Seed `whatsapp_templates` with the default Arabic templates

---

## 8. Key Technical Decisions & Rationale

| Decision | Alternative considered | Why we chose this |
|---|---|---|
| `wa.me` deep links | WhatsApp Business API | API costs money per message. Deep links are free forever. |
| Database-level constraints | Application-level spam protection | The `UNIQUE(date, start_time)` constraint prevents double-booking without external services. |
| Single `clinic_settings` row | Separate config tables | One clinic, one doctor. Normalization adds complexity with no benefit. |
| `UNIQUE(date, start_time)` constraint | Application-level checks | DB constraint is the only reliable double-booking guard. Application checks can fail under concurrent requests. |
| RPC for booking | Direct public insert | RPC lets us wrap the insert in a transaction with proper validation and error handling. |
| No charting library | Chart.js or Recharts | A table with 4 metric cards serves the doctor's needs. Libraries add bundle size for no meaningful gain. |
| `localStorage` for patient pre-fill | Cookies | Simpler, requires no backend, no GDPR session management. A convenience feature, not a security-critical one. |
| Arabic templates | English templates | The patient base in Arish speaks Arabic. WhatsApp messages in Arabic read as natural, professional, and personal. |

---

## 9. Launch Checklist

**Before going live:**
- [ ] All environment variables set in Vercel
- [ ] Supabase schema migrated
- [ ] Both staff accounts created and tested
- [ ] WhatsApp templates tested (verify all `{{tags}}` are replaced correctly)
- [ ] Booking flow tested end-to-end on a real phone
- [ ] Lookup + cancel tested with a real reservation code
- [ ] Double-booking test: two tabs, same slot, submit simultaneously — only one should succeed
- [ ] Walk-in entry tested
- [ ] Payment logging tested (doctor account only)
- [ ] Tested on slow connection (Chrome DevTools → Network → Slow 3G)
- [ ] "Add to Home Screen" tested on both Android and iPhone
- [ ] `is_accepting_bookings = false` tested — patients should see the pause message
- [ ] Rate limiting tested: multiple rapid booking attempts should be handled gracefully

---

## 10. Future Considerations (Post-Launch, If Needed)

These are deliberately excluded from v1 to keep complexity low. Revisit only after the clinic has been using the system for 3+ months and staff are comfortable.

| Feature | Trigger to add it |
|---|---|
| Automated appointment reminders | Doctor explicitly requests it. Implement via a free Supabase cron job that generates WhatsApp deep links and logs them — never use a paid API. |
| Multi-doctor support | Only if a second doctor joins the clinic. Requires adding `doctor_id` FK to appointments. |
| Patient history view | If receptionist repeatedly asks "has this patient been here before?" — currently answerable by searching `patients` table. |
| PDF receipts | If doctor wants to hand patients a printed receipt. Can be done client-side with `window.print()` on a styled page — no library needed. |
| Data export to Excel | If accountant needs it. A simple CSV download button on the revenue page costs ~10 lines of JavaScript. |
