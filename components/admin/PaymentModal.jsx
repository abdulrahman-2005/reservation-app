'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PAYMENT_METHODS, ERROR_MESSAGES } from '@/lib/constants'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function PaymentModal({ appointment, onSuccess }) {
  const [amountExpected, setAmountExpected] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    const expected = parseFloat(amountExpected) || 0
    const paid = parseFloat(amountPaid) || 0
    
    if (expected < 0 || paid < 0) {
      setError('المبالغ يجب أن تكون موجبة')
      return
    }
    
    if (expected === 0 && paid === 0) {
      setError('يرجى إدخال مبلغ واحد على الأقل')
      return
    }
    
    setLoading(true)
    
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error: insertError } = await supabase
        .from('transactions')
        .insert({
          appointment_id: appointment.id,
          patient_id: appointment.patient_id,
          amount_expected: expected,
          amount_paid: paid,
          payment_method: paid > 0 ? paymentMethod : null,
          notes: notes || null,
          logged_by: user?.id,
        })
      
      if (insertError) throw insertError
      
      onSuccess()
      
      // Reload page to refresh data
      window.location.reload()
    } catch (err) {
      console.error('Failed to log payment:', err)
      setError(ERROR_MESSAGES.server_error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient info */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h3 className="font-semibold text-slate-800">{appointment.patients.full_name}</h3>
        <p className="text-sm text-slate-500">{appointment.patients.phone}</p>
      </div>
      
      {/* Amount Expected */}
      <div>
        <label htmlFor="amount-expected" className="block text-sm font-medium text-slate-700 mb-2">
          المبلغ المتوقع (ج.م)
        </label>
        <input
          type="number"
          id="amount-expected"
          value={amountExpected}
          onChange={(e) => setAmountExpected(e.target.value)}
          placeholder="500"
          step="0.01"
          min="0"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
          disabled={loading}
        />
      </div>
      
      {/* Amount Paid */}
      <div>
        <label htmlFor="amount-paid" className="block text-sm font-medium text-slate-700 mb-2">
          المبلغ المدفوع (ج.م)
        </label>
        <input
          type="number"
          id="amount-paid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="500"
          step="0.01"
          min="0"
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
          disabled={loading}
        />
      </div>
      
      {/* Payment Method */}
      {parseFloat(amountPaid) > 0 && (
        <div>
          <label htmlFor="payment-method" className="block text-sm font-medium text-slate-700 mb-2">
            طريقة الدفع
          </label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800"
            disabled={loading}
          >
            {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* Notes */}
      <div>
        <label htmlFor="payment-notes" className="block text-sm font-medium text-slate-700 mb-2">
          ملاحظات (اختياري)
        </label>
        <textarea
          id="payment-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: دفعة أولى من 2، متابعة..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-slate-800 resize-none"
          disabled={loading}
        />
      </div>
      
      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
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
            جاري الحفظ...
          </>
        ) : (
          'تسجيل الدفعة'
        )}
      </button>
    </form>
  )
}
