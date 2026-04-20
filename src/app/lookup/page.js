'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDateAr, formatTimeAr } from '@/lib/utils/formatters'
import { APPOINTMENT_TYPES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants'
import { normalizeReservationCode } from '@/lib/utils/reservationCode'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StatusPill from '@/components/ui/StatusPill'

export default function LookupPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [appointment, setAppointment] = useState(null)
  const [canceling, setCanceling] = useState(false)
  
  const handleLookup = async (e) => {
    e.preventDefault()
    setError(null)
    setAppointment(null)
    
    // Validate inputs
    if (!/^01[0-9]{9}$/.test(phone)) {
      setError(ERROR_MESSAGES.invalid_phone)
      return
    }
    
    const normalizedCode = normalizeReservationCode(code)
    if (normalizedCode.length !== 4) {
      setError(ERROR_MESSAGES.invalid_code)
      return
    }
    
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      const { data, error: rpcError } = await supabase
        .rpc('lookup_appointment', {
          p_phone: phone,
          p_code: normalizedCode
        })
      
      if (rpcError) {
        console.error('RPC error:', rpcError)
        throw new Error('server_error')
      }
      
      if (!data.success) {
        throw new Error(data.error)
      }
      
      setAppointment(data.appointment)
      
    } catch (err) {
      console.error('Lookup error:', err)
      const errorKey = err.message || 'server_error'
      setError(ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.server_error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCancel = async () => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
      return
    }
    
    setCanceling(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      const { data, error: rpcError } = await supabase
        .rpc('cancel_appointment', {
          p_phone: phone,
          p_code: normalizeReservationCode(code),
          p_reason: 'Patient canceled online'
        })
      
      if (rpcError) {
        console.error('RPC error:', rpcError)
        throw new Error('server_error')
      }
      
      if (!data.success) {
        throw new Error(data.error)
      }
      
      // Update appointment status locally
      setAppointment(prev => ({ ...prev, status: 'canceled' }))
      alert(SUCCESS_MESSAGES.booking_canceled)
      
    } catch (err) {
      console.error('Cancel error:', err)
      const errorKey = err.message || 'server_error'
      setError(ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.server_error)
    } finally {
      setCanceling(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <a
              href="/book"
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="رجوع"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="text-lg font-bold text-slate-800">البحث عن موعد</h1>
              <p className="text-sm text-slate-500">عرض أو إلغاء موعدك</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {!appointment ? (
          <form onSubmit={handleLookup} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">ابحث عن موعدك</h2>
              <p className="text-slate-600">أدخل رقم هاتفك وكود الحجز</p>
            </div>
            
            {/* Phone field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800 text-left"
                dir="ltr"
                required
                disabled={loading}
                maxLength={11}
              />
            </div>
            
            {/* Code field */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                كود الحجز
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="A4K2"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800 text-center font-mono text-2xl tracking-wider"
                required
                disabled={loading}
                maxLength={4}
              />
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  البحث عن الموعد
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Appointment details card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">تفاصيل الموعد</h2>
                <StatusPill status={appointment.status} />
              </div>
              
              {/* Reservation code */}
              <div className="bg-primary-50 rounded-xl p-4 text-center border-2 border-primary-200">
                <p className="text-sm text-primary-700 font-medium mb-1">كود الحجز</p>
                <p className="text-3xl font-bold text-primary-600 tracking-wider font-mono">
                  {appointment.code}
                </p>
              </div>
              
              {/* Details */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">الاسم</p>
                    <p className="font-medium">{appointment.patient_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">التاريخ</p>
                    <p className="font-medium">{formatDateAr(appointment.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">الوقت</p>
                    <p className="font-medium">{formatTimeAr(appointment.time)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">نوع الموعد</p>
                    <p className="font-medium">{APPOINTMENT_TYPES[appointment.type]}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            {appointment.status !== 'canceled' && appointment.status !== 'completed' && (
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="w-full py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {canceling ? (
                  <>
                    <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                    جاري الإلغاء...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    إلغاء الموعد
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={() => {
                setAppointment(null)
                setPhone('')
                setCode('')
                setError(null)
              }}
              className="w-full py-4 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors border-2 border-slate-200"
            >
              البحث عن موعد آخر
            </button>
            
            <a
              href="/book"
              className="block w-full py-4 text-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              حجز موعد جديد
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
