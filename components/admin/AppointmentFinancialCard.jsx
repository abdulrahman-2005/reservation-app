'use client'

import { useState } from 'react'
import { formatDateAr, formatTimeAr, formatEGP } from '@/lib/utils/formatters'
import { APPOINTMENT_TYPES } from '@/lib/constants'
import StatusPill from '@/components/ui/StatusPill'
import BottomSheet from '@/components/ui/BottomSheet'
import PaymentModal from './PaymentModal'
import TransactionHistory from './TransactionHistory'

export default function AppointmentFinancialCard({ appointment }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  
  // Calculate financial summary
  const transactions = appointment.transactions || []
  const totalExpected = transactions.reduce((sum, t) => sum + (parseFloat(t.amount_expected) || 0), 0)
  const totalPaid = transactions.reduce((sum, t) => sum + (parseFloat(t.amount_paid) || 0), 0)
  const balance = totalExpected - totalPaid
  
  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {appointment.patients.full_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>{formatDateAr(appointment.date)}</span>
              <span>•</span>
              <span>{formatTimeAr(appointment.start_time)}</span>
              <span>•</span>
              <span>{APPOINTMENT_TYPES[appointment.type]}</span>
            </div>
          </div>
          <StatusPill status={appointment.status} />
        </div>
        
        {/* Financial summary */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 mb-3 border border-slate-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500 mb-1">متوقع</p>
              <p className="font-bold text-slate-800">{formatEGP(totalExpected)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">مدفوع</p>
              <p className="font-bold text-success-600">{formatEGP(totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">متبقي</p>
              <p className={`font-bold ${balance > 0 ? 'text-amber-600' : balance < 0 ? 'text-accent-600' : 'text-slate-400'}`}>
                {formatEGP(Math.abs(balance))}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            تسجيل دفعة
          </button>
          
          {transactions.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              className="py-3 px-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 rounded-xl font-medium hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Payment Modal */}
      <BottomSheet
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="تسجيل دفعة"
      >
        <PaymentModal
          appointment={appointment}
          onSuccess={() => setShowPaymentModal(false)}
        />
      </BottomSheet>
      
      {/* Transaction History */}
      <BottomSheet
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        title="سجل المعاملات"
      >
        <TransactionHistory transactions={transactions} />
      </BottomSheet>
    </>
  )
}
