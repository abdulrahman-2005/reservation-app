'use client'

import { formatDateAr, formatTimeAr } from '@/lib/utils/formatters'
import { APPOINTMENT_TYPES } from '@/lib/constants'
import { buildWhatsAppLink } from '@/lib/utils/whatsapp'

export default function SuccessScreen({ bookingData, reservationCode, settings }) {
  const shareMessage = `تم حجز موعدي في ${settings.clinic_name}

📅 ${formatDateAr(bookingData.date)}
🕐 ${formatTimeAr(bookingData.time)}
🔖 كود الحجز: ${reservationCode}

${process.env.NEXT_PUBLIC_BOOKING_URL || ''}`

  const handleShare = () => {
    // Try native share first
    if (navigator.share) {
      navigator.share({
        text: shareMessage,
      }).catch(err => console.log('Share canceled:', err))
    } else {
      // Fallback to WhatsApp
      const link = buildWhatsAppLink(bookingData.phone, shareMessage)
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }
  
  const handleViewAppointment = () => {
    window.location.href = '/lookup'
  }
  
  return (
    <div className="space-y-6">
      {/* Success icon */}
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">تم الحجز بنجاح!</h2>
        <p className="text-slate-600">سنراك قريباً في العيادة</p>
      </div>
      
      {/* Appointment details card */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-slate-200">
        {/* Reservation code - prominent */}
        <div className="bg-cyan-600 rounded-lg p-6 text-center">
          <p className="text-sm text-white/90 font-medium mb-2">كود الحجز</p>
          <p className="text-4xl font-bold text-white tracking-wider font-mono">
            {reservationCode}
          </p>
          <p className="text-xs text-white/80 mt-2">احتفظ بهذا الكود</p>
        </div>
        
        {/* Appointment details */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">الاسم</p>
              <p className="font-semibold text-slate-900">{bookingData.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">التاريخ</p>
              <p className="font-semibold text-slate-900">{formatDateAr(bookingData.date)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">الوقت</p>
              <p className="font-semibold text-slate-900">{formatTimeAr(bookingData.time)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-700">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">نوع الموعد</p>
              <p className="font-semibold text-slate-900">{APPOINTMENT_TYPES[bookingData.type]}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={handleShare}
          className="w-full py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          مشاركة تفاصيل الموعد
        </button>
        
        <button
          onClick={handleViewAppointment}
          className="w-full py-4 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors border border-slate-200"
        >
          عرض أو إلغاء الموعد
        </button>
        
        <a
          href="/book"
          className="block w-full py-4 text-center text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
        >
          حجز موعد آخر
        </a>
      </div>
      
      {/* Important note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">ملاحظة مهمة:</p>
            <p className="leading-relaxed">
              يرجى الحضور قبل موعدك بـ 10 دقائق. في حالة التأخير أو عدم الحضور، قد يتم إلغاء الموعد تلقائياً.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
