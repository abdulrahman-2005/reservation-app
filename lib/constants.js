// Khatwah Clinic Constants

// Appointment types
export const APPOINTMENT_TYPES = {
  consultation: 'كشف',
  follow_up: 'متابعة',
  procedure: 'إجراء طبي',
}

// Appointment statuses
export const APPOINTMENT_STATUSES = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  arrived: 'وصل',
  in_session: 'في الجلسة',
  completed: 'مكتمل',
  canceled: 'ملغي',
}

// Status flow order
export const STATUS_FLOW = [
  'pending',
  'confirmed',
  'arrived',
  'in_session',
  'completed',
]

// Payment methods
export const PAYMENT_METHODS = {
  cash: 'نقدي',
  card: 'بطاقة',
  instapay: 'إنستاباي',
  vodafone_cash: 'فودافون كاش',
}

// Gender options
export const GENDER_OPTIONS = {
  male: 'ذكر',
  female: 'أنثى',
}

// Booking sources
export const BOOKING_SOURCES = {
  patient_online: 'حجز إلكتروني',
  walk_in: 'حضور مباشر',
  staff: 'موظف',
}

// Error messages (Arabic)
export const ERROR_MESSAGES = {
  slot_taken: 'عذراً، هذا الموعد تم حجزه للتو. يرجى اختيار وقت آخر.',
  server_error: 'حدث خطأ في الخادم. يرجى المحاولة مجدداً.',
  invalid_code: 'كود الحجز أو رقم الهاتف غير صحيح.',
  booking_closed: 'الحجز الإلكتروني متوقف مؤقتاً. يرجى التواصل مع العيادة.',
  invalid_phone: 'رقم الهاتف غير صحيح. يجب أن يبدأ بـ 01 ويتكون من 11 رقماً.',
  invalid_name: 'يرجى إدخال الاسم الكامل.',
  invalid_type: 'نوع الموعد غير صحيح.',
  not_found: 'لم يتم العثور على الموعد. تأكد من رقم الهاتف وكود الحجز.',
  already_canceled: 'هذا الموعد ملغي بالفعل.',
  cannot_cancel_completed: 'لا يمكن إلغاء موعد مكتمل.',
  network_error: 'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت.',
}

// Success messages (Arabic)
export const SUCCESS_MESSAGES = {
  booking_created: 'تم حجز موعدك بنجاح!',
  booking_canceled: 'تم إلغاء الموعد بنجاح.',
  status_updated: 'تم تحديث حالة الموعد.',
  payment_logged: 'تم تسجيل الدفعة بنجاح.',
  settings_saved: 'تم حفظ الإعدادات.',
  template_saved: 'تم حفظ القالب.',
}

// Days of week (Arabic)
export const DAYS_OF_WEEK = {
  sun: 'الأحد',
  mon: 'الاثنين',
  tue: 'الثلاثاء',
  wed: 'الأربعاء',
  thu: 'الخميس',
  fri: 'الجمعة',
  sat: 'السبت',
}

// Day abbreviations (for calendar)
export const DAY_ABBR = {
  sun: 'أحد',
  mon: 'اثنين',
  tue: 'ثلاثاء',
  wed: 'أربعاء',
  thu: 'خميس',
  fri: 'جمعة',
  sat: 'سبت',
}

// Months (Arabic)
export const MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]
