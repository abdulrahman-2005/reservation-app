'use client'

import { formatEGP } from '@/lib/utils/formatters'

export default function RevenueCards({ today, week, month, pending }) {
  const cards = [
    {
      label: 'اليوم',
      amount: today,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-accent-500 to-accent-600',
      bgGradient: 'from-accent-50 to-accent-100',
    },
    {
      label: 'هذا الأسبوع',
      amount: week,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-success-500 to-success-600',
      bgGradient: 'from-success-50 to-success-100',
    },
    {
      label: 'هذا الشهر',
      amount: month,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100',
    },
    {
      label: 'رصيد معلق',
      amount: pending,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
    },
  ]
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white shadow-md`}>
              {card.icon}
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">{card.label}</p>
          <p className="text-2xl font-bold text-slate-800">{formatEGP(card.amount)}</p>
        </div>
      ))}
    </div>
  )
}
