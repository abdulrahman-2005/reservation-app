'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Inline SVG Icons
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ToothIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function BookingFlow({ settings }) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    treatmentType: 'checkup',
    notes: ''
  });
  const [confirmationData, setConfirmationData] = useState(null);

  const treatmentOptions = [
    { id: 'checkup', label: 'كشف عام', icon: '🦷' },
    { id: 'cleaning', label: 'تنظيف أسنان', icon: '✨' },
    { id: 'filling', label: 'حشو ضرس', icon: '🔧' },
    { id: 'extraction', label: 'خلع سن', icon: '💉' },
    { id: 'rootcanal', label: 'علاج عصب', icon: '⚡' },
    { id: 'whitening', label: 'تبييض أسنان', icon: '⭐' },
    { id: 'braces', label: 'تقويم أسنان', icon: '📐' },
    { id: 'emergency', label: 'طوارئ', icon: '🚨' }
  ];

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 20;
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.patientName.trim()) {
          alert('يرجى إدخال اسم المريض');
          return false;
        }
        if (!formData.phoneNumber.trim() || !/^01[0-9]{9}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
          alert('يرجى إدخال رقم هاتف صحيح (يبدأ بـ 01 ويتكون من 11 رقم)');
          return false;
        }
        return true;
      case 2:
        if (!formData.appointmentDate) {
          alert('يرجى اختيار تاريخ الموعد');
          return false;
        }
        if (!formData.appointmentTime) {
          alert('يرجى اختيار وقت الموعد');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_name: formData.patientName,
            phone_number: formData.phoneNumber,
            appointment_date: formData.appointmentDate,
            appointment_time: formData.appointmentTime,
            treatment_type: formData.treatmentType,
            notes: formData.notes,
            status: 'pending',
            clinic_id: settings.clinic_id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setConfirmationData(data);
      setStep(5);
    } catch (error) {
      console.error('Booking error:', error);
      alert('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                step >= num 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > num ? <CheckIcon /> : num}
            </div>
            <span className={`text-xs mt-2 ${step >= num ? 'text-primary font-medium' : 'text-slate-400'}`}>
              {num === 1 && 'البيانات'}
              {num === 2 && 'الموعد'}
              {num === 3 && 'الخدمة'}
              {num === 4 && 'التأكيد'}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1 bg-slate-100 rounded-full">
        <div 
          className="absolute top-0 right-0 h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">بيانات المريض</h2>
        <p className="text-slate-500">يرجى إدخال المعلومات الأساسية للمريض</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <UserIcon className="inline-block w-4 h-4 ml-1" />
            اسم المريض الثلاثي
          </label>
          <input
            type="text"
            value={formData.patientName}
            onChange={(e) => updateFormData('patientName', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right"
            placeholder="محمد أحمد محمود"
            dir="rtl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <PhoneIcon className="inline-block w-4 h-4 ml-1" />
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData('phoneNumber', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right"
            placeholder="01xxxxxxxxx"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">اختر الموعد</h2>
          <p className="text-slate-500">حدد التاريخ والوقت المناسبين لك</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <CalendarIcon className="inline-block w-4 h-4 ml-1" />
            تاريخ الموعد
          </label>
          <input
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => updateFormData('appointmentDate', e.target.value)}
            min={getMinDate()}
            max={maxDate.toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-right"
          />
        </div>

        {formData.appointmentDate && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <ClockIcon className="inline-block w-4 h-4 ml-1" />
              وقت الموعد
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => updateFormData('appointmentTime', slot)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    formData.appointmentTime === slot
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">نوع الخدمة</h2>
        <p className="text-slate-500">اختر نوع العلاج المطلوب</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {treatmentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => updateFormData('treatmentType', option.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              formData.treatmentType === option.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50'
            }`}
          >
            <div className="text-2xl mb-2">{option.icon}</div>
            <div className={`text-sm font-medium ${
              formData.treatmentType === option.id ? 'text-primary' : 'text-slate-700'
            }`}>
              {option.label}
            </div>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          ملاحظات إضافية (اختياري)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          rows={3}
          placeholder="أي معلومات إضافية تود مشاركتها..."
          dir="rtl"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">تأكيد الحجز</h2>
        <p className="text-slate-500">راجع بياناتك قبل التأكيد</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <span className="text-slate-500">اسم المريض</span>
          <span className="font-semibold text-slate-800">{formData.patientName}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <span className="text-slate-500">رقم الهاتف</span>
          <span className="font-semibold text-slate-800" dir="ltr">{formData.phoneNumber}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <span className="text-slate-500">التاريخ</span>
          <span className="font-semibold text-slate-800">{formData.appointmentDate}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <span className="text-slate-500">الوقت</span>
          <span className="font-semibold text-slate-800">{formData.appointmentTime}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <span className="text-slate-500">الخدمة</span>
          <span className="font-semibold text-slate-800">
            {treatmentOptions.find(t => t.id === formData.treatmentType)?.label}
          </span>
        </div>
        {formData.notes && (
          <div className="pt-2">
            <span className="text-slate-500 block mb-1">ملاحظات</span>
            <p className="text-slate-700 text-sm">{formData.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          ⚠️ سيتم إرسال رسالة تأكيد على رقم الهاتف المسجل بعد تأكيد الحجز
        </p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-8 animate-fadeIn">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckIcon className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">تم الحجز بنجاح!</h2>
      <p className="text-slate-500 mb-6">شكراً لك، تم تسجيل موعدك بنجاح</p>

      <div className="bg-slate-50 rounded-xl p-6 mb-6 max-w-sm mx-auto">
        <div className="text-sm text-slate-500 mb-1">رقم الحجز</div>
        <div className="text-2xl font-bold text-primary mb-4" dir="ltr">#{confirmationData?.id}</div>
        
        <div className="space-y-3 text-right">
          <div className="flex justify-between">
            <span className="text-slate-500">التاريخ</span>
            <span className="font-medium text-slate-800">{confirmationData?.appointment_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">الوقت</span>
            <span className="font-medium text-slate-800">{confirmationData?.appointment_time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">الخدمة</span>
            <span className="font-medium text-slate-800">
              {treatmentOptions.find(t => t.id === confirmationData?.treatment_type)?.label}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => router.push('/lookup')}
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/25"
        >
          متابعة حالة الحجز
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-white border-2 border-slate-200 hover:border-primary text-slate-700 py-3 rounded-xl font-semibold transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/25">
            <ToothIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">عيادة الخطوة</h1>
          <p className="text-slate-500 text-sm">حجز موعد جديد</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8">
          {step < 5 && renderProgressBar()}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}

          {/* Navigation Buttons */}
          {step < 5 && step !== 4 && (
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeftIcon className="rotate-180" />
                  السابق
                </button>
              )}
              <button
                onClick={step === 4 ? handleSubmit : handleNext}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : step === 4 ? (
                  <>
                    <CheckIcon />
                    تأكيد الحجز
                  </>
                ) : (
                  <>
                    التالي
                    <ChevronLeftIcon />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
          >
            ← العودة للصفحة الرئيسية
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
