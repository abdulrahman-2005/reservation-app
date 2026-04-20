'use client'

import { formatEGP, formatDateShortAr } from '@/lib/utils/formatters'
import { PAYMENT_METHODS } from '@/lib/constants'

export default function TransactionHistory({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">لا توجد معاملات مسجلة</p>
      </div>
    )
  }
  
  // Calculate totals
  const totalExpected = transactions.reduce((sum, t) => sum + (parseFloat(t.amount_expected) || 0), 0)
  const totalPaid = transactions.reduce((sum, t) => sum + (parseFloat(t.amount_paid) || 0), 0)
  const balance = totalExpected - totalPaid
  
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-500 mb-1">متوقع</p>
            <p className="font-bold text-slate-800">{formatEGP(totalExpected)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">مدفوع</p>
            <p className="font-bold text-emerald-600">{formatEGP(totalPaid)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">متبقي</p>
            <p className={`font-bold ${balance > 0 ? 'text-amber-600' : balance < 0 ? 'text-blue-600' : 'text-slate-400'}`}>
              {formatEGP(Math.abs(balance))}
            </p>
          </div>
        </div>
      </div>
      
      {/* Transaction list */}
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div key={transaction.id} className="bg-white border-2 border-slate-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-500">
                    معاملة #{transactions.length - index}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDateShortAr(transaction.created_at)}
                  </span>
                </div>
                
                {transaction.payment_method && (
                  <p className="text-sm text-slate-600">
                    {PAYMENT_METHODS[transaction.payment_method]}
                  </p>
                )}
                
                {transaction.notes && (
                  <p className="text-sm text-slate-500 mt-1">{transaction.notes}</p>
                )}
              </div>
              
              <div className="text-left">
                {transaction.amount_expected > 0 && (
                  <p className="text-sm text-slate-500">
                    متوقع: {formatEGP(transaction.amount_expected)}
                  </p>
                )}
                {transaction.amount_paid > 0 && (
                  <p className="text-lg font-bold text-emerald-600">
                    {formatEGP(transaction.amount_paid)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
