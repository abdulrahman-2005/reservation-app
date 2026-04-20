import { createClient } from '@/lib/supabase/server'
import BookingFlow from '@/components/booking/BookingFlow'

export const metadata = {
  title: 'حجز موعد | عيادة خطوة',
  description: 'احجز موعدك في عيادة خطوة بسهولة',
}

export default async function BookPage() {
  const supabase = await createClient()
  
  // Fetch clinic settings
  const { data: settings, error } = await supabase
    .from('clinic_settings')
    .select('*')
    .single()
  
  if (error) {
    console.error('Failed to load clinic settings:', error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">عذراً</h1>
          <p className="text-slate-600">حدث خطأ في تحميل البيانات. يرجى المحاولة مجدداً.</p>
        </div>
      </div>
    )
  }
  
  // Check if booking is currently enabled
  if (!settings.is_accepting_bookings) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 mb-3">الحجز متوقف مؤقتاً</h1>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {settings.booking_pause_message}
            </p>
          </div>
          
          {/* Staff Login Link */}
          <div className="text-center">
            <a
              href="/login"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              دخول الموظفين ←
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  return <BookingFlow settings={settings} />
}
