'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useClinicSettings } from '@/hooks/useClinicSettings'
import { getAvailableSlots } from '@/lib/utils/slots'
import { formatTimeAr, formatDateISO } from '@/lib/utils/formatters'
import { APPOINTMENT_TYPES, ERROR_MESSAGES } from '@/lib/constants'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function WalkInForm({ onSuccess }) {
  const { settings } = useClinicSettings()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState('consultation')
  const [time, setTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [error, setError] = useState(null)
  
  const today = formatDateISO(new Date())
  
  useEffect(() => {
    if (settings) {
      loadAvailableSlots()
    }
  }, [settings])
  
  async function loadAvailableSlots() {
    setLoadingSlots(true)
    try {
      const supabase = createClient()
      
      const { data } = await supabase
        .rpc('get_available_slots', { p_date: today })
      
      const slots = getAvailableSlots(
        today,
        settings.shift_config,
        data?.booked_times || [],
        settings.shift_config.blocked_dates || []
      )
      
      setAvailableSlots(slots)
      if (slots.length > 0) {
        setTime(slots[0])
      }
    } catch (err) {
      console.error('Failed to load slots:', err)
    } finally {
      setLoadingSlots(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!name || name.trim().length < 3) {
      setError('يرجى إدخال الاسم الكامل')
      return
    }
    
    if (!/^01[0-9]{9}$/.test(phone)) {
      setError(ERROR_MESSAGES.invalid_phone)
      return
    }
    
    if (!time) {
      setError('يرجى اختيار وقت الموعد')
      return
    }
    
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      const { data, error: rpcError } = await supabase
        .rpc('book_appointment', {
          p_name: name.trim(),
          p_phone: phone,
          p_date: today,
          p_time: time,
          p_type: type,
          p_booked_by: 'walk_in'
        })
      
      if (rpcError) throw rpcError
      
      if (!data.success) {
        throw new Error(data.error)
      }
      
      onSuccess()
    } catch (err) {
      console.error('Walk-in booking error:', err)
      const errorKey = err.message || 'server_error'
      setError(ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.server_error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loadingSlots) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-600">لا توجد مواعيد متاحة اليوم</p>
      </div>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="walk-in-name" className="block text-sm font-medium text-slate-700 mb-2">
          الاسم الكامل
        </label>
        <input
          type="text"
          id="walk-in-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أحمد محمد"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
          required
          disabled={loading}
        />
      </div>
      
      {/* Phone */}
      <div>
        <label htmlFor="walk-in-phone" className="block text-sm font-medium text-slate-700 mb-2">
          رقم الهاتف
        </label>
        <input
          type="tel"
          id="walk-in-phone"
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
      
      {/* Type */}
      <div>
        <label htmlFor="walk-in-type" className="block text-sm font-medium text-slate-700 mb-2">
          نوع الموعد
        </label>
        <select
          id="walk-in-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
          disabled={loading}
        >
          {Object.entries(APPOINTMENT_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      
      {/* Time */}
      <div>
        <label htmlFor="walk-in-time" className="block text-sm font-medium text-slate-700 mb-2">
          الوقت
        </label>
        <select
          id="walk-in-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
          disabled={loading}
        >
          {availableSlots.map(slot => (
            <option key={slot} value={slot}>{formatTimeAr(slot)}</option>
          ))}
        </select>
      </div>
      
      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            جاري الإضافة...
          </>
        ) : (
          'إضافة إلى الطابور'
        )}
      </button>
    </form>
  )
}
