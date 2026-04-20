'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getAvailableSlots } from '@/lib/utils/slots'
import { formatTimeAr } from '@/lib/utils/formatters'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function TimeSelector({ date, settings, onSelect }) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadSlots()
  }, [date])
  
  async function loadSlots() {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Call RPC to get booked times for this date
      const { data, error: rpcError } = await supabase
        .rpc('get_available_slots', { p_date: date })
      
      if (rpcError) throw rpcError
      
      // Generate available slots
      const availableSlots = getAvailableSlots(
        date,
        settings.shift_config,
        data.booked_times || [],
        settings.shift_config.blocked_dates || []
      )
      
      setSlots(availableSlots)
    } catch (err) {
      console.error('Failed to load slots:', err)
      setError('فشل تحميل المواعيد المتاحة')
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={loadSlots}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }
  
  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-slate-200">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-600">لا توجد مواعيد متاحة في هذا اليوم</p>
      </div>
    )
  }
  
  // Group slots by time of day
  const morningSlots = slots.filter(time => {
    const hour = parseInt(time.split(':')[0])
    return hour < 12
  })
  
  const afternoonSlots = slots.filter(time => {
    const hour = parseInt(time.split(':')[0])
    return hour >= 12 && hour < 17
  })
  
  const eveningSlots = slots.filter(time => {
    const hour = parseInt(time.split(':')[0])
    return hour >= 17
  })
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">اختر الوقت</h2>
        <p className="text-slate-600">المواعيد المتاحة</p>
      </div>
      
      {morningSlots.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">صباحاً</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {morningSlots.map(time => (
              <button
                key={time}
                onClick={() => onSelect(time)}
                className="py-3 px-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-semibold hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-colors text-sm"
              >
                {formatTimeAr(time)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {afternoonSlots.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">ظهراً</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {afternoonSlots.map(time => (
              <button
                key={time}
                onClick={() => onSelect(time)}
                className="py-3 px-3 bg-orange-50 border border-orange-200 text-orange-900 rounded-lg font-semibold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-colors text-sm"
              >
                {formatTimeAr(time)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {eveningSlots.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">مساءً</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {eveningSlots.map(time => (
              <button
                key={time}
                onClick={() => onSelect(time)}
                className="py-3 px-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors text-sm"
              >
                {formatTimeAr(time)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
