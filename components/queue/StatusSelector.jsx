'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { STATUS_FLOW, APPOINTMENT_STATUSES } from '@/lib/constants'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function StatusSelector({ appointment, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const handleStatusChange = async (newStatus) => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointment.id)
      
      if (updateError) throw updateError
      
      onClose()
    } catch (err) {
      console.error('Failed to update status:', err)
      setError('فشل تحديث الحالة')
    } finally {
      setLoading(false)
    }
  }
  
  // Get available next statuses
  const currentIndex = STATUS_FLOW.indexOf(appointment.status)
  const availableStatuses = currentIndex >= 0 
    ? STATUS_FLOW.slice(currentIndex + 1)
    : STATUS_FLOW
  
  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {availableStatuses.map(status => (
        <button
          key={status}
          onClick={() => handleStatusChange(status)}
          disabled={loading}
          className="w-full p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-primary-500 transition-colors text-right disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-800">
              {APPOINTMENT_STATUSES[status]}
            </span>
            {loading && (
              <LoadingSpinner size="sm" />
            )}
          </div>
        </button>
      ))}
      
      {/* Cancel option */}
      {appointment.status !== 'canceled' && appointment.status !== 'completed' && (
        <>
          <div className="border-t border-slate-200 my-4" />
          <button
            onClick={() => handleStatusChange('canceled')}
            disabled={loading}
            className="w-full p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:border-red-500 transition-colors text-right disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-red-700">إلغاء الموعد</span>
              {loading && (
                <LoadingSpinner size="sm" />
              )}
            </div>
          </button>
        </>
      )}
    </div>
  )
}
