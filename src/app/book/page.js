'use client';

import { useState } from 'react';

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    treatment: '',
    date: '',
    time: ''
  });

  const treatments = [
    { id: 'cleaning', name: 'تنظيف الأسنان', icon: '🦷' },
    { id: 'filling', name: 'حشو وعلاج', icon: '🔧' },
    { id: 'whitening', name: 'تبييض الأسنان', icon: '✨' },
    { id: 'orthodontics', name: 'تقويم الأسنان', icon: '🎯' },
    { id: 'extraction', name: 'خلع سن', icon: '👶' },
    { id: 'implant', name: 'زراعة أسنان', icon: '💎' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(5);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-bg-main py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">حجز موعد جديد</h1>
          <p className="text-text-muted">اتبع الخطوات التالية لحجز موعدك بسهولة</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-text-muted'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 4 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 rounded transition-all ${
                    step > s ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-muted">
            <span>البيانات</span>
            <span>العلاج</span>
            <span>الموعد</span>
            <span>التأكيد</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary mb-6">البيانات الشخصية</h2>
                
                <div>
                  <label className="label mb-2 block">الاسم الكامل</label>
                  <div className="relative">
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input
                      type="text"
                      className="input pr-10"
                      placeholder="محمد أحمد"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label mb-2 block">رقم الهاتف</label>
                  <div className="relative">
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    <input
                      type="tel"
                      className="input pr-10"
                      placeholder="01234567890"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      pattern="[0-9]{11}"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full py-3 text-lg mt-6">
                  التالي
                  <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Step 2: Treatment Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary mb-6">اختر نوع العلاج</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {treatments.map((treatment) => (
                    <button
                      key={treatment.id}
                      type="button"
                      onClick={() => updateField('treatment', treatment.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        formData.treatment === treatment.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{treatment.icon}</div>
                      <div className="font-medium text-text-primary">{treatment.name}</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn bg-gray-100 text-text-primary flex-1 py-3"
                  >
                    <svg className="w-5 h-5 inline-block ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    رجوع
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.treatment}
                    className="btn btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                    <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary mb-6">اختر الموعد</h2>
                
                <div>
                  <label className="label mb-2 block">التاريخ</label>
                  <div className="relative">
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <input
                      type="date"
                      className="input pr-10"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label mb-2 block">الوقت</label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => updateField('time', slot)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          formData.time === slot
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-text-primary hover:bg-primary/20'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn bg-gray-100 text-text-primary flex-1 py-3"
                  >
                    رجوع
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.date || !formData.time}
                    className="btn btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary mb-6">تأكيد الحجز</h2>
                
                <div className="bg-bg-main rounded-xl p-6 space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-muted">الاسم</div>
                      <div className="font-bold text-text-primary">{formData.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-muted">الهاتف</div>
                      <div className="font-bold text-text-primary">{formData.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-muted">العلاج</div>
                      <div className="font-bold text-text-primary">
                        {treatments.find(t => t.id === formData.treatment)?.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-text-muted">الموعد</div>
                      <div className="font-bold text-text-primary">
                        {formData.date} الساعة {formData.time}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn bg-gray-100 text-text-primary flex-1 py-3"
                  >
                    رجوع
                  </button>
                  <button type="submit" className="btn btn-primary flex-1 py-3">
                    تأكيد الحجز
                    <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">تم الحجز بنجاح!</h2>
                <p className="text-text-muted mb-6">
                  تم تأكيد موعدك وسيتم إرسال رسالة تأكيد إلى رقم هاتفك
                </p>
                <div className="bg-bg-main rounded-xl p-4 mb-6">
                  <div className="text-sm text-text-muted mb-1">رقم الحجز</div>
                  <div className="text-2xl font-bold text-primary">#KTW{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
                </div>
                <div className="flex gap-4">
                  <a href="/" className="btn bg-gray-100 text-text-primary flex-1 py-3">
                    العودة للرئيسية
                  </a>
                  <a href="/lookup" className="btn btn-primary flex-1 py-3">
                    عرض حجوزاتي
                  </a>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
