'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ERROR_MESSAGES } from '@/lib/constants'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function PatientForm({ bookingData, updateBookingData, onComplete }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const validatePhone = (phone) => {
    return /^01[0-9]{9}$/.test(phone)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validate inputs
    if (!bookingData.name || bookingData.name.trim().length < 3) {
      setError('يرجى إدخال الاسم الكامل (3 أحرف على الأقل)')
      return
    }
    
    if (!validatePhone(bookingData.phone)) {
      setError(ERROR_MESSAGES.invalid_phone)
      return
    }
    
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Call the book_appointment RPC
      const { data, error: rpcError } = await supabase
        .rpc('book_appointment', {
          p_name: bookingData.name.trim(),
          p_phone: bookingData.phone,
          p_date: bookingData.date,
          p_time: bookingData.time,
          p_type: bookingData.type,
          p_booked_by: 'patient_online'
        })
      
      if (rpcError) {
        console.error('RPC error:', rpcError)
        throw new Error('server_error')
      }
      
      if (!data.success) {
        throw new Error(data.error)
      }
      
      // Success!
      onComplete(data.code)
      
    } catch (err) {
      console.error('Booking error:', err)
      const errorKey = err.message || 'server_error'
      setError(ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.server_error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">بياناتك</h2>
        <p className="text-slate-600">أدخل معلوماتك لإتمام الحجز</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5 border border-slate-200">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
            الاسم الكامل
          </label>
          <input
            type="text"
            id="name"
            value={bookingData.name}
            onChange={(e) => updateBookingData('name', e.target.value)}
            placeholder="أحمد محمد"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all text-slate-900"
            required
            disabled={loading}
          />
        </div>
        
        {/* Phone field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            id="phone"
            value={bookingData.phone}
            onChange={(e) => updateBookingData('phone', e.target.value)}
            placeholder="01012345678"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all text-slate-900 text-left"
            dir="ltr"
            required
            disabled={loading}
            maxLength={11}
          />
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            يجب أن يبدأ بـ 01 ويتكون من 11 رقماً
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-cyan-600 text-white rounded-lg font-semibold text-base hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="border-white border-t-transparent" />
              جاري الحجز...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              تأكيد الحجز
            </>
          )}
        </button>
        
        {/* Privacy note */}
        <p className="text-xs text-slate-500 text-center leading-relaxed bg-slate-50 rounded-lg p-3">
          🔒 بياناتك آمنة ومحمية. نستخدمها فقط للتواصل معك بخصوص موعدك
        </p>
      </form>
    </div>
  )
}
