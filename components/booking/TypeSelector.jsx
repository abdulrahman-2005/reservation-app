'use client'

import { APPOINTMENT_TYPES } from '@/lib/constants'

export default function TypeSelector({ onSelect }) {
  const types = [
    {
      key: 'checkup',
      label: APPOINTMENT_TYPES.checkup,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      description: 'فحص دوري شامل',
      color: 'cyan',
    },
    {
      key: 'cleaning',
      label: APPOINTMENT_TYPES.cleaning,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      description: 'تنظيف وتلميع',
      color: 'emerald',
    },
    {
      key: 'filling',
      label: APPOINTMENT_TYPES.filling,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      description: 'حشو الأسنان',
      color: 'blue',
    },
    {
      key: 'extraction',
      label: APPOINTMENT_TYPES.extraction,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'خلع الأسنان',
      color: 'amber',
    },
    {
      key: 'consultation',
      label: APPOINTMENT_TYPES.consultation,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      description: 'استشارة طبية',
      color: 'slate',
    },
  ]
  
  const colorClasses = {
    cyan: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-600 hover:border-cyan-600 text-cyan-700 hover:text-white',
    emerald: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-600 hover:border-emerald-600 text-emerald-700 hover:text-white',
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-600 hover:border-blue-600 text-blue-700 hover:text-white',
    amber: 'bg-amber-50 border-amber-200 hover:bg-amber-600 hover:border-amber-600 text-amber-700 hover:text-white',
    slate: 'bg-slate-50 border-slate-200 hover:bg-slate-600 hover:border-slate-600 text-slate-700 hover:text-white',
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">نوع الموعد</h2>
        <p className="text-slate-600">اختر نوع الخدمة المطلوبة</p>
      </div>
      
      <div className="grid gap-3">
        {types.map((type) => (
          <button
            key={type.key}
            onClick={() => onSelect(type.key)}
            className={`group flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 ${colorClasses[type.color]}`}
          >
            <div className="shrink-0">
              {type.icon}
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-lg font-bold mb-0.5">{type.label}</h3>
              <p className="text-sm opacity-75">{type.description}</p>
            </div>
            <svg className="w-6 h-6 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
