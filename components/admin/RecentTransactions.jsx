'use client'

import { formatEGP, formatDateShortAr } from '@/lib/utils/formatters'
import { PAYMENT_METHODS } from '@/lib/constants'

export default function RecentTransactions({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">آخر المعاملات</h2>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-slate-600">لا توجد معاملات بعد</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">آخر المعاملات</h2>
        <a
          href="/admin/ledger"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          عرض الكل ←
        </a>
      </div>
      
      <div className="space-y-3">
        {transactions.map(transaction => {
          const balance = (parseFloat(transaction.amount_expected) || 0) - (parseFloat(transaction.amount_paid) || 0)
          
          return (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{transaction.patients?.full_name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <span>{formatDateShortAr(transaction.appointments?.date)}</span>
                  {transaction.payment_method && (
                    <>
                      <span>•</span>
                      <span>{PAYMENT_METHODS[transaction.payment_method]}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="text-left">
                <p className="font-bold text-slate-800">{formatEGP(transaction.amount_paid)}</p>
                {balance > 0 && (
                  <p className="text-xs text-amber-600">متبقي: {formatEGP(balance)}</p>
                )}
                {balance === 0 && transaction.amount_expected > 0 && (
                  <p className="text-xs text-emerald-600">مدفوع بالكامل</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
