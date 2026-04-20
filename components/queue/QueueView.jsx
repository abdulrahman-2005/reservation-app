'use client'

import { useState } from 'react'
import { useRealtimeQueue } from '@/hooks/useRealtimeQueue'
import PatientCard from './PatientCard'
import { formatDateAr } from '@/lib/utils/formatters'

export default function QueueView({ initialAppointments }) {
  const appointments = useRealtimeQueue(initialAppointments)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filter appointments by search query
  const filteredAppointments = appointments.filter(apt => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      apt.patients.full_name.toLowerCase().includes(query) ||
      apt.patients.phone.includes(query) ||
      apt.reservation_code.toLowerCase().includes(query)
    )
  })
  
  // Group by status
  const pending = filteredAppointments.filter(a => a.status === 'pending' || a.status === 'confirmed')
  const active = filteredAppointments.filter(a => a.status === 'arrived' || a.status === 'in_session')
  const completed = filteredAppointments.filter(a => a.status === 'completed')
  const canceled = filteredAppointments.filter(a => a.status === 'canceled')
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">طابور اليوم</h1>
              <p className="text-sm text-white/80">{formatDateAr(new Date())}</p>
            </div>
            <div className="text-left bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-2xl font-bold text-white">{appointments.length}</div>
              <div className="text-xs text-white/80">موعد</div>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، الهاتف، أو كود الحجز..."
              className="w-full px-4 py-3 pr-12 border-2 border-white/30 bg-white/95 backdrop-blur-sm rounded-xl focus:border-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-slate-800 placeholder:text-slate-400"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Queue sections */}
      <div className="p-4 space-y-6">
        {/* Active patients */}
        {active.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-600 mb-3">قيد الفحص</h2>
            <div className="space-y-3">
              {active.map(appointment => (
                <PatientCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </section>
        )}
        
        {/* Pending patients */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-600 mb-3">في الانتظار</h2>
            <div className="space-y-3">
              {pending.map(appointment => (
                <PatientCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </section>
        )}
        
        {/* Completed patients */}
        {completed.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-600 mb-3">مكتمل</h2>
            <div className="space-y-3">
              {completed.map(appointment => (
                <PatientCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </section>
        )}
        
        {/* Canceled patients */}
        {canceled.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-600 mb-3">ملغي</h2>
            <div className="space-y-3">
              {canceled.map(appointment => (
                <PatientCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </section>
        )}
        
        {/* Empty state */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600">
              {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مواعيد اليوم'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
